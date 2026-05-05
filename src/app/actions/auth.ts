"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { createSession, deleteSession, getSession } from "@/lib/auth";

export async function signUpAction(formData: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  city?: string;
}) {
  if (!formData.name || !formData.email || !formData.password) {
    return { ok: false, message: "Name, email and password are required." };
  }
  if (formData.password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${formData.email}`;
  if (existing.length > 0) {
    return { ok: false, message: "An account with this email already exists." };
  }

  const hash = await bcrypt.hash(formData.password, 10);
  const role = ["buyer", "owner", "agent"].includes(formData.role) ? formData.role : "buyer";

  const rows = await sql`
    INSERT INTO users (name, email, password, role, phone, city)
    VALUES (${formData.name}, ${formData.email}, ${hash}, ${role}, ${formData.phone || null}, ${formData.city || null})
    RETURNING id, name, email, role
  `;

  const user = rows[0];
  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role as any });
  return { ok: true, message: "Account created successfully.", role: user.role };
}

export async function signInAction(formData: { email: string; password: string }) {
  if (!formData.email || !formData.password) {
    return { ok: false, message: "Email and password are required." };
  }

  const rows = await sql`SELECT * FROM users WHERE email = ${formData.email} LIMIT 1`;
  if (rows.length === 0) {
    return { ok: false, message: "No account found with this email." };
  }

  const user = rows[0];
  if (user.banned) {
    return { ok: false, message: "This account has been suspended." };
  }

  const valid = await bcrypt.compare(formData.password, user.password);
  if (!valid) {
    return { ok: false, message: "Incorrect password." };
  }

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  return { ok: true, message: "Signed in successfully.", role: user.role };
}

export async function signOutAction() {
  await deleteSession();
  redirect("/login");
}

export async function updateProfileAction(formData: {
  name: string;
  phone?: string;
  city?: string;
  bio?: string;
}) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Not authenticated." };
  if (!formData.name?.trim()) return { ok: false, message: "Name is required." };

  await sql`UPDATE users SET name=${formData.name}, phone=${formData.phone || null}, city=${formData.city || null}, bio=${formData.bio || null} WHERE id=${session.id}`;
  // Refresh session cookie with new name
  await createSession({ ...session, name: formData.name });
  revalidatePath("/dashboard/profile");
  return { ok: true, message: "Profile updated successfully." };
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Not authenticated." };
  if (newPassword.length < 6) return { ok: false, message: "New password must be at least 6 characters." };

  const rows = await sql`SELECT password FROM users WHERE id=${session.id}`;
  if (!rows[0]) return { ok: false, message: "User not found." };

  const valid = await bcrypt.compare(currentPassword, rows[0].password);
  if (!valid) return { ok: false, message: "Current password is incorrect." };

  const hash = await bcrypt.hash(newPassword, 10);
  await sql`UPDATE users SET password=${hash} WHERE id=${session.id}`;
  return { ok: true, message: "Password changed successfully." };
}
