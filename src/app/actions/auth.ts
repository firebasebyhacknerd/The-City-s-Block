"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { createSession, deleteSession, getSession } from "@/lib/auth";
import { insertAdminNotification } from "@/app/actions/notifications";

const VALID_SIGNUP_ROLES = ["buyer", "owner", "agent"] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_BIO_LENGTH = 1000;
const MAX_CITY_LENGTH = 100;
const MAX_PHONE_LENGTH = 20;

export async function signUpAction(formData: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  city?: string;
}) {
  const name = String(formData.name ?? "").trim().slice(0, MAX_NAME_LENGTH);
  const email = String(formData.email ?? "").trim().toLowerCase();
  const password = String(formData.password ?? "");

  if (!name || !email || !password) {
    return { ok: false, message: "Name, email and password are required." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return { ok: false, message: "An account with this email already exists." };
  }

  const hash = await bcrypt.hash(password, 12);
  // Validate role — never allow "admin" via signup
  const role = VALID_SIGNUP_ROLES.includes(formData.role as any) ? formData.role : "buyer";
  const phone = formData.phone ? String(formData.phone).trim().slice(0, MAX_PHONE_LENGTH) : null;
  const city = formData.city ? String(formData.city).trim().slice(0, MAX_CITY_LENGTH) : null;

  const rows = await sql`
    INSERT INTO users (name, email, password, role, phone, city)
    VALUES (${name}, ${email}, ${hash}, ${role}, ${phone}, ${city})
    RETURNING id, name, email, role
  `;

  const user = rows[0];
  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role as any });

  // Non-critical notification — fire and forget
  await insertAdminNotification(
    "user_registered",
    `New user registered: ${name} (${email}) as ${role}`,
    user.id,
    "user"
  );

  return { ok: true, message: "Account created successfully.", role: user.role };
}

export async function signInAction(formData: { email: string; password: string }) {
  const email = String(formData.email ?? "").trim().toLowerCase();
  const password = String(formData.password ?? "");

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  if (rows.length === 0) {
    // Use same message as wrong password to prevent user enumeration
    return { ok: false, message: "Invalid email or password." };
  }

  const user = rows[0];
  if (user.banned) {
    return { ok: false, message: "This account has been suspended." };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { ok: false, message: "Invalid email or password." };
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

  const name = String(formData.name ?? "").trim().slice(0, MAX_NAME_LENGTH);
  if (!name) return { ok: false, message: "Name is required." };

  const phone = formData.phone ? String(formData.phone).trim().slice(0, MAX_PHONE_LENGTH) : null;
  const city = formData.city ? String(formData.city).trim().slice(0, MAX_CITY_LENGTH) : null;
  const bio = formData.bio ? String(formData.bio).trim().slice(0, MAX_BIO_LENGTH) : null;

  await sql`UPDATE users SET name=${name}, phone=${phone}, city=${city}, bio=${bio} WHERE id=${session.id}`;
  // Refresh session cookie with new name
  await createSession({ ...session, name });
  revalidatePath("/dashboard/profile");
  return { ok: true, message: "Profile updated successfully." };
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Not authenticated." };

  const current = String(currentPassword ?? "");
  const next = String(newPassword ?? "");

  if (next.length < 8) return { ok: false, message: "New password must be at least 8 characters." };

  const rows = await sql`SELECT password FROM users WHERE id=${session.id}`;
  if (!rows[0]) return { ok: false, message: "User not found." };

  const valid = await bcrypt.compare(current, rows[0].password);
  if (!valid) return { ok: false, message: "Current password is incorrect." };

  const hash = await bcrypt.hash(next, 12);
  await sql`UPDATE users SET password=${hash} WHERE id=${session.id}`;
  return { ok: true, message: "Password changed successfully." };
}
