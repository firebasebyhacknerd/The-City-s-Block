import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, BedDouble, Maximize2, CheckCircle } from "lucide-react";
import { getPublicListingsAction } from "@/app/actions/listings";
import { listings as mockListings, getLocality } from "@/lib/portal";
import { getSession } from "@/lib/auth";
import { SaveSearchButton } from "@/components/portal/SaveSearchButton";

export const metadata = {
  title: "Search Property | The City's Blocks",
  description: "Browse verified offices, bungalows, and residential properties in Ahmedabad.",
};

const CITIES = ["Ahmedabad", "Gandhinagar", "Mumbai", "Delhi", "Gurugram", "Noida", "Bengaluru"];
const PROPERTY_TYPES = ["Office Space", "Villa", "Apartment", "Builder Floor", "Plot", "Retail Shop", "Warehouse"];
const FURNISHING = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const POSSESSION = ["Ready to Move", "Under Construction", "New Launch"];
const SELECT_CLS = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/10";
const INPUT_CLS = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/10";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function formatPrice(price: number, unit: string) {
  const f = price >= 10000000
    ? `₹${(price / 10000000).toFixed(2)} Cr`
    : price >= 100000
    ? `₹${(price / 100000).toFixed(1)} L`
    : `₹${price.toLocaleString("en-IN")}`;
  return unit === "month" ? `${f}/mo` : f;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const get = (k: string) => { const v = sp[k]; return Array.isArray(v) ? v[0] : (v ?? ""); };

  const q = get("q").toLowerCase();
  const city = get("city");
  const listingType = get("listing_type");
  const assetClass = get("asset_class");
  const propertyType = get("property_type");
  const furnishing = get("furnishing");
  const possession = get("possession");
  const minPrice = get("minPrice") ? Number(get("minPrice")) : 0;
  const maxPrice = get("maxPrice") ? Number(get("maxPrice")) : Infinity;
  const bhk = get("bhk");
  const locality = get("locality");

  const session = await getSession();
  const activeFilters = { q, city, listing_type: listingType, asset_class: assetClass, property_type: propertyType, bhk };
  const hasFilters = !!(q || city || listingType || assetClass || propertyType || furnishing || possession || bhk || locality || minPrice || maxPrice);

  // DB results
  let dbResults: any[] = [];
  try {
    dbResults = await getPublicListingsAction({
      city: city || undefined,
      listing_type: listingType || undefined,
      asset_class: assetClass || undefined,
      property_type: propertyType || undefined,
      q: q || undefined,
    });
  } catch {}

  // Mock results
  const mockResults = mockListings
    .filter((l) => l.status === "active")
    .filter((l) => !city || l.city.toLowerCase() === city.toLowerCase())
    .filter((l) => !listingType || l.listingType === listingType)
    .filter((l) => !assetClass || l.assetClass === assetClass)
    .filter((l) => !propertyType || l.propertyType === propertyType)
    .filter((l) => !furnishing || l.furnishing === furnishing)
    .filter((l) => !possession || l.possessionStatus === possession)
    .filter((l) => !bhk || (l.bhk !== null && l.bhk === Number(bhk.split(" ")[0])))
    .filter((l) => !locality || l.localitySlug === locality)
    .filter((l) => !minPrice || l.price >= minPrice)
    .filter((l) => maxPrice === Infinity || l.price <= maxPrice)
    .filter((l) => {
      if (!q) return true;
      const loc = getLocality(l.localitySlug)?.displayName ?? "";
      return [l.title, l.description, l.city, loc, l.propertyType, l.address]
        .join(" ").toLowerCase().includes(q);
    })
    .map((l) => ({
      id: l.id,
      title: l.title,
      city: l.city,
      locality: getLocality(l.localitySlug)?.displayName ?? "",
      price: l.price,
      price_unit: l.priceUnit,
      area: l.area,
      bhk: l.bhk,
      bathrooms: l.bathrooms,
      property_type: l.propertyType,
      listing_type: l.listingType,
      verified: l.verified,
      featured: l.featured,
      images: l.images,
      isMock: true,
    }));

  const allResults = [
    ...mockResults,
    ...dbResults.filter((d) => !mockResults.find((m) => m.title === d.title)),
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top search bar */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <form action="/search" className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search by city, locality, building name..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <button type="submit" className="rounded-lg bg-[#1B4332] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1B4332]/90">
              Search
            </button>
            {hasFilters && (
              <Link href="/search" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
                Clear
              </Link>
            )}
            {session && hasFilters && (
              <SaveSearchButton filters={activeFilters} />
            )}
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

          {/* Sidebar */}
          <aside className="h-fit rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </div>
            <form action="/search" className="space-y-4">
              {q && <input type="hidden" name="q" value={q} />}

              <FilterGroup label="City">
                <select name="city" defaultValue={city} className={SELECT_CLS}>
                  <option value="">All Cities</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </FilterGroup>

              <FilterGroup label="Listing Type">
                <select name="listing_type" defaultValue={listingType} className={SELECT_CLS}>
                  <option value="">Buy or Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </FilterGroup>

              <FilterGroup label="Property Type">
                <select name="property_type" defaultValue={propertyType} className={SELECT_CLS}>
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </FilterGroup>

              <FilterGroup label="Furnishing">
                <select name="furnishing" defaultValue={furnishing} className={SELECT_CLS}>
                  <option value="">Any</option>
                  {FURNISHING.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </FilterGroup>

              <FilterGroup label="Possession">
                <select name="possession" defaultValue={possession} className={SELECT_CLS}>
                  <option value="">Any</option>
                  {POSSESSION.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </FilterGroup>

              <FilterGroup label="Min Price (₹)">
                <input type="number" name="minPrice" defaultValue={minPrice || ""} placeholder="e.g. 25000" className={INPUT_CLS} />
              </FilterGroup>

              <FilterGroup label="Max Price (₹)">
                <input type="number" name="maxPrice" defaultValue={maxPrice === Infinity ? "" : maxPrice} placeholder="e.g. 200000" className={INPUT_CLS} />
              </FilterGroup>

              <button type="submit" className="w-full rounded-lg bg-[#1B4332] py-2.5 text-sm font-semibold text-white hover:bg-[#1B4332]/90">
                Apply Filters
              </button>
            </form>
          </aside>

          {/* Results */}
          <section>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{allResults.length}</span> properties found
                {city ? ` in ${city}` : ""}
              </p>
            </div>

            {allResults.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center">
                <p className="text-lg font-semibold text-gray-700">No properties found</p>
                <p className="mt-1 text-sm text-gray-400">Try adjusting your filters</p>
                <Link href="/search" className="mt-4 inline-block rounded-lg bg-[#1B4332] px-5 py-2 text-sm font-semibold text-white">
                  Clear Filters
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

function SearchListingCard({ listing }: { listing: any }) {
  const price = Number(listing.price);
  const formattedPrice = formatPrice(price, listing.price_unit);
  const href = listing.isMock ? `/property/${listing.id}` : `/listings/${listing.id}`;

  return (
    <Link href={href} className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {listing.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-300">No image</div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${listing.listing_type === "sale" ? "bg-blue-600" : "bg-green-600"}`}>
            {listing.listing_type === "sale" ? "For Sale" : "For Rent"}
          </span>
          {listing.verified && (
            <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-green-700">
              <CheckCircle className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1.5 p-4">
        <div className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{listing.title}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-red-500" />
          {listing.locality ? `${listing.locality}, ` : ""}{listing.city}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {listing.bhk && <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{listing.bhk} BHK</span>}
          {listing.area && <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{Number(listing.area).toLocaleString("en-IN")} sq.ft.</span>}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="text-base font-bold text-gray-900">{formattedPrice}</div>
          <div className="text-xs text-gray-400">{listing.property_type}</div>
        </div>
      </div>
    </Link>
  );
}
