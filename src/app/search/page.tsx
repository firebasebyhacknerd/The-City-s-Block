import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, BedDouble, Maximize2, CheckCircle } from "lucide-react";
import { getPublicListingsAction } from "@/app/actions/listings";
import { getSession } from "@/lib/auth";
import { SaveSearchButton } from "@/components/portal/SaveSearchButton";
import { SearchFilterChips } from "@/components/search/SearchFilterChips";
import {
  parseSearchFilters,
  SEARCH_CITIES,
  SEARCH_PROPERTY_TYPES,
  SEARCH_BHK_OPTIONS,
  SEARCH_POSSESSION,
  SEARCH_SORT_OPTIONS,
  buildSearchQueryString,
} from "@/lib/search-params";
import type { DbListing } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Property | The City's Block",
  description: "Browse verified homes and commercial spaces in Ahmedabad and Gandhinagar.",
};

const FURNISHING = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const SELECT_CLS =
  "w-full min-h-[44px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/10";
const INPUT_CLS =
  "w-full min-h-[44px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/10";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function formatPrice(price: number, unit: string) {
  const f =
    price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : price >= 100000
        ? `₹${(price / 100000).toFixed(1)} L`
        : `₹${price.toLocaleString("en-IN")}`;
  return unit === "month" ? `${f}/mo` : f;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const parsed = parseSearchFilters(sp);

  const filtersForChips = {
    q: parsed.q,
    city: parsed.city,
    listing_type: parsed.listing_type,
    property_type: parsed.property_type,
    bhk: parsed.bhk,
    furnishing: parsed.furnishing,
    possession: parsed.possession,
    locality: parsed.locality,
    minPrice: parsed.minPriceNum,
    maxPrice: parsed.maxPriceNum,
    featured: parsed.featured,
  };

  const hasFilters = !!(
    parsed.q ||
    parsed.city ||
    parsed.listing_type ||
    parsed.property_type ||
    parsed.bhk ||
    parsed.furnishing ||
    parsed.possession ||
    parsed.locality ||
    parsed.minPriceNum ||
    parsed.maxPriceNum ||
    parsed.featured
  );

  const session = await getSession();
  const activeFilters = {
    q: parsed.q,
    city: parsed.city,
    listing_type: parsed.listing_type,
    property_type: parsed.property_type,
    bhk: parsed.bhk,
  };

  let allResults: DbListing[] = [];
  try {
    allResults = await getPublicListingsAction({
      q: parsed.q || undefined,
      city: parsed.city || undefined,
      listing_type: parsed.listing_type || undefined,
      asset_class: parsed.asset_class || undefined,
      property_type: parsed.property_type || undefined,
      bhkNum: parsed.bhkNum,
      furnishing: parsed.furnishing || undefined,
      possession: parsed.possession || undefined,
      minPrice: parsed.minPriceNum,
      maxPrice: parsed.maxPriceNum,
      locality: parsed.locality || undefined,
      featured: parsed.featured || undefined,
      sort: (parsed.sort as "relevance" | "newest" | "priceAsc" | "priceDesc") || "relevance",
    });
  } catch (error) {
    console.error("Search fetch error:", error);
  }

  const sortQs = (sort: string) => {
    const qs = buildSearchQueryString({ ...filtersForChips, sort });
    return `/search${qs ? `?${qs}` : ""}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-6">
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <form action="/search" method="get" className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                name="q"
                defaultValue={parsed.q}
                placeholder="Search by city, locality, building..."
                className="min-h-[40px] flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            {parsed.city && <input type="hidden" name="city" value={parsed.city} />}
            {parsed.listing_type && (
              <input type="hidden" name="listing_type" value={parsed.listing_type} />
            )}
            <button
              type="submit"
              className="btn-brand min-h-[44px] rounded-lg px-5 py-2 text-sm font-semibold"
            >
              Search
            </button>
            {hasFilters && (
              <Link
                href="/search"
                className="min-h-[44px] rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 flex items-center"
              >
                Clear
              </Link>
            )}
            {session && hasFilters && <SaveSearchButton filters={activeFilters} />}
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </div>
            <form action="/search" method="get" className="space-y-4">
              {parsed.q && <input type="hidden" name="q" value={parsed.q} />}
              {parsed.sort && parsed.sort !== "relevance" && (
                <input type="hidden" name="sort" value={parsed.sort} />
              )}

              <FilterGroup label="City">
                <select name="city" defaultValue={parsed.city} className={SELECT_CLS}>
                  <option value="">All Cities</option>
                  {SEARCH_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="Listing Type">
                <select name="listing_type" defaultValue={parsed.listing_type} className={SELECT_CLS}>
                  <option value="">Buy or Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </FilterGroup>

              <FilterGroup label="Property Type">
                <select name="property_type" defaultValue={parsed.property_type} className={SELECT_CLS}>
                  <option value="">All Types</option>
                  {SEARCH_PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="BHK">
                <select name="bhk" defaultValue={parsed.bhk} className={SELECT_CLS}>
                  <option value="">Any</option>
                  {SEARCH_BHK_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="Furnishing">
                <select name="furnishing" defaultValue={parsed.furnishing} className={SELECT_CLS}>
                  <option value="">Any</option>
                  {FURNISHING.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="Possession">
                <select name="possession" defaultValue={parsed.possession} className={SELECT_CLS}>
                  <option value="">Any</option>
                  {SEARCH_POSSESSION.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="Min Price (₹)">
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={parsed.minPriceNum ?? ""}
                  placeholder="e.g. 2500000"
                  className={INPUT_CLS}
                />
              </FilterGroup>

              <FilterGroup label="Max Price (₹)">
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={parsed.maxPriceNum ?? ""}
                  placeholder="e.g. 20000000"
                  className={INPUT_CLS}
                />
              </FilterGroup>

              <button type="submit" className="btn-brand w-full min-h-[44px] rounded-lg py-2.5 text-sm font-semibold">
                Apply Filters
              </button>
            </form>
          </aside>

          <section>
            <SearchFilterChips filters={filtersForChips} />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{allResults.length}</span> properties
                found
                {parsed.city ? ` in ${parsed.city}` : ""}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Sort:</span>
                {SEARCH_SORT_OPTIONS.map((opt) => (
                  <Link
                    key={opt.value}
                    href={sortQs(opt.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      (parsed.sort || "relevance") === opt.value
                        ? "bg-[#1B4332] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#1B4332]/30"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {allResults.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center">
                <p className="text-lg font-semibold text-gray-700">No properties found</p>
                <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or browse all listings</p>
                <Link href="/search" className="btn-brand mt-4 inline-block rounded-lg px-5 py-2 text-sm font-semibold">
                  View all listings
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {allResults.map((listing) => (
                  <SearchListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function SearchListingCard({ listing }: { listing: DbListing }) {
  const price = Number(listing.price);
  const formattedPrice = formatPrice(price, listing.price_unit);
  const href = `/listings/${listing.id}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1B4332]/20 hover:shadow-xl"
    >
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {listing.images?.[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized={listing.isMock}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-300">No image</div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
              listing.listing_type === "sale" ? "bg-[#1B4332]" : "bg-[#C9A84C] text-[#1B4332]"
            }`}
          >
            {listing.listing_type === "sale" ? "For Sale" : "For Rent"}
          </span>
          {listing.verified && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1B4332] shadow-sm">
              <CheckCircle className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1.5 p-4">
        <div className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{listing.title}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A84C]" />
          {listing.locality ? `${listing.locality}, ` : ""}
          {listing.city}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {listing.bhk && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {listing.bhk} BHK
            </span>
          )}
          {listing.area && (
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {Number(listing.area).toLocaleString("en-IN")} sq.ft.
            </span>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-gray-50 pt-2">
          <div className="text-base font-bold text-[#1B4332]">{formattedPrice}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C]">
            {listing.property_type}
          </div>
        </div>
      </div>
    </Link>
  );
}
