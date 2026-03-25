import { PanelShell } from "@/components/portal/PanelShell";
import { formatPrice, listings } from "@/lib/portal";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Listings", href: "/admin/listings" },
  { label: "Users", href: "/admin/users" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Localities", href: "/admin/localities" },
];

export default function AdminListingsPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Operations Console"
        description="Review marketplace quality, monitor demand flow, and keep listings, users, and locality data sharp."
        items={adminNav}
        activeHref="/admin/listings"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-950">Listing review and trust checks</div>
          <div className="mt-5 space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium text-slate-950">{listing.title}</div>
                    <div className="text-sm text-slate-500">
                      {listing.city} • {listing.status} • {listing.verified ? "Verified" : "Pending verification"}
                    </div>
                  </div>
                  <div className="font-medium text-slate-950">{formatPrice(listing)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
