import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getAllListingsAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { AdminListingActions } from "@/components/admin/AdminListingActions";
import { AdminListingFeatureToggle } from "@/components/admin/AdminListingFeatureToggle";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Listings | Admin Console" };

export default async function AdminListingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const listings = await getAllListingsAction();
  const pending = listings.filter((l) => l.status === "pending");
  const others = listings.filter((l) => l.status !== "pending");

  return (
    <main className="container-shell py-10 pb-16">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-semibold text-slate-950">All Listings</h1>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-amber-700 mb-4">
            ⏳ Pending Approval ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((listing) => (
              <ListingRow key={listing.id} listing={listing} highlight />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">All Listings ({others.length})</h2>
        <div className="space-y-4">
          {others.map((listing) => (
            <ListingRow key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ListingRow({ listing, highlight }: { listing: any; highlight?: boolean }) {
  return (
    <div className={`rounded-[24px] border p-5 shadow-sm bg-white ${highlight ? "border-amber-200" : "border-slate-200"}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          {listing.images?.[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-20 w-28 rounded-2xl object-cover flex-shrink-0"
            />
          )}
          <div>
            <div className="font-semibold text-slate-950">{listing.title}</div>
            <div className="text-sm text-slate-500 mt-0.5">
              {listing.city}{listing.locality ? ` • ${listing.locality}` : ""} • {listing.property_type}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              ₹{Number(listing.price).toLocaleString("en-IN")}
              {listing.price_unit === "month" ? "/month" : ""} • {listing.area ? `${listing.area} sq.ft.` : ""}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Posted by: <span className="text-slate-600">{listing.owner_name}</span> ({listing.owner_email})
            </div>
            {listing.description && (
              <div className="text-xs text-slate-500 mt-1 line-clamp-2">{listing.description}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[160px]">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            listing.status === "active" ? "bg-green-100 text-green-700" :
            listing.status === "pending" ? "bg-amber-100 text-amber-700" :
            listing.status === "rejected" ? "bg-red-100 text-red-700" :
            "bg-slate-100 text-slate-600"
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
