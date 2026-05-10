import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize2, CheckCircle, Phone, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getListingByIdAction } from "@/app/actions/listings";
import { InquiryForm } from "@/components/portal/InquiryFormDb";
import { FavoriteButton } from "@/components/portal/FavoriteButton";

type Props = { params: Promise<{ id: string }> };

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingByIdAction(id);
  if (!listing) notFound();

  const price = Number(listing.price);
  const formattedPrice = price >= 10000000
    ? `₹${(price / 10000000).toFixed(2)} Cr`
    : price >= 100000
    ? `₹${(price / 100000).toFixed(1)} L`
    : `₹${price.toLocaleString("en-IN")}`;
  const displayPrice = listing.price_unit === "month" ? `${formattedPrice}/month` : formattedPrice;

  return (
    <main className="container-shell py-10 pb-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left */}
        <div className="space-y-6">
          {/* Images */}
          <div className="grid gap-3 grid-cols-2">
            {listing.images?.slice(0, 4).map((img: string, i: number) => (
              <div key={i} className={`relative rounded-[20px] overflow-hidden bg-slate-100 ${i === 0 ? "col-span-2 h-72" : "h-44"}`}>
                <Image src={img} alt={listing.title} fill className="object-cover" />
              </div>
            ))}
            {(!listing.images || listing.images.length === 0) && (
              <div className="col-span-2 h-72 rounded-[20px] bg-slate-100 flex items-center justify-center text-slate-400">
                No images available
              </div>
            )}
          </div>

          {/* Title & badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={`rounded-full ${listing.listing_type === "sale" ? "bg-blue-600" : "bg-green-600"} text-white border-0`}>
                {listing.listing_type === "sale" ? "For Sale" : "For Rent"}
              </Badge>
              <Badge variant="outline" className="rounded-full">{listing.property_type}</Badge>
              <Badge variant="outline" className="rounded-full capitalize">{listing.asset_class}</Badge>
              {listing.verified && (
                <Badge className="rounded-full bg-green-50 text-green-700 border-green-200 gap-1">
                  <CheckCircle className="h-3 w-3" /> Verified
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-semibold text-slate-950">{listing.title}</h1>
            <div className="flex items-center gap-1.5 mt-2 text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{listing.address || `${listing.locality ? listing.locality + ", " : ""}${listing.city}`}</span>
            </div>
          </div>

          {/* Key details */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {listing.bhk && (
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 text-center shadow-sm">
                <BedDouble className="h-5 w-5 mx-auto text-slate-400 mb-1" />
                <div className="font-semibold text-slate-950">{listing.bhk} BHK</div>
                <div className="text-xs text-slate-500">Bedrooms</div>
              </div>
            )}
            {listing.bathrooms && (
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 text-center shadow-sm">
                <Bath className="h-5 w-5 mx-auto text-slate-400 mb-1" />
                <div className="font-semibold text-slate-950">{listing.bathrooms}</div>
                <div className="text-xs text-slate-500">Bathrooms</div>
              </div>
            )}
            {listing.area && (
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 text-center shadow-sm">
                <Maximize2 className="h-5 w-5 mx-auto text-slate-400 mb-1" />
                <div className="font-semibold text-slate-950">{listing.area}</div>
                <div className="text-xs text-slate-500">sq.ft.</div>
              </div>
            )}
            {listing.possession && (
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 text-center shadow-sm">
                <Calendar className="h-5 w-5 mx-auto text-slate-400 mb-1" />
                <div className="font-semibold text-slate-950 text-xs leading-tight">{listing.possession}</div>
                <div className="text-xs text-slate-500">Possession</div>
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950 mb-3">About this property</h2>
              <p className="text-slate-600 leading-7">{listing.description}</p>
            </div>
          )}

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950 mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a: string) => (
                  <span key={a} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Price card */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-3xl font-bold text-slate-950">{displayPrice}</div>
              <FavoriteButton listingId={listing.id} />
            </div>
            {listing.area && (
              <div className="text-sm text-slate-500 mt-1">
                ₹{Math.round(price / listing.area).toLocaleString("en-IN")}/sq.ft.
              </div>
            )}
            {listing.furnishing && (
              <div className="mt-3 text-sm text-slate-600">
                <span className="font-medium">Furnishing:</span> {listing.furnishing}
              </div>
            )}
          </div>

          {/* Owner info */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-950 mb-3">Listed by</h3>
            <div className="font-medium text-slate-800">{listing.owner_name}</div>
            {listing.owner_phone && (
              <a
                href={`tel:${listing.owner_phone}`}
                className="mt-3 flex items-center gap-2 rounded-full bg-slate-950 text-white px-4 py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                <Phone className="h-4 w-4" /> {listing.owner_phone}
              </a>
            )}
          </div>

          {/* Inquiry form */}
          <InquiryForm listingId={listing.id} listingTitle={listing.title} />
        </div>
      </div>
    </main>
  );
}
