"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Trash2, ExternalLink } from "lucide-react";
import { deleteSavedSearchAction } from "@/app/actions/saved-searches";
import { Button } from "@/components/ui/button";
import type { SavedSearch } from "@/types";

interface SavedSearchItemProps {
  search: SavedSearch;
  onDelete: (id: number) => void;
}

function buildSearchUrl(filters: Record<string, string>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  return `/search?${params.toString()}`;
}

const FILTER_LABELS: Record<string, string> = {
  city: "City",
  listing_type: "Type",
  asset_class: "Class",
  property_type: "Property",
  bhk: "BHK",
  q: "Search",
};

export function SavedSearchItem({ search, onDelete }: SavedSearchItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    onDelete(search.id);
    startTransition(async () => {
      await deleteSavedSearchAction(search.id);
    });
  };

  const filterEntries = Object.entries(search.filters).filter(([, v]) => v);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-950">{search.label}</div>

          {/* Filter chips */}
          {filterEntries.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {filterEntries.map(([k, v]) => (
                <span
                  key={k}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
                >
                  {FILTER_LABELS[k] ?? k}: {v}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 text-xs text-slate-400">
            Saved {new Date(search.created_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
            <Link href={buildSearchUrl(search.filters)}>
              <ExternalLink className="h-3.5 w-3.5" /> Search again
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
            disabled={isPending}
            onClick={handleDelete}
            aria-label="Delete saved search"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
