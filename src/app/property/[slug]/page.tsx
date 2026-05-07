import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, BedDouble, Bath, Maximize2, CheckCircle,
  Phone, MessageCircle, Calendar, Building2, ArrowLeft
} from "lucide-react";
import { listings, getLocality } from "@/lib/portal";

type Props = { params: Promise<{ slug: string }> };

function formatPrice(price: number, unit: string) {
  const f = price >= 10000000
    ? `₹${(price / 10000000).toFixed(2)} Cr`
    : price >= 100000
    ? `₹${(price / 100000).toFixed(1)} L`
    : `₹${price.toLocaleString("en-IN")}`;
  return unit === "month" ? `${f}/month` : f;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const listing = listings.find((l) => l.id === slug || l.slug === slug);
  if (!listing) return { title: "Property Not Found" };
  return {
    title: `${listing.title} | The City's Blocks`,
    description: listing.description,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = listings.find((l) => l.id === slug || l.slug === slug);
  if (!listing) notFound();

  const locality = getLocality(listing.localitySlug);
  const displayPrice = formatPrice(listing.price, listing.priceUnit);
  const pricePerSqft = listing.area ? Math.round(listing.price / listing.area) : null;

  const whatsappText = encodeURIComponent(
    `Hi, I'm interested in "${listing.title}" listed on The City's Blocks. Please share more details.`
  );
  const whatsappLink = `https://wa.me/919998470000?text=${whatsappText}`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-800">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-gray-800">Search</Link>
          <span>/</span>
          <span className="text-gray-800 line-clamp-1">{listing.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <Link href="/search" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div className="space-y-5">
            {/* Images */}
            <div className="grid grid-cols-2 gap-2">
              {listing.images.slice(0, 4).map((img, i) => (
                <div key={i} className={`relative overflow-hidden rounded-xl bg-gray-100 ${i === 0 ? "col-span-2 h-72" : "h-44"}`}>
                  <Image src={img} alt={listing.title} fill className="object-cover" />
                </div>
              ))}
              {listing.images.length === 0 && (
                <div className="col-span-2 flex h-72 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  No images available
                </div>
              )}
            </div>

            {/* Title */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${listing.listingType === "sale" ? "bg-blue-600" : "bg-green-600"}`}>
                  {listing.listingType === "sale" ? "For Sale" : "For Rent"}
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                  {listing.propertyType}
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                  {listing.assetClass}
                </span>
                {listing.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
              <div className="mt-2 flex items-center gap-1.5 text-gray-500">
                <MapPin className="h-4 w-4 shrink-0 text-red-500" />
                <span className="text-sm">{listing.address || `${locality?.displayName ?? ""}, ${listing.city}`}</span>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {listing.bhk && (
                <StatCard icon={BedDouble} label="BHK" value={`${listing.bhk} BHK`} />
              )}
              {listing.bathrooms > 0 && (
                <StatCard icon={Bath} label="Bathrooms" value={String(listing.bathrooms)} />
              )}
              {listing.area > 0 && (
                <StatCard icon={Maximize2} label="Area" value={`${listing.area.toLocaleString("en-IN")} sq.ft.`} />
              )}
              {listing.possessionStatus && (
                <StatCard icon={Calendar} label="Possession" value={listing.possessionStatus} />
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-3 font-semibold text-gray-900">About this property</h2>
                <p className="text-sm leading-7 text-gray-600">{listing.description}</p>
              </div>
            )}

            {/* Details table */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900">Property Details</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <DetailRow label="Property Type" value={listing.propertyType} />
                <DetailRow label="Listing Type" value={listing.listingType === "sale" ? "For Sale" : "For Rent"} />
                <DetailRow label="City" value={listing.city} />
                {locality && <DetailRow label="Locality" value={locality.displayName} />}
                {listing.bhk && <DetailRow label="BHK" value={`${listing.bhk} BHK`} />}
                <DetailRow label="Area" value={`${listing.area.toLocaleString("en-IN")} sq.ft.`} />
                <DetailRow label="Furnishing" value={listing.furnishing} />
                <DetailRow label="Possession" value={listing.possessionStatus} />
                {pricePerSqft && <DetailRow label="Price/sq.ft." value={`₹${pricePerSqft.toLocaleString("en-IN")}`} />}
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities.length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-semibold text-gray-900">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((a) => (
                    <span key={a} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Price card */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">{displayPrice}</div>
              {pricePerSqft && (
                <div className="mt-1 text-sm text-gray-500">
                  ₹{pricePerSqft.toLocaleString("en-IN")}/sq.ft.
                </div>
              )}
              <div className="mt-1 text-xs text-gray-400 capitalize">{listing.furnishing}</div>
            </div>

            {/* Contact card */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B4332]/10">
                  <Building2 className="h-5 w-5 text-[#1B4332]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">The City's Blocks</div>
                  <div className="text-xs text-gray-500">Trusted Advisory</div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="tel:+919998470000"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B4332] py-3 text-sm font-semibold text-white transition hover:bg-[#1B4332]/90"
                >
                  <Phone className="h-4 w-4" /> Call: +91 99984 70000
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* Inquiry form */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Send Inquiry</h3>
              <InquiryFormSimple listingTitle={listing.title} />
            </div>

            {/* Location */}
            {locality && (
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold text-gray-900">Location</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-red-500" />
                  {locality.displayName}, {listing.city}
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">{locality.overview}</p>
                <Link
                  href={`/locality/${encodeURIComponent(listing.city)}/${listing.localitySlug}`}
                  className="mt-3 inline-block text-xs font-medium text-[#1B4332] hover:underline"
                >
                  Explore {locality.displayName} →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
      <Icon className="mx-auto mb-1.5 h-5 w-5 text-gray-400" />
      <div className="text-sm font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium text-gray-800">{value}</div>
    </>
  );
}

function InquiryFormSimple({ listingTitle }: { listingTitle: string }) {
  return (
    <form
      action={`https://formsubmit.co/hello@citysblock.in`}
      method="POST"
      className="space-y-3"
    >
      <input type="hidden" name="_subject" value={`Inquiry: ${listingTitle}`} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="listing" value={listingTitle} />
      <input
        name="name"
        required
        placeholder="Your name"
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
      />
      <input
        name="phone"
        required
        placeholder="Phone number"
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
      />
      <input
        name="email"
        type="email"
        placeholder="Email (optional)"
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
      />
      <textarea
        name="message"
        rows={3}
        placeholder="I'm interested in this property..."
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-[#C9A84C] py-2.5 text-sm font-semibold text-white transition hover:bg-[#C9A84C]/90"
      >
        Send Inquiry
      </button>
    </form>
  );
}
