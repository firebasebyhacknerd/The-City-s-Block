import { getPublicListingsAction } from "@/app/actions/listings";
import { DbListingCard } from "@/components/portal/DbListingCard";
import { PageIntro } from "@/components/portal/PageIntro";

const CITIES = [
  "Mumbai",
  "Delhi",
  "Gurugram",
  "Noida",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
];

export const metadata = {
  title: "Commercial Properties | The City's Block",
  description:
    "Browse commercial properties for sale and rent across India's top business markets.",
};

type CommercialPageProps = {
  searchParams: Promise<{ city?: string; listing_type?: string }>;
};

export default async function CommercialPage({ searchParams }: CommercialPageProps) {
  const { city, listing_type } = await searchParams;

  const listings = await getPublicListingsAction({
    asset_class: "commercial",
    city: city || undefined,
    listing_type: listing_type || undefined,
  });

  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Commercial"
        title="Commercial properties for businesses that mean business"
        description="Find office spaces, retail units, warehouses, and more across India's top commercial hubs."
      />

      {/* Filter bar */}
      <form method="GET" className="mt-8 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="city" className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            City
          </label>
          <select
            id="city"
            name="city"
            defaultValue={city || ""}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
          >
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="listing_type" className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Type
          </label>
          <select
            id="listing_type"
            name="listing_type"
            defaultValue={listing_type || ""}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
          >
            <option value="">Sale &amp; Rent</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-2xl bg-slate-950 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          Apply filters
        </button>

        {(city || listing_type) && (
          <a
            href="/commercial"
            className="rounded-2xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Clear
          </a>
        )}
      </form>

      {/* Listings grid */}
      {listings.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing: any) => (
            <DbListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm max-w-md">
            <div className="text-2xl font-semibold text-slate-950">No commercial listings yet</div>
            <p className="mt-3 text-sm text-slate-500">
              {city || listing_type
                ? "No commercial properties match your current filters. Try adjusting or clearing them."
                : "Commercial listings will appear here once they are approved. Check back soon."}
            </p>
            {(city || listing_type) && (
              <a
                href="/commercial"
                className="mt-5 inline-block rounded-2xl bg-slate-950 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Clear filters
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
