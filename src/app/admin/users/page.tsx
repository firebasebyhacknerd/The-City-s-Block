import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllUsersAction } from "@/app/actions/admin";
import { getMyNotificationsAction, getUnreadCountAction } from "@/app/actions/notifications";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import { NotificationBell } from "@/components/shared/NotificationBell";

export const metadata = { title: "Users | Admin Console" };

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  let users: any[] = [];
  let notifications: any[] = [];
  let unreadCount = 0;
  try {
    [users, notifications, unreadCount] = await Promise.all([
      getAllUsersAction(),
      getMyNotificationsAction(),
      getUnreadCountAction(),
    ]);
  } catch {
    // Fallback to empty state on error
  }

  return (
    <AdminShell
      title="Users"
      subtitle={`${users.length} registered users`}
      currentPath="/admin/users"
      actions={
        <NotificationBell
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
          isAdmin
        />
      }
    >
      <AdminUsersClient users={users} currentUserId={session.id} />
    </AdminShell>
  );
}
