import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import sql from "@/lib/db";
import { PanelShell } from "@/components/portal/PanelShell";
import { ProfileEditForm } from "@/components/dashboard/ProfileEditForm";
import { PasswordChangeForm } from "@/components/dashboard/PasswordChangeForm";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Profile | Dashboard" };

export default async function DashboardProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const rows = await sql`SELECT * FROM users WHERE id = ${session.id} LIMIT 1`;
  const user = rows[0];
  if (!user) redirect("/login");

  const role = session.role as "buyer" | "agent" | "owner";

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell role={role} currentPath="/dashboard/profile">
        <div className="space-y-6">
          {/* Account info */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950 mb-4">Account info</h2>
            <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
              <div>
                <span className="font-medium text-slate-800">Email</span>
                <p className="mt-0.5">{user.email}</p>
              </div>
              <div className="flex items-start gap-4">
                <div>
                  <span className="font-medium text-slate-800">Role</span>
                  <p className="mt-1">
                    <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                  </p>
                </div>
                <div>
                  <span className="font-medium text-slate-800">Verified</span>
                  <p className="mt-1">
                    {user.verified ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Unverified</Badge>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit profile */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950 mb-1">Edit profile</h2>
            <p className="text-sm text-slate-500 mb-5">
              Update your name, contact details, and bio.
            </p>
            <ProfileEditForm
              user={{
                name: user.name,
                phone: user.phone,
                city: user.city,
                bio: user.bio,
              }}
            />
          </div>

          {/* Change password */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950 mb-1">Change password</h2>
            <p className="text-sm text-slate-500 mb-5">
              Choose a strong password of at least 6 characters.
            </p>
            <PasswordChangeForm />
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
