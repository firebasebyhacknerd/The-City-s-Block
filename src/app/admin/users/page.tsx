import { PanelShell } from "@/components/portal/PanelShell";
import { profiles } from "@/lib/portal";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Listings", href: "/admin/listings" },
  { label: "Users", href: "/admin/users" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Localities", href: "/admin/localities" },
];

export default function AdminUsersPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Operations Console"
        description="Review marketplace quality, monitor demand flow, and keep listings, users, and locality data sharp."
        items={adminNav}
        activeHref="/admin/users"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-950">User accounts and marketplace roles</div>
          <div className="mt-5 space-y-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="rounded-2xl border border-slate-200 p-4 text-sm">
                <div className="font-medium text-slate-950">{profile.name}</div>
                <div className="text-slate-500">
                  {profile.role} • {profile.verificationStatus} • {profile.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
