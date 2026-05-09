"use client";

import { useState } from "react";
import Link from "next/link";
import { SavedSearchItem } from "@/components/dashboard/SavedSearchItem";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { SavedSearch } from "@/types";

interface SavedSearchesClientProps {
  initialSearches: SavedSearch[];
}

export function SavedSearchesClient({ initialSearches }: SavedSearchesClientProps) {
  const [searches, setSearches] = useState(initialSearches);

  const handleDelete = (id: number) => {
    setSearches((prev) => prev.filter((s) => s.id !== id));
  };

  if (searches.length === 0) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-sm">
        <div className="text-slate-400 mb-4">No saved searches yet.</div>
        <p className="text-sm text-slate-400 mb-6">
          Use the search page and click "Save this search" to save your filters here.
        </p>
        <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2">
          <Link href="/search"><Search className="h-4 w-4" /> Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {searches.map((search) => (
        <SavedSearchItem key={search.id} search={search} onDelete={handleDelete} />
      ))}
    </div>
  );
}
