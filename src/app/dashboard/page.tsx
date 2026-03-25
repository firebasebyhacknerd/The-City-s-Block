import { PanelShell } from "@/components/portal/PanelShell";
import { listings, inquiries, savedSearches } from "@/lib/portal";

const dashboardNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Listings", href: "/dashboard/listings" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Saved searches", href: "/dashboard/saved-searches" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "New listing", href: "/dashboard/new-listing" },
];

export default function DashboardPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Business Dashboard"
        description="Monitor listing performance, stay on top of new buyer interest, and keep your portfolio market-ready."
        items={dashboardNav}
        activeHref="/dashboard"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Listings in market</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{listings.length}</div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">New buyer leads</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{inquiries.length}</div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Tracked buyer alerts</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{savedSearches.length}</div>
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
