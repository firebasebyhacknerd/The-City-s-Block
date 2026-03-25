import Link from "next/link";
import { PanelShell } from "@/components/portal/PanelShell";
import { Button } from "@/components/ui/button";
import { formatPrice, listings } from "@/lib/portal";

const dashboardNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Listings", href: "/dashboard/listings" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Saved searches", href: "/dashboard/saved-searches" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "New listing", href: "/dashboard/new-listing" },
];

export default function DashboardListingsPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Business Dashboard"
        description="Monitor listing performance, stay on top of new buyer interest, and keep your portfolio market-ready."
        items={dashboardNav}
        activeHref="/dashboard/listings"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-semibold text-slate-950">Listings currently shaping your pipeline</div>
            <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
              <Link href="/dashboard/new-listing">Post a new property</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium text-slate-950">{listing.title}</div>
                  <div className="text-sm text-slate-500">
                    {listing.city} • {listing.status} • {listing.propertyType}
                  </div>
                </div>
                <div className="font-medium text-slate-950">{formatPrice(listing)}</div>
              </div>
            ))}
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
