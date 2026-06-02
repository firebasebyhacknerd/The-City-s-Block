import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CheckCircle, BedDouble, Bath, Maximize2 } from "lucide-react";
import { getListingsByLocalityAction } from "@/app/actions/listings";
import { getLocalityBySlug } from "@/lib/portal";

export const dynamic = "force-dynamic";

type LocalityDetailProps = {
  params: Promise<{ city: string; slug: string }>;
};

function formatPrice(price: number, unit: string) {
  const f = price >= 10000000
    ? `₹${(price / 10000000).toFixed(2)} Cr`
    : price >= 100000
    ? `₹${(price / 100000).toFixed(1)} L`
    : `₹${price.toLocaleString("en-IN")}`;
  return unit === "month" ? `${f}/mo` : f;
}

export default async function LocalityDetailPage({ params }: LocalityDetailProps) {
  const { city, slug } = await params;
  const locality = getLocalityBySlug(city, slug);
  if (!locality) notFound();

  const listings = await getListingsByLocalityAction(slug);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1B4332] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">{locality.displayName}</h1>
          <p className="mt-4 text-white/70">{locality.city}, India</p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/90">
            {locality.overview}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Properties in {locality.displayName}</h2>
        
        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-lg font-semibold text-gray-700">No active listings in this locality</p>
            <Link href="/search" className="mt-4 inline-block text-[#1B4332] hover:underline">
              Browse all properties →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((l: any) => (
              <Link
                key={l.id}
                href={`/listings/${l.id}`}
                className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {l.images?.[0] ? (
                    <Image src={l.images[0]} alt={l.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-300">No image</div>
                  )}
                  <div className="absolute left-3 top-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${l.listing_type === 'sale' ? 'bg-[#1B4332]' : 'bg-[#C9A84C]'}`}>
                      {l.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="line-clamp-2 text-sm font-semibold text-gray-900">{l.title}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3 text-red-500" />
                    {l.locality}, {l.city}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {l.bhk && <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{l.bhk} BHK</span>}
                    {l.area && <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" />{l.area} sq.ft.</span>}
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                    <div className="text-base font-bold text-[#1B4332]">{formatPrice(Number(l.price), l.price_unit)}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C]">{l.property_type}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
