import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicListingsAction } from "@/app/actions/listings";
import { DbListingCard } from "@/components/portal/DbListingCard";

export const metadata = {
  title: "Search Property | The City's Block",
  description: "Browse verified homes, rentals, and commercial listings across India.",
};

const CITIES = ["Mumbai", "Delhi", "Gurugram", "Noida", "Bengaluru", "Hyderabad", "Pune", "Chennai"];
const PROPERTY_TYPES = ["Apartment", "Builder Floor", "Villa", "Plot", "Office Space", "Retail Shop", "Warehouse"];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const get = (k: string) => { const v = sp[k]; return Array.isArray(v) ? v[0] : v; };

  const filters = {
    city: get("city"),
    listing_type: get("listing_type"),
    asset_class: get("asset_class"),
    property_type: get("property_type"),
    q: get("q"),
  };

  const results = await getPublicListingsAction(filters);

  return (
    <main className="container-shell py-10 pb-16">
      <div className="mb-8">
        <div className="text-sm text-slate-500 mb-1">Search</div>
        <h1 className="text-3xl font-semibold text-slate-950">Find your next property</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm h-fit">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-950">Filters</div>
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          </div>
          <form className="space-y-4" action="/search">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Search</span>
              <input
                name="q"
                defaultValue={filters.q}
                placeholder="City, locality, keyword..."
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">City</span>
              <select name="city" defaultValue={filters.city} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                <option value="">All cities</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Intent</span>
              <select name="listing_type" defaultValue={filters.listing_type} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                <option value="">Buy or Rent</option>
                <option value="sale">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Asset class</span>
              <select name="asset_class" defaultValue={filters.asset_class} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                <option value="">Any</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Property type</span>
              <select name="property_type" defaultValue={filters.property_type} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                <option value="">All types</option>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <Button className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">
              Search
            </Button>
            <Link href="/search" className="block text-center text-sm text-slate-500 hover:text-slate-700">
              Clear filters
            </Link>
          </form>
        </aside>

        {/* Results */}
        <section className="space-y-5">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
            <div className="text-slate-700 font-medium">{results.length} properties found</div>
            {filters.city && <div className="text-sm text-slate-500">in {filters.city}</div>}
          </div>

          {results.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((listing) => (
                <DbListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="text-xl font-semibold text-slate-950 mb-2">No listings found</div>
              <p className="text-sm text-slate-500 mb-5">Try different filters or check back later.</p>
              <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                <Link href="/search">Clear all filters</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
