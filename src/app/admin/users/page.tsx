import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getAllUsersAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { AdminUserActions } from "@/components/admin/AdminUserActions";
import { AdminUserRoleSelect } from "@/components/admin/AdminUserRoleSelect";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Users | Admin Console" };

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const users = await getAllUsersAction();

  return (
    <main className="container-shell py-10 pb-16">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-semibold text-slate-950">All Users ({users.length})</h1>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className={`rounded-[24px] border p-5 shadow-sm bg-white ${user.banned ? "border-red-200 opacity-60" : "border-slate-200"}`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-950">{user.name}</span>
                  {user.verified && <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">Verified</span>}
                  {user.banned && <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5">Banned</span>}
                </div>
                <div className="text-sm text-slate-500 mt-0.5">{user.email}</div>
                <div className="text-xs text-slate-400 mt-1 capitalize">
                  {user.role} • {user.city || "No city"} • Joined {new Date(user.created_at).toLocaleDateString("en-IN")}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <AdminUserRoleSelect id={user.id} currentRole={user.role} isCurrentUser={user.id === session.id} />
                <AdminUserActions id={user.id} verified={user.verified} banned={user.banned} isAdmin={user.role === "admin"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
