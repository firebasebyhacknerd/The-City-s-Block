import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllListingsAction } from "@/app/actions/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminListingsClient } from "@/components/admin/AdminListingsClient";
import { getMyNotificationsAction, getUnreadCountAction } from "@/app/actions/notifications";
import { NotificationBell } from "@/components/shared/NotificationBell";

export const metadata = { title: "Listings | Admin Console" };

export default async function AdminListingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  let listings: any[] = [];
  let notifications: any[] = [];
  let unreadCount = 0;
  try {
    [listings, notifications, unreadCount] = await Promise.all([
      getAllListingsAction(),
      getMyNotificationsAction(),
      getUnreadCountAction(),
    ]);
  } catch {
    // Fallback to empty state on error
  }

  return (
    <AdminShell
      title="Listings"
      subtitle={`${listings.length} total`}
      currentPath="/admin/listings"
      actions={
        <NotificationBell
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
          isAdmin
        />
      }
    >
      <AdminListingsClient listings={listings} />
    </AdminShell>
  );
}
