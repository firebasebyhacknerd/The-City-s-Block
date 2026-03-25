import { PanelShell } from "@/components/portal/PanelShell";
import { inquiries, listings, profiles, projects } from "@/lib/portal";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Listings", href: "/admin/listings" },
  { label: "Users", href: "/admin/users" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Localities", href: "/admin/localities" },
];

export default function AdminPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Operations Console"
        description="Review marketplace quality, monitor demand flow, and keep listings, users, and locality data sharp."
        items={adminNav}
        activeHref="/admin"
      >
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Listings under watch</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{listings.length}</div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">User accounts</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{profiles.length}</div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Lead conversations</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{inquiries.length}</div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Active projects</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{projects.length}</div>
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
