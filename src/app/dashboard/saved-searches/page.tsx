import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PanelShell } from "@/components/portal/PanelShell";

const dashboardNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Listings", href: "/dashboard/listings" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Saved searches", href: "/dashboard/saved-searches" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "New listing", href: "/dashboard/new-listing" },
];

export default async function DashboardSavedSearchesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

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
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <div className="text-base font-medium text-slate-700">Saved search alerts are coming soon</div>
            <p className="mt-2 text-sm text-slate-500">
              You&apos;ll be able to save your search filters and get notified when new matching listings are posted.
            </p>
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
