"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toggleFavoriteAction } from "@/app/actions/listings";
import { Button } from "@/components/ui/button";

interface Listing {
  id: number;
  title: string;
  city: string;
  locality?: string;
  price: number;
  price_unit: string;
  property_type: string;
  images?: string[];
}

interface FavoriteCardProps {
  listing: Listing;
  onRemove: (listingId: number) => void;
}

export function FavoriteCard({ listing, onRemove }: FavoriteCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    // Optimistic: notify parent immediately
    onRemove(listing.id);
    startTransition(async () => {
      await toggleFavoriteAction(listing.id);
    });
  };

  const price = Number(listing.price);
  const formattedPrice =
    price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : price >= 100000
      ? `₹${(price / 100000).toFixed(1)} L`
      : `₹${price.toLocaleString("en-IN")}`;

  return (
    <div className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      {listing.images?.[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-16 w-24 shrink-0 rounded-xl object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-950 line-clamp-1">{listing.title}</div>
        <div className="text-sm text-slate-500 mt-0.5">
          {listing.locality ? `${listing.locality}, ` : ""}{listing.city}
        </div>
        <div className="text-sm font-medium text-slate-700 mt-1">
          {formattedPrice}{listing.price_unit === "month" ? "/mo" : ""}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{listing.property_type}</div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
        disabled={isPending}
        onClick={handleRemove}
        aria-label="Remove from saved"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
