import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getAllListingsAction } from "@/app/actions/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminListingActions } from "@/components/admin/AdminListingActions";
import { AdminListingFeatureToggle } from "@/components/admin/AdminListingFeatureToggle";

export const metadata = { title: "Listings | Admin Console" };

export default async function AdminListingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const listings = await getAllListingsAction();
  const pending = listings.filter((l) => l.status === "pending");
  const active = listings.filter((l) => l.status === "active");
  const others = listings.filter((l) => !["pending", "active"].includes(l.status));

  return (
    <AdminShell
      title="Listings"
      subtitle={`${listings.length} total · ${pending.length} pending · ${active.length} active`}
      currentPath="/admin/listings"
    >
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-amber-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold">{pending.length}</span>
            Pending Approval
          </h2>
          <div className="space-y-3">
            {pending.map((l) => <ListingRow key={l.id} listing={l} highlight />)}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-base font-semibold text-gray-700">Active ({active.length})</h2>
          <div className="space-y-3">
            {active.map((l) => <ListingRow key={l.id} listing={l} />)}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-gray-500">Other ({others.length})</h2>
          <div className="space-y-3">
            {others.map((l) => <ListingRow key={l.id} listing={l} />)}
          </div>
        </div>
      )}

      {listings.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center text-gray-400">
          No listings yet. They will appear here once users submit them.
        </div>
      )}
    </AdminShell>
  );
}

function ListingRow({ listing, highlight }: { listing: any; highlight?: boolean }) {
  const price = Number(listing.price);
  const formattedPrice = price >= 10000000
    ? `₹${(price / 10000000).toFixed(2)} Cr`
    : price >= 100000
    ? `₹${(price / 100000).toFixed(1)} L`
    : `₹${price.toLocaleString("en-IN")}`;

  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${highlight ? "border-amber-200" : "border-gray-100"}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          {listing.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.images[0]} alt={listing.title} className="h-16 w-24 shrink-0 rounded-lg object-cover" />
          ) : (
            <div className="h-16 w-24 shrink-0 rounded-lg bg-gray-100" />
          )}
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 line-clamp-1">{listing.title}</div>
            <div className="mt-0.5 text-xs text-gray-500">
              {listing.city}{listing.locality ? ` · ${listing.locality}` : ""} · {listing.property_type}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-800">
              {formattedPrice}{listing.price_unit === "month" ? "/mo" : ""}
              {listing.area ? ` · ${listing.area} sq.ft.` : ""}
            </div>
            <div className="mt-0.5 text-xs text-gray-400">
              By: {listing.owner_name} ({listing.owner_email})
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            listing.status === "active" ? "bg-green-100 text-green-700" :
            listing.status === "pending" ? "bg-amber-100 text-amber-700" :
            listing.status === "rejected" ? "bg-red-100 text-red-700" :
            "bg-gray-100 text-gray-600"
          }`}>
            {listing.status}
          </span>
          <AdminListingFeatureToggle id={listing.id} featured={!!listing.featured} />
          <AdminListingActions id={listing.id} status={listing.status} />
        </div>
      </div>
    </div>
  );
}
