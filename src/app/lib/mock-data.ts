import { listings } from "@/lib/portal";

export interface Property {
  id: string;
  title: string;
  type: string;
  status: "For Sale" | "For Rent";
  price: string;
  priceRaw: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  description: string;
  amenities: string[];
  agent: {
    name: string;
    phone: string;
    image: string;
  };
}

export const PROPERTIES: Property[] = listings.map((listing) => ({
  id: listing.id,
  title: listing.title,
  type: listing.propertyType,
  status: listing.listingType === "sale" ? "For Sale" : "For Rent",
  price: listing.priceUnit === "month" ? `INR ${listing.price}/month` : `INR ${listing.price}`,
  priceRaw: listing.price,
  location: listing.address,
  bedrooms: listing.bhk || 0,
  bathrooms: listing.bathrooms,
  sqft: listing.area,
  images: listing.images,
  description: listing.description,
  amenities: listing.amenities,
  agent: {
    name: "The City's Block Expert",
    phone: "+91 11 4555 7788",
    image: listing.images[0],
  },
}));
