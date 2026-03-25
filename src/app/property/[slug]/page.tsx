import Image from "next/image";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Building2, CheckCircle2, MapPin, Square } from "lucide-react";
import { InquiryForm } from "@/components/portal/InquiryForm";
import { ListingCard } from "@/components/portal/ListingCard";
import { MapPanel } from "@/components/portal/MapPanel";
import { buildCanonical, formatArea, formatPrice, getListing, getLocality, getProfileById, getProject, getSimilarListings } from "@/lib/portal";

type PropertyDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PropertyDetailProps) {
  const { slug } = await params;
  const listing = getListing(slug);

  if (!listing) return {};

  return {
    title: `${listing.title} | Buy or Rent Property in ${listing.city}`,
    description: listing.description,
    alternates: { canonical: buildCanonical(`/property/${listing.slug}`) },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailProps) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) notFound();

  const profile = getProfileById(listing.profileId);
  const locality = getLocality(listing.localitySlug);
  const project = listing.projectId ? getProject(listing.projectId) : null;
  const similarListings = getSimilarListings(listing);

  return (
    <main className="container-shell py-10 pb-16">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white">
                {listing.listingType === "sale" ? "For Sale" : "For Rent"}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                {listing.assetClass}
              </span>
              {listing.verified ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  Verified Listing
                </span>
              ) : null}
            </div>
            <h1 className="font-headline text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4 text-amber-500" />
              {listing.address}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[32px]">
              <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
            </div>
            <div className="grid gap-4">
              {listing.images.slice(1, 3).map((image) => (
                <div key={image} className="relative aspect-[16/11] overflow-hidden rounded-[28px]">
                  <Image src={image} alt={listing.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Quoted price</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">{formatPrice(listing)}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Configuration</div>
              <div className="mt-1 flex items-center gap-2 text-xl font-semibold text-slate-950">
                <BedDouble className="h-4 w-4 text-amber-500" />
                {listing.bhk ? `${listing.bhk} BHK` : listing.propertyType}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Bathrooms</div>
              <div className="mt-1 flex items-center gap-2 text-xl font-semibold text-slate-950">
                <Bath className="h-4 w-4 text-amber-500" />
                {listing.bathrooms}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Super area</div>
              <div className="mt-1 flex items-center gap-2 text-xl font-semibold text-slate-950">
                <Square className="h-4 w-4 text-amber-500" />
                {formatArea(listing.area)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.95fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-2xl font-semibold text-slate-950">Why this property stands out</div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{listing.description}</p>
              <div className="mt-6 grid gap-3">
                <div className="text-sm text-slate-500">Property type: {listing.propertyType}</div>
                <div className="text-sm text-slate-500">Furnishing level: {listing.furnishing}</div>
                <div className="text-sm text-slate-500">Possession stage: {listing.possessionStatus}</div>
                {project ? <div className="text-sm text-slate-500">Project association: {project.name}</div> : null}
                {locality ? <div className="text-sm text-slate-500">Locality advantage: {locality.displayName}</div> : null}
              </div>
            </div>
            <MapPanel item={{ coordinates: listing.coordinates, address: listing.address, title: listing.title }} />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-2xl font-semibold text-slate-950">Lifestyle and everyday advantages</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {listing.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {similarListings.length ? (
            <section className="space-y-4">
              <div className="text-2xl font-semibold text-slate-950">More homes worth comparing</div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {similarListings.map((candidate) => (
                  <ListingCard key={candidate.id} listing={candidate} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="space-y-6">
          {profile ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">Guided by</div>
              <div className="mt-1 text-2xl font-semibold text-slate-950">{profile.name}</div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <Building2 className="h-4 w-4 text-amber-500" />
                {profile.companyName || profile.role}
              </div>
              <div className="mt-4 text-sm leading-7 text-slate-600">{profile.bio}</div>
            </div>
          ) : null}
          {profile ? <InquiryForm listing={listing} profile={profile} /> : null}
        </div>
      </div>
    </main>
  );
}
