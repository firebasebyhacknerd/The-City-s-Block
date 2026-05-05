"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/app/actions/listings";

export function FavoriteButton({
  listingId,
  initialSaved = false,
}: {
  listingId: number;
  initialSaved?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await toggleFavoriteAction(listingId);
      if (result.ok) {
        setSaved(result.saved);
      }
      // If not ok (not signed in), silently do nothing
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      className="flex items-center justify-center h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors disabled:opacity-50"
    >
      <Heart
        className={`h-4 w-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-slate-500"}`}
      />
    </button>
  );
}
