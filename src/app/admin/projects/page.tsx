import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getProjectsAction } from "@/app/actions/admin";
import { getMyNotificationsAction, getUnreadCountAction } from "@/app/actions/notifications";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectsClient } from "@/components/admin/ProjectsClient";
import { NotificationBell } from "@/components/shared/NotificationBell";

export const metadata = { title: "Projects | Admin Console" };

export default async function AdminProjectsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const [projects, notifications, unreadCount] = await Promise.all([
    getProjectsAction(),
    getMyNotificationsAction(),
    getUnreadCountAction(),
  ]);

  return (
    <AdminShell
      title="Projects"
      subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""}`}
      currentPath="/admin/projects"
      actions={
        <NotificationBell
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
          isAdmin
        />
      }
    >
      <ProjectsClient projects={projects} />
    </AdminShell>
  );
}
