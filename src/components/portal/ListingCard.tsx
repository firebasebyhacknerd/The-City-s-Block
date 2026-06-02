"use client";

import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, Heart, MapPin, ShieldCheck, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type Listing, formatArea, formatPrice, getLocality, timeAgo } from "@/lib/portal";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [liked, setLiked] = useState(false);
  const locality = getLocality(listing.localitySlug);

  return (
    <Card className="group overflow-hidden rounded-[28px] border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/property/${listing.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-slate-950/80 px-3 py-1 text-white">
              {listing.listingType === "sale" ? "For Sale" : "For Rent"}
            </Badge>
            <Badge variant="secondary" className="rounded-full bg-white/90 px-3 py-1 text-slate-950">
              {listing.assetClass}
            </Badge>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setLiked((current) => !current);
            }}
            className="rounded-full bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white"
            aria-label="Save listing"
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current text-rose-500")} />
          </button>
        </div>
      </Link>

      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-slate-950">{formatPrice(listing)}</div>
            <Link href={`/property/${listing.slug}`} className="mt-1 line-clamp-2 block font-medium text-slate-800">
              {listing.title}
            </Link>
          </div>
          {listing.verified ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4 text-amber-500" />
          <span>
            {locality?.displayName}, {listing.city}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-slate-500" />
            <span>{listing.bhk ? `${listing.bhk} BHK` : listing.propertyType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-slate-500" />
            <span>{listing.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="h-4 w-4 text-slate-500" />
            <span>{formatArea(listing.area)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {listing.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-5 pb-5 pt-0">
        <div className="text-xs text-slate-500">Posted {timeAgo(listing.postedOn)}</div>
        <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
          <Link href={`/property/${listing.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
