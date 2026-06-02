import Link from "next/link";
import { X } from "lucide-react";
import { buildSearchQueryString, type SearchFiltersInput } from "@/lib/search-params";

function chipHref(filters: SearchFiltersInput, removeKey: keyof SearchFiltersInput) {
  const next = { ...filters };
  if (removeKey === "minPrice" || removeKey === "maxPrice") {
    delete next.minPrice;
    delete next.maxPrice;
  } else {
    delete next[removeKey];
  }
  if (next.sort === "relevance") delete next.sort;
  const qs = buildSearchQueryString(next);
  return `/search${qs ? `?${qs}` : ""}`;
}

export function SearchFilterChips({ filters }: { filters: SearchFiltersInput }) {
  const chips: { label: string; removeKey: keyof SearchFiltersInput }[] = [];

  if (filters.q) chips.push({ label: `"${filters.q}"`, removeKey: "q" });
  if (filters.city) chips.push({ label: filters.city, removeKey: "city" });
  if (filters.listing_type) {
    chips.push({
      label: filters.listing_type === "sale" ? "For Sale" : "For Rent",
      removeKey: "listing_type",
    });
  }
  if (filters.property_type) chips.push({ label: filters.property_type, removeKey: "property_type" });
  if (filters.bhk) chips.push({ label: filters.bhk, removeKey: "bhk" });
  if (filters.furnishing) chips.push({ label: filters.furnishing, removeKey: "furnishing" });
  if (filters.possession) chips.push({ label: filters.possession, removeKey: "possession" });
  if (filters.locality) chips.push({ label: filters.locality, removeKey: "locality" });
  if (filters.minPrice || filters.maxPrice) {
    chips.push({ label: "Budget", removeKey: "minPrice" });
  }
  if (filters.featured) {
    chips.push({ label: "Featured", removeKey: "featured" });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chipHref(filters, chip.removeKey)}
          className="inline-flex items-center gap-1 rounded-full border border-[#1B4332]/20 bg-[#1B4332]/5 px-3 py-1.5 text-xs font-medium text-[#1B4332] hover:bg-[#1B4332]/10"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </Link>
      ))}
      <Link
        href="/search"
        className="text-xs font-semibold text-gray-500 hover:text-[#1B4332]"
      >
        Clear all
      </Link>
    </div>
  );
}
