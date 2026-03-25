import { PanelShell } from "@/components/portal/PanelShell";
import { profiles } from "@/lib/portal";

const dashboardNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Listings", href: "/dashboard/listings" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Saved searches", href: "/dashboard/saved-searches" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "New listing", href: "/dashboard/new-listing" },
];

export default function DashboardProfilePage() {
  const profile = profiles[0];

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Business Dashboard"
        description="Monitor listing performance, stay on top of new buyer interest, and keep your portfolio market-ready."
        items={dashboardNav}
        activeHref="/dashboard/profile"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-950">Profile trust and account identity</div>
          <div className="mt-5 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
            <div>Name: {profile.name}</div>
            <div>Email: {profile.email}</div>
            <div>Phone: {profile.phone}</div>
            <div>Role: {profile.role}</div>
            <div>City: {profile.city}</div>
            <div>Verification: {profile.verificationStatus}</div>
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
