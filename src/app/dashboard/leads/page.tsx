import { PanelShell } from "@/components/portal/PanelShell";
import { inquiries } from "@/lib/portal";

const dashboardNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Listings", href: "/dashboard/listings" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Saved searches", href: "/dashboard/saved-searches" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "New listing", href: "/dashboard/new-listing" },
];

export default function DashboardLeadsPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Business Dashboard"
        description="Monitor listing performance, stay on top of new buyer interest, and keep your portfolio market-ready."
        items={dashboardNav}
        activeHref="/dashboard/leads"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-950">Buyer inquiry inbox</div>
          <div className="mt-5 space-y-3">
            {inquiries.map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium text-slate-950">{lead.buyerName}</div>
                    <div className="text-sm text-slate-500">{lead.listingTitle}</div>
                  </div>
                  <div className="text-sm text-slate-500">{lead.status}</div>
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-600">{lead.message}</div>
              </div>
            ))}
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
