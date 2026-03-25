import { ListingComposer } from "@/components/portal/ListingComposer";
import { PanelShell } from "@/components/portal/PanelShell";

const dashboardNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Listings", href: "/dashboard/listings" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Saved searches", href: "/dashboard/saved-searches" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "New listing", href: "/dashboard/new-listing" },
];

export default function DashboardNewListingPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Business Dashboard"
        description="Monitor listing performance, stay on top of new buyer interest, and keep your portfolio market-ready."
        items={dashboardNav}
        activeHref="/dashboard/new-listing"
      >
        <ListingComposer />
      </PanelShell>
    </main>
  );
}
