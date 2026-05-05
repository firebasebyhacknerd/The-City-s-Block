"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Admin access required.");
  }
  return session;
}

export async function toggleFeaturedAction(id: number) {
  await requireAdmin();
  await sql`UPDATE listings SET featured = NOT featured, updated_at = NOW() WHERE id = ${id}`;
  revalidatePath("/admin/listings");
  revalidatePath("/");
  return { ok: true };
}

export async function changeUserRoleAction(id: number, role: string) {
  const session = await requireAdmin();
  if (session.id === id) return { ok: false, message: "Cannot change your own role." };
  await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function getAllListingsAction() {
  await requireAdmin();
  const rows = await sql`
    SELECT l.*, u.name as owner_name, u.email as owner_email
    FROM listings l
    JOIN users u ON u.id = l.user_id
    ORDER BY l.created_at DESC
  `;
  return rows;
}

export async function approveListingAction(id: number) {
  await requireAdmin();
  await sql`UPDATE listings SET status = 'active', verified = TRUE, updated_at = NOW() WHERE id = ${id}`;
  revalidatePath("/admin/listings");
  revalidatePath("/");
  return { ok: true };
}

export async function rejectListingAction(id: number, reason: string) {
  await requireAdmin();
  await sql`UPDATE listings SET status = 'rejected', rejection_reason = ${reason}, updated_at = NOW() WHERE id = ${id}`;
  revalidatePath("/admin/listings");
  return { ok: true };
}

export async function deleteListingAdminAction(id: number) {
  await requireAdmin();
  await sql`DELETE FROM listings WHERE id = ${id}`;
  revalidatePath("/admin/listings");
  return { ok: true };
}

export async function getAllUsersAction() {
  await requireAdmin();
  const rows = await sql`SELECT id, name, email, role, city, verified, banned, created_at FROM users ORDER BY created_at DESC`;
  return rows;
}

export async function verifyUserAction(id: number) {
  await requireAdmin();
  await sql`UPDATE users SET verified = TRUE WHERE id = ${id}`;
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function banUserAction(id: number) {
  await requireAdmin();
  await sql`UPDATE users SET banned = TRUE WHERE id = ${id}`;
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function unbanUserAction(id: number) {
  await requireAdmin();
  await sql`UPDATE users SET banned = FALSE WHERE id = ${id}`;
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function getAllInquiriesAction() {
  await requireAdmin();
  const rows = await sql`
    SELECT i.*, l.title as listing_title
    FROM inquiries i
    JOIN listings l ON l.id = i.listing_id
    ORDER BY i.created_at DESC
  `;
  return rows;
}

export async function getAdminStatsAction() {
  await requireAdmin();
  const [listings, users, inquiries, pending] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM listings WHERE status = 'active'`,
    sql`SELECT COUNT(*) as count FROM users`,
    sql`SELECT COUNT(*) as count FROM inquiries`,
    sql`SELECT COUNT(*) as count FROM listings WHERE status = 'pending'`,
  ]);
  return {
    activeListings: Number(listings[0].count),
    totalUsers: Number(users[0].count),
    totalInquiries: Number(inquiries[0].count),
    pendingListings: Number(pending[0].count),
  };
}

export async function getAgentBySlugAction(slug: string) {
  // Parse the numeric ID from the END of the slug (format: "name-parts-{id}")
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);

  if (isNaN(id) || id <= 0) return null;

  const userRows = await sql`
    SELECT id, name, email, role, city, bio, company, verified, created_at
    FROM users
    WHERE id = ${id} AND role = 'agent'
    LIMIT 1
  `;

  if (userRows.length === 0) return null;

  const listingRows = await sql`
    SELECT * FROM listings
    WHERE user_id = ${id} AND status = 'active'
    ORDER BY created_at DESC
  `;

  return { user: userRows[0], listings: listingRows };
}

export async function getLocalityStatsAction() {
  await requireAdmin();
  const rows = await sql`
    SELECT city, COUNT(*) as listing_count
    FROM listings
    WHERE status = 'active'
    GROUP BY city
    ORDER BY listing_count DESC
  `;
  return rows;
}
