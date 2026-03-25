import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { ListingCard } from "@/components/portal/ListingCard";
import { PageIntro } from "@/components/portal/PageIntro";
import { Button } from "@/components/ui/button";
import {
  amenityOptions,
  bhkOptions,
  filterListings,
  localities,
  parseSearchParams,
  propertyTypes,
  serializeFilters,
} from "@/lib/portal";

export const metadata = {
  title: "Search Property in India | The City's Block",
  description:
    "Browse verified homes, rentals, and commercial listings across India with filters built for faster, more confident shortlisting.",
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const filters = parseSearchParams(await searchParams);
  const results = filterListings(filters);

  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Search"
        title="Search with more clarity, shortlist with more confidence"
        description="Refine by city, locality, price, configuration, and property type to reach listings that feel relevant from the very first glance."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-950">Refine your search</div>
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          </div>
          <form className="space-y-4" action="/search">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Search term</span>
              <input
                name="q"
                defaultValue={filters.q}
                placeholder="City, locality, project, or landmark"
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">City</span>
              <select name="city" defaultValue={filters.city} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                <option value="">All cities</option>
                {[...new Set(localities.map((locality) => locality.city))].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Locality</span>
              <select name="locality" defaultValue={filters.locality} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                <option value="">Any locality</option>
                {localities.map((locality) => (
                  <option key={locality.id} value={locality.slug}>
                    {locality.displayName}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Intent</span>
                <select name="listingType" defaultValue={filters.listingType} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                  <option value="">Any</option>
                  <option value="sale">Buy</option>
                  <option value="rent">Rent</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Asset class</span>
                <select name="assetClass" defaultValue={filters.assetClass} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                  <option value="">Any</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Property type</span>
                <select name="propertyType" defaultValue={filters.propertyType} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                  <option value="">All types</option>
                  {propertyTypes.map((propertyType) => (
                    <option key={propertyType} value={propertyType}>
                      {propertyType}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">BHK</span>
                <select name="bhk" defaultValue={filters.bhk} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                  <option value="">Any</option>
                  {bhkOptions.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Min price</span>
                <input
                  name="minPrice"
                  type="number"
                  defaultValue={filters.minPrice}
                  className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Max price</span>
                <input
                  name="maxPrice"
                  type="number"
                  defaultValue={filters.maxPrice}
                  className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm"
                />
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Amenity</span>
              <select name="amenity" defaultValue={filters.amenity} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm">
                <option value="">Any amenity</option>
                {amenityOptions.map((amenity) => (
                  <option key={amenity} value={amenity}>
                    {amenity}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="verified" value="true" defaultChecked={filters.verified} />
                Verified listings only
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="featured" value="true" defaultChecked={filters.featured} />
                Featured picks only
              </label>
            </div>
            <input type="hidden" name="sort" value={filters.sort || "relevance"} />
            <Button className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">
              Show matching properties
            </Button>
          </form>
        </aside>

        <section className="space-y-5">
          <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-950">{results.length} properties matched your search</div>
              <div className="text-sm text-slate-500">
                Shareable search link: /search?{serializeFilters(filters)}
              </div>
            </div>
            <form action="/search" className="flex flex-wrap items-center gap-3">
              {Object.entries(filters).map(([key, value]) =>
                value ? <input key={key} type="hidden" name={key} value={String(value)} /> : null,
              )}
              <select
                name="sort"
                defaultValue={filters.sort || "relevance"}
                className="h-11 rounded-2xl border border-slate-200 px-4 text-sm"
              >
                <option value="relevance">Best match</option>
                <option value="featured">Featured first</option>
                <option value="newest">Newest first</option>
                <option value="priceAsc">Lowest price first</option>
                <option value="priceDesc">Highest price first</option>
              </select>
              <Button variant="outline" className="rounded-full border-slate-200">
                Update order
              </Button>
            </form>
          </div>

          {results.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="text-xl font-semibold text-slate-950">No listings matched this combination yet</div>
              <p className="mt-2 text-sm text-slate-500">
                Broaden the filters or restart your search to uncover more options.
              </p>
              <Button asChild className="mt-5 rounded-full bg-slate-950 text-white hover:bg-slate-800">
                <Link href="/search">Start a fresh search</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
