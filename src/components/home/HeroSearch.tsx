"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, SlidersHorizontal } from "lucide-react";
import {
  buildSearchQueryString,
  POPULAR_LOCALITIES,
  SEARCH_BHK_OPTIONS,
  SEARCH_BUDGET_OPTIONS,
  SEARCH_RENT_BUDGET_OPTIONS,
  SEARCH_CITIES,
  SEARCH_POSSESSION,
  SEARCH_PROPERTY_TYPES,
} from "@/lib/search-params";

export function HeroSearch() {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [listingType, setListingType] = useState("");
  const [bhk, setBhk] = useState("");
  const [budget, setBudget] = useState("");
  const [possession, setPossession] = useState("");
  const [propertyType, setPropertyType] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    let minPrice: string | undefined;
    let maxPrice: string | undefined;
    if (budget) {
      const [min, max] = budget.split("-");
      minPrice = min;
      maxPrice = max;
    }
    const qs = buildSearchQueryString({
      city: city || undefined,
      q: location || undefined,
      listing_type: listingType || undefined,
      bhk: bhk || undefined,
      property_type: propertyType || undefined,
      possession: possession || undefined,
      minPrice,
      maxPrice,
    });
    router.push(`/search${qs ? `?${qs}` : ""}`);
  }

  const budgetOptions = listingType === "rent" ? SEARCH_RENT_BUDGET_OPTIONS : SEARCH_BUDGET_OPTIONS;

  const filteredLocalities = city
    ? POPULAR_LOCALITIES.filter((loc) => loc.city.toLowerCase() === city.toLowerCase())
    : POPULAR_LOCALITIES;

  const selectCls =
    "w-full min-h-[44px] bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer appearance-none";

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {[
          { label: "Buy", value: "sale" },
          { label: "Rent", value: "rent" },
        ].map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => { setListingType(chip.value); setBudget(""); }}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
              listingType === chip.value
                ? "bg-[#C9A84C] text-[#1B4332]"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSearch}
        className="overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex min-w-[130px] items-center gap-1 border-b border-gray-100 px-4 py-3 md:border-b-0 md:border-r">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={selectCls}
              aria-label="City"
            >
              <option value="">All Cities</option>
              {SEARCH_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex flex-1 items-center gap-2 border-b border-gray-100 px-5 py-3 md:border-b-0 md:border-r">
            <MapPin className="h-4 w-4 shrink-0 text-[#C9A84C]" />
            <input
              type="text"
              placeholder="Locality, building or keywords..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="min-h-[44px] w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex min-h-[52px] items-center justify-center gap-2 bg-[#1B4332] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#1B4332]/90 md:min-h-[44px]"
          >
            <Search className="h-4 w-4 text-[#C9A84C]" />
            Search
          </button>
        </div>

        <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-2 md:hidden">
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="flex w-full min-h-[44px] items-center justify-center gap-2 text-sm font-semibold text-[#1B4332]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showMore ? "Hide filters" : "More filters"}
          </button>
        </div>

        <div
          className={`grid gap-0 border-t border-gray-100 md:grid-cols-4 ${
            showMore ? "grid" : "hidden md:grid"
          }`}
        >
          <FilterSelect label="BHK" value={bhk} onChange={setBhk}>
            <option value="">Any BHK</option>
            {SEARCH_BHK_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect label="Budget" value={budget} onChange={(v) => { setBudget(v); }}>
            <option value="">Any budget</option>
            {budgetOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect label="Possession" value={possession} onChange={setPossession}>
            <option value="">Any</option>
            {SEARCH_POSSESSION.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect label="Type" value={propertyType} onChange={setPropertyType}>
            <option value="">All types</option>
            {SEARCH_PROPERTY_TYPES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </FilterSelect>
        </div>
      </form>

      {filteredLocalities.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-white/80">Popular:</span>
          {filteredLocalities.map((loc) => (
            <a
              key={`${loc.city}-${loc.slug}`}
              href={`/locality/${encodeURIComponent(loc.city.toLowerCase())}/${loc.slug}`}
              className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/20 min-h-[32px] flex items-center"
            >
              {loc.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-100 px-4 py-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full min-h-[44px] bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400 pointer-events-none" />
    </div>
  );
}
