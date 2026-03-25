import { PanelShell } from "@/components/portal/PanelShell";
import { inquiries } from "@/lib/portal";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Listings", href: "/admin/listings" },
  { label: "Users", href: "/admin/users" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Localities", href: "/admin/localities" },
];

export default function AdminInquiriesPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Operations Console"
        description="Review marketplace quality, monitor demand flow, and keep listings, users, and locality data sharp."
        items={adminNav}
        activeHref="/admin/inquiries"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-950">Lead review and response visibility</div>
          <div className="mt-5 space-y-3">
            {inquiries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-medium text-slate-950">{entry.buyerName}</div>
                <div className="text-sm text-slate-500">
                  {entry.listingTitle} • {entry.channel} • {entry.status}
                </div>
                <div className="mt-2 text-sm text-slate-600">{entry.message}</div>
              </div>
            ))}
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
