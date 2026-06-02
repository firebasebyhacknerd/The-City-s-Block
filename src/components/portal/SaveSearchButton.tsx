"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { saveSearchAction } from "@/app/actions/saved-searches";

interface SaveSearchButtonProps {
  filters: Record<string, string>;
}

export function SaveSearchButton({ filters }: SaveSearchButtonProps) {
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasFilters = Object.values(filters).some((v) => v);
  if (!hasFilters) return null;

  const handleSave = () => {
    startTransition(async () => {
      const res = await saveSearchAction(filters);
      if (res.ok) setSaved(true);
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending || saved}
      className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
        saved
          ? "border-green-300 bg-green-50 text-green-700"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {saved ? (
        <><BookmarkCheck className="h-4 w-4" /> Saved</>
      ) : (
        <><Bookmark className="h-4 w-4" /> {isPending ? "Saving…" : "Save search"}</>
      )}
    </button>
  );
}
