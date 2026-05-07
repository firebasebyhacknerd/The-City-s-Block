import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize2, CheckCircle, ArrowRight } from "lucide-react";

export interface HomepageListing {
  id: string;
  title: string;
  city: string;
  locality: string;
  price: number;
  priceUnit: "total" | "month";
  area: number;
  bhk: number | null;
  bathrooms: number;
  propertyType: string;
  listingType: "sale" | "rent";
  verified: boolean;
  images: string[];
}

function formatPrice(price: number, priceUnit: string) {
  const formatted =
    price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : price >= 100000
      ? `₹${(price / 100000).toFixed(1)} L`
      : `₹${price.toLocaleString("en-IN")}`;
  return priceUnit === "month" ? `${formatted}/mo` : formatted;
}

function ListingCard({ listing }: { listing: HomepageListing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {listing.images?.[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
              listing.listingType === "sale" ? "bg-blue-600" : "bg-green-600"
            }`}
          >
            {listing.listingType === "sale" ? "For Sale" : "For Rent"}
          </span>
          {listing.verified && (
            <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-green-700">
              <CheckCircle className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5 p-4">
        <div className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
          {listing.title}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-red-500" />
          <span className="truncate">
            {listing.locality ? `${listing.locality}, ` : ""}
            {listing.city}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {listing.bhk && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {listing.bhk} BHK
            </span>
          )}
          {listing.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {listing.bathrooms} Bath
            </span>
          )}
          {listing.area > 0 && (
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {listing.area.toLocaleString("en-IN")} sq.ft.
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="text-base font-bold text-gray-900">
            {formatPrice(listing.price, listing.priceUnit)}
          </div>
          <div className="text-xs text-gray-400">{listing.propertyType}</div>
        </div>
      </div>
    </Link>
  );
}

interface FeaturedListingsProps {
  title: string;
  listings: HomepageListing[];
  viewAllHref: string;
}

export function FeaturedListings({ title, listings, viewAllHref }: FeaturedListingsProps) {
  if (!listings.length) return null;

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-medium text-red-600 hover:underline"
          >
            See All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
