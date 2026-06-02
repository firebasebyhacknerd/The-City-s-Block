"use server";

import sql from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Notification, NotificationType, ReferenceType } from "@/types";

// ─── Internal helpers (called by other actions, not exposed to client) ────────

export async function insertAdminNotification(
  type: NotificationType,
  message: string,
  referenceId: number | null,
  referenceType: ReferenceType | null
): Promise<void> {
  try {
    const admins = await sql`SELECT id FROM users WHERE role = 'admin'`;
    if (admins.length === 0) return;
    for (const admin of admins) {
      await sql`
        INSERT INTO notifications (user_id, type, message, reference_id, reference_type)
        VALUES (${admin.id}, ${type}, ${message}, ${referenceId}, ${referenceType})
      `;
    }
  } catch (err) {
    // Non-critical — log but don't fail the primary operation
    console.error("[notifications] insertAdminNotification failed:", err);
  }
}

export async function insertUserNotification(
  userId: number,
  type: NotificationType,
  message: string,
  referenceId: number | null,
  referenceType: ReferenceType | null
): Promise<void> {
  try {
    await sql`
      INSERT INTO notifications (user_id, type, message, reference_id, reference_type)
      VALUES (${userId}, ${type}, ${message}, ${referenceId}, ${referenceType})
    `;
  } catch (err) {
    console.error("[notifications] insertUserNotification failed:", err);
  }
}

// ─── Public server actions ────────────────────────────────────────────────────

export async function getMyNotificationsAction(): Promise<Notification[]> {
  const session = await getSession();
  if (!session) return [];
  const rows = await sql`
    SELECT * FROM notifications
    WHERE user_id = ${session.id}
    ORDER BY created_at DESC
    LIMIT 20
  `;
  return rows as Notification[];
}

export async function getUnreadCountAction(): Promise<number> {
  const session = await getSession();
  if (!session) return 0;
  const rows = await sql`
    SELECT COUNT(*) as count FROM notifications
    WHERE user_id = ${session.id} AND read = FALSE
  `;
  return Number(rows[0]?.count ?? 0);
}

export async function markNotificationReadAction(id: number): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  await sql`
    UPDATE notifications SET read = TRUE
    WHERE id = ${id} AND user_id = ${session.id}
  `;
  return { ok: true };
}

export async function markAllNotificationsReadAction(): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  await sql`
    UPDATE notifications SET read = TRUE
    WHERE user_id = ${session.id}
  `;
  return { ok: true };
}
