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
  const [mode, setMode] = useState<"sale" | "rent">("sale"); // default Buy
  const [bhk, setBhk] = useState("");
  const [budget, setBudget] = useState("");
  const [possession, setPossession] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // Switch mode and clear budget (incompatible values between buy/rent)
  function switchMode(newMode: "sale" | "rent") {
    setMode(newMode);
    setBudget("");
  }

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
      listing_type: mode,
      bhk: bhk || undefined,
      property_type: propertyType || undefined,
      possession: possession || undefined,
      minPrice,
      maxPrice,
    });
    router.push(`/search?${qs}`);
  }

  const budgetOptions = mode === "rent" ? SEARCH_RENT_BUDGET_OPTIONS : SEARCH_BUDGET_OPTIONS;
  const budgetLabel = mode === "rent" ? "Rent Budget" : "Budget";

  const filteredLocalities = city
    ? POPULAR_LOCALITIES.filter((loc) => loc.city.toLowerCase() === city.toLowerCase())
    : POPULAR_LOCALITIES;

  const selectCls =
    "w-full min-h-[44px] bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer appearance-none";

  return (
    <div className="w-full">
      {/* Buy / Rent toggle */}
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {(["sale", "rent"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              mode === m
                ? "bg-[#C9A84C] text-[#1B4332] shadow-lg scale-105"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            {m === "sale" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Top row: City + Search input + Button */}
        <div className="flex flex-col md:flex-row">
          {/* City */}
          <div className="flex min-w-[140px] items-center gap-1 border-b border-gray-100 px-4 py-3 md:border-b-0 md:border-r">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={selectCls}
              aria-label="City"
            >
              <option value="">All Cities</option>
              {SEARCH_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400 pointer-events-none" />
          </div>

          {/* Keyword / locality input */}
          <div className="flex flex-1 items-center gap-2 border-b border-gray-100 px-5 py-3 md:border-b-0 md:border-r">
            <MapPin className="h-4 w-4 shrink-0 text-[#C9A84C]" />
            <input
              type="text"
              placeholder={
                mode === "rent"
                  ? "Locality, building or area for rent..."
                  : "Locality, building or keywords..."
              }
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="min-h-[44px] w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="flex min-h-[52px] items-center justify-center gap-2 bg-[#1B4332] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#1B4332]/90 md:min-h-[44px]"
          >
            <Search className="h-4 w-4 text-[#C9A84C]" />
            Search
          </button>
        </div>

        {/* Mobile: more filters toggle */}
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

        {/* Filter row */}
        <div className={`grid gap-0 border-t border-gray-100 md:grid-cols-4 ${showMore ? "grid" : "hidden md:grid"}`}>
          {/* BHK — only show for sale or rent of residential */}
          <FilterSelect label="BHK" value={bhk} onChange={setBhk}>
            <option value="">Any BHK</option>
            {SEARCH_BHK_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </FilterSelect>

          {/* Budget — changes based on mode */}
          <FilterSelect label={budgetLabel} value={budget} onChange={setBudget}>
            <option value="">
              {mode === "rent" ? "Any rent range" : "Any budget"}
            </option>
            {budgetOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </FilterSelect>

          {/* Possession — relevant for sale */}
          <FilterSelect label="Possession" value={possession} onChange={setPossession}>
            <option value="">Any possession</option>
            {SEARCH_POSSESSION.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </FilterSelect>

          {/* Property type */}
          <FilterSelect label="Type" value={propertyType} onChange={setPropertyType}>
            <option value="">All types</option>
            {SEARCH_PROPERTY_TYPES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </FilterSelect>
        </div>

        {/* Active mode indicator strip */}
        <div className={`border-t border-gray-100 px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
          mode === "rent" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
        }`}>
          <span className={`h-2 w-2 rounded-full ${mode === "rent" ? "bg-green-500" : "bg-blue-500"}`} />
          {mode === "rent" ? "Searching For Rent" : "Searching For Sale / Buy"}
        </div>
      </form>

      {/* Popular localities */}
      {filteredLocalities.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-white/80">Popular:</span>
          {filteredLocalities.map((loc) => (
            <a
              key={`${loc.city}-${loc.slug}`}
              href={`/search?city=${encodeURIComponent(loc.city)}&locality=${loc.slug}&listing_type=${mode}`}
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
      <div className="flex w-full flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
        <div className="flex items-center gap-1">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
            className="w-full bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer py-1"
          >
            {children}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
