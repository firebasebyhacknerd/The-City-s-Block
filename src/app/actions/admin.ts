"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID_ROLES = ["buyer", "owner", "agent", "admin"] as const;
const VALID_STATUSES = ["draft", "published"] as const;
const MAX_TEXT_LENGTH = 5000;

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Admin access required.");
  }
  return session;
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export async function toggleFeaturedAction(id: number) {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  await sql`UPDATE listings SET featured = NOT featured, updated_at = NOW() WHERE id = ${id}`;
  revalidatePath("/admin/listings");
  revalidatePath("/");
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
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  await sql`UPDATE listings SET status = 'active', verified = TRUE, updated_at = NOW() WHERE id = ${id}`;
  revalidatePath("/admin/listings");
  revalidatePath("/");
  return { ok: true };
}

export async function rejectListingAction(id: number, reason: string) {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  const sanitizedReason = String(reason ?? "").slice(0, 500).trim();
  if (!sanitizedReason) return { ok: false, message: "Rejection reason is required." };
  await sql`UPDATE listings SET status = 'rejected', rejection_reason = ${sanitizedReason}, updated_at = NOW() WHERE id = ${id}`;
  revalidatePath("/admin/listings");
  return { ok: true };
}

export async function deleteListingAdminAction(id: number) {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  await sql`DELETE FROM listings WHERE id = ${id}`;
  revalidatePath("/admin/listings");
  revalidatePath("/");
  return { ok: true };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function changeUserRoleAction(id: number, role: string) {
  const session = await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  // Server-side self-change guard (not just client-side)
  if (session.id === id) return { ok: false, message: "Cannot change your own role." };
  // Validate role against allowed list — prevents role escalation
  if (!VALID_ROLES.includes(role as any)) {
    return { ok: false, message: "Invalid role." };
  }
  await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function getAllUsersAction() {
  await requireAdmin();
  // Never return password hash
  const rows = await sql`SELECT id, name, email, role, city, verified, banned, created_at FROM users ORDER BY created_at DESC`;
  return rows;
}

export async function verifyUserAction(id: number) {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  await sql`UPDATE users SET verified = TRUE WHERE id = ${id}`;
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function banUserAction(id: number) {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  await sql`UPDATE users SET banned = TRUE WHERE id = ${id}`;
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function unbanUserAction(id: number) {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  await sql`UPDATE users SET banned = FALSE WHERE id = ${id}`;
  revalidatePath("/admin/users");
  return { ok: true };
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

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

// ─── Stats ────────────────────────────────────────────────────────────────────

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

// ─── Bulk listing actions ─────────────────────────────────────────────────────

function validateIds(ids: number[]): boolean {
  return Array.isArray(ids) && ids.length > 0 && ids.every((id) => Number.isInteger(id) && id > 0);
}

export async function bulkApproveListingsAction(ids: number[]): Promise<{ ok: boolean; count: number; message?: string }> {
  await requireAdmin();
  if (!validateIds(ids)) return { ok: false, count: 0, message: "No valid items selected." };
  await sql`UPDATE listings SET status = 'active', verified = TRUE, updated_at = NOW() WHERE id = ANY(${ids})`;
  revalidatePath("/admin/listings");
  revalidatePath("/");
  return { ok: true, count: ids.length };
}

export async function bulkRejectListingsAction(ids: number[], reason: string): Promise<{ ok: boolean; count: number; message?: string }> {
  await requireAdmin();
  if (!validateIds(ids)) return { ok: false, count: 0, message: "No valid items selected." };
  const sanitizedReason = String(reason ?? "").slice(0, 500).trim();
  if (!sanitizedReason) return { ok: false, count: 0, message: "Rejection reason is required." };
  await sql`UPDATE listings SET status = 'rejected', rejection_reason = ${sanitizedReason}, updated_at = NOW() WHERE id = ANY(${ids})`;
  revalidatePath("/admin/listings");
  return { ok: true, count: ids.length };
}

export async function bulkDeleteListingsAction(ids: number[]): Promise<{ ok: boolean; count: number; message?: string }> {
  await requireAdmin();
  if (!validateIds(ids)) return { ok: false, count: 0, message: "No valid items selected." };
  await sql`DELETE FROM listings WHERE id = ANY(${ids})`;
  revalidatePath("/admin/listings");
  revalidatePath("/");
  return { ok: true, count: ids.length };
}

// ─── Bulk user actions ────────────────────────────────────────────────────────

export async function bulkVerifyUsersAction(ids: number[]): Promise<{ ok: boolean; count: number; message?: string }> {
  await requireAdmin();
  if (!validateIds(ids)) return { ok: false, count: 0, message: "No valid items selected." };
  await sql`UPDATE users SET verified = TRUE WHERE id = ANY(${ids})`;
  revalidatePath("/admin/users");
  return { ok: true, count: ids.length };
}

export async function bulkBanUsersAction(ids: number[]): Promise<{ ok: boolean; count: number; message?: string }> {
  const session = await requireAdmin();
  if (!validateIds(ids)) return { ok: false, count: 0, message: "No valid items selected." };
  // Prevent banning yourself or other admins
  const filteredIds = ids.filter((id) => id !== session.id);
  if (!filteredIds.length) return { ok: false, count: 0, message: "Cannot ban yourself." };
  // Don't ban other admins
  await sql`UPDATE users SET banned = TRUE WHERE id = ANY(${filteredIds}) AND role != 'admin'`;
  revalidatePath("/admin/users");
  return { ok: true, count: filteredIds.length };
}

// ─── Project CRUD actions ─────────────────────────────────────────────────────

export async function getProjectsAction() {
  await requireAdmin();
  const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return rows;
}

export async function getPublicProjectsAction() {
  const rows = await sql`SELECT * FROM projects WHERE status = 'published' ORDER BY created_at DESC`;
  return rows;
}

export async function createProjectAction(data: {
  name: string;
  developer?: string;
  city: string;
  locality?: string;
  description?: string;
  status: "draft" | "published";
  image_url?: string;
}): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const name = String(data.name ?? "").trim();
  const city = String(data.city ?? "").trim();
  if (!name) return { ok: false, message: "Project name is required." };
  if (!city) return { ok: false, message: "City is required." };
  // Validate status
  if (!VALID_STATUSES.includes(data.status)) return { ok: false, message: "Invalid status." };
  const description = data.description ? String(data.description).slice(0, MAX_TEXT_LENGTH) : null;

  await sql`
    INSERT INTO projects (name, developer, city, locality, description, status, image_url)
    VALUES (
      ${name}, ${data.developer?.trim() || null}, ${city},
      ${data.locality?.trim() || null}, ${description},
      ${data.status}, ${data.image_url?.trim() || null}
    )
  `;
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { ok: true, message: "Project created." };
}

export async function updateProjectAction(
  id: number,
  data: {
    name?: string;
    developer?: string;
    city?: string;
    locality?: string;
    description?: string;
    status?: "draft" | "published";
    image_url?: string;
  }
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  if (data.status && !VALID_STATUSES.includes(data.status)) return { ok: false, message: "Invalid status." };
  const description = data.description ? String(data.description).slice(0, MAX_TEXT_LENGTH) : data.description;

  await sql`
    UPDATE projects SET
      name        = COALESCE(${data.name?.trim() ?? null}, name),
      developer   = COALESCE(${data.developer?.trim() ?? null}, developer),
      city        = COALESCE(${data.city?.trim() ?? null}, city),
      locality    = COALESCE(${data.locality?.trim() ?? null}, locality),
      description = COALESCE(${description ?? null}, description),
      status      = COALESCE(${data.status ?? null}, status),
      image_url   = COALESCE(${data.image_url?.trim() ?? null}, image_url),
      updated_at  = NOW()
    WHERE id = ${id}
  `;
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { ok: true, message: "Project updated." };
}

export async function deleteProjectAction(id: number): Promise<{ ok: boolean }> {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false };
  await sql`DELETE FROM projects WHERE id = ${id}`;
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { ok: true };
}

// ─── Pipeline action ──────────────────────────────────────────────────────────

export async function getPipelineAction() {
  const session = await getSession();
  if (!session) return { new: [], contacted: [], closed: [] };
  // Only brokers have a pipeline
  if (!["agent", "owner"].includes(session.role)) return { new: [], contacted: [], closed: [] };

  const rows = await sql`
    SELECT i.*, l.title as listing_title
    FROM inquiries i
    JOIN listings l ON l.id = i.listing_id
    WHERE l.user_id = ${session.id}
    ORDER BY i.created_at DESC
  `;

  return {
    new: rows.filter((r: any) => r.status === "new"),
    contacted: rows.filter((r: any) => r.status === "contacted"),
    closed: rows.filter((r: any) => r.status === "closed"),
  };
}
