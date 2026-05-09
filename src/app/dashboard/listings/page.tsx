import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getMyListingsAction, getBrokerStatsAction } from "@/app/actions/listings";
import { PanelShell } from "@/components/portal/PanelShell";
import { DeleteListingButton } from "@/components/dashboard/DeleteListingButton";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil } from "lucide-react";

export const metadata = { title: "My Listings | Dashboard" };

export default async function MyListingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "buyer") redirect("/dashboard");

  const [listings, stats] = await Promise.all([
    getMyListingsAction(),
    getBrokerStatsAction(),
  ]);

  const inquiryMap = new Map(
    (stats?.listingsWithInquiryCounts ?? []).map((l) => [l.id, l.inquiry_count])
  );

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell role={session.role as "agent" | "owner"} currentPath="/dashboard/listings">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-950">My Listings</h1>
          <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2">
            <Link href="/dashboard/new-listing"><PlusCircle className="h-4 w-4" /> Post New</Link>
          </Button>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="text-slate-400 mb-4">No listings yet.</div>
            <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
              <Link href="/dashboard/new-listing">Post your first property</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
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
                      <div className="text-sm text-slate-500 mt-1">
                        {listing.city}{listing.locality ? ` • ${listing.locality}` : ""} • {listing.property_type}
                      </div>
                      <div className="text-sm font-medium text-slate-700 mt-1">
                        ₹{Number(listing.price).toLocaleString("en-IN")}
                        {listing.price_unit === "month" ? "/month" : ""}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {inquiryMap.get(listing.id) ?? 0} inquir{(inquiryMap.get(listing.id) ?? 0) === 1 ? "y" : "ies"}
                      </div>
                      {listing.status === "rejected" && listing.rejection_reason && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-xl px-3 py-1.5">
                          Rejected: {listing.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      listing.status === "active" ? "bg-green-100 text-green-700" :
                      listing.status === "pending" ? "bg-amber-100 text-amber-700" :
                      listing.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {listing.status}
                    </span>
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={`/dashboard/listings/${listing.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteListingButton id={listing.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PanelShell>
    </main>
  );
}
