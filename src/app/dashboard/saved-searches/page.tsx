import { PanelShell } from "@/components/portal/PanelShell";
import { savedSearches } from "@/lib/portal";

const dashboardNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Listings", href: "/dashboard/listings" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Saved searches", href: "/dashboard/saved-searches" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "New listing", href: "/dashboard/new-listing" },
];

export default function DashboardSavedSearchesPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Business Dashboard"
        description="Monitor listing performance, stay on top of new buyer interest, and keep your portfolio market-ready."
        items={dashboardNav}
        activeHref="/dashboard/saved-searches"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-950">Demand signals from saved buyer searches</div>
          <div className="mt-5 space-y-3">
            {savedSearches.map((search) => (
              <div key={search.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-medium text-slate-950">{search.label}</div>
                <div className="text-sm text-slate-500">
                  {search.city} • {search.resultCount} results
                </div>
              </div>
            ))}
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
