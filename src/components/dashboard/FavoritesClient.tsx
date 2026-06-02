"use client";

import { useState } from "react";
import Link from "next/link";
import { FavoriteCard } from "@/components/dashboard/FavoriteCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FavoritesClientProps {
  initialListings: any[];
}

export function FavoritesClient({ initialListings }: FavoritesClientProps) {
  const [listings, setListings] = useState(initialListings);

  const handleRemove = (listingId: number) => {
    setListings((prev) => prev.filter((l) => l.id !== listingId));
  };

  if (listings.length === 0) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-sm">
        <div className="text-slate-400 mb-4">No saved listings yet.</div>
        <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2">
          <Link href="/search"><Search className="h-4 w-4" /> Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <FavoriteCard key={listing.id} listing={listing} onRemove={handleRemove} />
      ))}
    </div>
  );
}
