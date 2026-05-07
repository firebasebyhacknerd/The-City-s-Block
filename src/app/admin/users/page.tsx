import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllUsersAction } from "@/app/actions/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUserActions } from "@/components/admin/AdminUserActions";
import { AdminUserRoleSelect } from "@/components/admin/AdminUserRoleSelect";

export const metadata = { title: "Users | Admin Console" };

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const users = await getAllUsersAction();

  return (
    <AdminShell
      title="Users"
      subtitle={`${users.length} registered users`}
      currentPath="/admin/users"
    >
      {users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center text-gray-400">
          No users yet.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user: any) => (
            <div
              key={user.id}
              className={`rounded-xl border bg-white p-4 shadow-sm ${
                user.banned ? "border-red-200 opacity-60" : "border-gray-100"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900">{user.name}</span>
                    {user.verified && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        Verified
                      </span>
                    )}
                    {user.banned && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        Banned
                      </span>
                    )}
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">{user.email}</div>
                  <div className="mt-0.5 text-xs text-gray-400">
                    {user.city || "No city"} · Joined{" "}
                    {new Date(user.created_at).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <AdminUserRoleSelect
                    id={user.id}
                    currentRole={user.role}
                    isCurrentUser={user.id === session.id}
                  />
                  <AdminUserActions
                    id={user.id}
                    verified={user.verified}
                    banned={user.banned}
                    isAdmin={user.role === "admin"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
