import Link from "next/link";
import { MapPin, Pencil, Star } from "lucide-react";
import type { Listing } from "@/lib/portal";

function formatPrice(price: number, unit: string) {
  const f =
    price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : price >= 100000
      ? `₹${(price / 100000).toFixed(1)} L`
      : `₹${price.toLocaleString("en-IN")}`;
  return unit === "month" ? `${f}/mo` : f;
}

export function MockListingTable({ listings }: { listings: Listing[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3 hidden md:table-cell">Location</th>
            <th className="px-4 py-3 hidden lg:table-cell">Size</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3 hidden sm:table-cell">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-gray-50/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {listing.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-10 w-14 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-10 w-14 shrink-0 rounded-lg bg-gray-100" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-gray-900 line-clamp-1">{listing.title}</span>
                      {listing.featured && (
                        <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <div className="text-xs text-gray-400">{listing.propertyType}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-red-400" />
                  <span className="line-clamp-1">{listing.city}</span>
                </div>
              </td>
              <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                {listing.area.toLocaleString("en-IN")} sq.ft.
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">
                {formatPrice(listing.price, listing.priceUnit)}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    listing.status === "active"
                      ? "bg-green-100 text-green-700"
                      : listing.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {listing.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/mock-listings/${listing.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
