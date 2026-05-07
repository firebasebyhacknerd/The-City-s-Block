import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize2, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/portal/FavoriteButton";

export function DbListingCard({ listing }: { listing: any }) {
  const price = Number(listing.price);
  const formattedPrice = price >= 10000000
    ? `₹${(price / 10000000).toFixed(2)} Cr`
    : price >= 100000
    ? `₹${(price / 100000).toFixed(1)} L`
    : `₹${price.toLocaleString("en-IN")}`;

  const displayPrice = listing.price_unit === "month"
    ? `${formattedPrice}/month`
    : formattedPrice;

  return (
    <Link href={`/listings/${listing.id}`} className="group block rounded-[28px] border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden">
      <div className="relative h-48 bg-slate-100">
        {listing.images?.[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 text-sm">No image</div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`rounded-full text-xs ${listing.listing_type === "sale" ? "bg-blue-600" : "bg-green-600"} text-white border-0`}>
            {listing.listing_type === "sale" ? "For Sale" : "For Rent"}
          </Badge>
          {listing.verified && (
            <Badge className="rounded-full text-xs bg-white text-green-700 border-0 gap-1">
              <CheckCircle className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <FavoriteButton listingId={listing.id} initialSaved={false} />
        </div>
      </div>
      <div className="p-4 space-y-2 group-hover:bg-slate-50 transition-colors">
        <div className="font-semibold text-slate-950 line-clamp-2 leading-snug group-hover:text-slate-900">{listing.title}</div>
        <div className="flex items-center gap-1 text-sm text-slate-500 group-hover:text-slate-600">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{listing.locality ? `${listing.locality}, ` : ""}{listing.city}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 group-hover:text-slate-600">
          {listing.bhk && (
            <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{listing.bhk} BHK</span>
          )}
          {listing.bathrooms && (
            <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{listing.bathrooms} Bath</span>
          )}
          {listing.area && (
            <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{listing.area} sq.ft.</span>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="text-lg font-bold text-slate-950 group-hover:text-blue-600 transition-colors">{displayPrice}</div>
          <div className="text-xs text-slate-400 group-hover:text-slate-500">{listing.property_type}</div>
        </div>
      </div>
    </Link>
  );
}
