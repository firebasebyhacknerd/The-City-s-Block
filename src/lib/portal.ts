import { cache } from "react";

export type Role = "buyer" | "owner" | "agent" | "builder" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified";
export type ListingType = "sale" | "rent";
export type AssetClass = "residential" | "commercial";
export type PropertyType =
  | "Apartment"
  | "Builder Floor"
  | "Villa"
  | "Plot"
  | "Office Space"
  | "Retail Shop"
  | "Warehouse";
export type ListingStatus =
  | "draft"
  | "pending"
  | "active"
  | "rejected"
  | "sold"
  | "rented"
  | "archived";
export type Furnishing = "Unfurnished" | "Semi-Furnished" | "Fully Furnished";
export type PossessionStatus =
  | "Ready to Move"
  | "Under Construction"
  | "New Launch";

export interface Profile {
  id: string;
  slug: string;
  role: Role;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  city: string;
  companyName?: string;
  verificationStatus: VerificationStatus;
  bio: string;
}

export interface Locality {
  id: string;
  city: string;
  slug: string;
  displayName: string;
  overview: string;
  avgPricePerSqft: number;
  rentalYield: string;
  coordinates: { lat: number; lng: number };
  highlights: string[];
  landmarks: string[];
  image: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  builderId: string;
  city: string;
  localitySlug: string;
  coverImage: string;
  gallery: string[];
  minPrice: number;
  maxPrice: number;
  configurations: string[];
  possessionDate: string;
  status: PossessionStatus;
  brochureUrl: string;
  featured: boolean;
  summary: string;
  amenities: string[];
}

export interface Listing {
  id: string;
  slug: string;
  listingType: ListingType;
  assetClass: AssetClass;
  propertyType: PropertyType;
  title: string;
  description: string;
  city: string;
  localitySlug: string;
  address: string;
  coordinates: { lat: number; lng: number };
  price: number;
  priceUnit: "total" | "month";
  area: number;
  areaUnit: "sqft";
  bhk: number | null;
  bathrooms: number;
  furnishing: Furnishing;
  possessionStatus: PossessionStatus;
  projectId?: string;
  ownerType: "owner" | "agent" | "builder";
  featured: boolean;
  verified: boolean;
  status: ListingStatus;
  tags: string[];
  amenities: string[];
  images: string[];
  profileId: string;
  postedOn: string;
}

export interface Inquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  createdAt: string;
  channel: "form" | "whatsapp" | "email";
  status: "new" | "contacted" | "closed";
}

export interface SavedSearch {
  id: string;
  label: string;
  city: string;
  filters: Record<string, string>;
  resultCount: number;
}

export interface SearchFilters {
  city?: string;
  locality?: string;
  listingType?: ListingType;
  assetClass?: AssetClass;
  propertyType?: string;
  bhk?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  furnishing?: Furnishing;
  possession?: PossessionStatus;
  postedBy?: "owner" | "agent" | "builder";
  verified?: boolean;
  featured?: boolean;
  projectStatus?: PossessionStatus;
  amenity?: string;
  sort?: "relevance" | "featured" | "newest" | "priceAsc" | "priceDesc";
  q?: string;
}

export const portalEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  resendKey: process.env.RESEND_API_KEY || "",
  resendFrom: process.env.RESEND_FROM || "",
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
  aiEnabled: Boolean(process.env.GOOGLE_API_KEY),
};

export const integrationStatus = {
  resend: Boolean(portalEnv.resendKey && portalEnv.resendFrom),
  mapbox: Boolean(portalEnv.mapboxToken),
  ai: portalEnv.aiEnabled,
};


import { profiles, localities, projects, listings, inquiries, savedSearches, bhkOptions, propertyTypes, amenityOptions } from "./mock-data";

export { profiles, localities, projects, listings, inquiries, savedSearches, bhkOptions, propertyTypes, amenityOptions };

export function getLocalityBySlug(city: string, slug: string) {
  return localities.find(
    (locality) =>
      slug === locality.slug &&
      locality.city.toLowerCase() === decodeURIComponent(city).toLowerCase(),
  );
}

export function getLocality(slug: string) {
  return localities.find((locality) => locality.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getListing(slugOrId: string) {
  return listings.find(
    (listing) => listing.slug === slugOrId || listing.id === slugOrId,
  );
}

export function getProfile(slug: string) {
  return profiles.find((profile) => profile.slug === slug);
}

export function getProfileById(profileId: string) {
  return profiles.find((profile) => profile.id === profileId);
}

export function getListingsForProfile(profileId: string) {
  return listings.filter((listing) => listing.profileId === profileId);
}

export function getListingsForLocality(localitySlug: string) {
  return listings.filter((listing) => listing.localitySlug === localitySlug);
}

export function getProjectsForLocality(localitySlug: string) {
  return projects.filter((project) => project.localitySlug === localitySlug);
}

export function getProjectBuilder(project: Project) {
  return getProfileById(project.builderId);
}

export function formatInr(value: number, compact = false) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(value);
}

export function formatPrice(listing: Listing) {
  const base = formatInr(listing.price, listing.price >= 1000000);
  return listing.priceUnit === "month" ? `${base}/month` : base;
}

export function formatArea(area: number) {
  return `${new Intl.NumberFormat("en-IN").format(area)} sq.ft.`;
}

export function timeAgo(date: string) {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export function getWhatsAppLink(phone: string, title: string) {
  const normalized = phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(
    `Hi, I am interested in ${title} listed on The City's Block.`,
  );
  return `https://wa.me/${normalized}?text=${text}`;
}

export function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): SearchFilters {
  const read = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const boolValue = (key: string) => read(key) === "true";
  const numberValue = (key: string) => {
    const raw = read(key);
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  return {
    city: read("city") || undefined,
    locality: read("locality") || undefined,
    listingType: (read("listingType") as ListingType | undefined) || undefined,
    assetClass: (read("assetClass") as AssetClass | undefined) || undefined,
    propertyType: read("propertyType") || undefined,
    bhk: read("bhk") || undefined,
    minPrice: numberValue("minPrice"),
    maxPrice: numberValue("maxPrice"),
    minArea: numberValue("minArea"),
    furnishing: (read("furnishing") as Furnishing | undefined) || undefined,
    possession: (read("possession") as PossessionStatus | undefined) || undefined,
    postedBy: (read("postedBy") as "owner" | "agent" | "builder" | undefined) || undefined,
    verified: boolValue("verified") || undefined,
    featured: boolValue("featured") || undefined,
    projectStatus: (read("projectStatus") as PossessionStatus | undefined) || undefined,
    amenity: read("amenity") || undefined,
    sort:
      (read("sort") as SearchFilters["sort"] | undefined) || "relevance",
    q: read("q") || undefined,
  };
}

export function serializeFilters(filters: SearchFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  return params.toString();
}

export function filterListings(input: SearchFilters = {}) {
  const query = input.q?.toLowerCase().trim();

  const filtered = listings.filter((listing) => {
    if (input.city && listing.city !== input.city) return false;
    if (input.locality && listing.localitySlug !== input.locality) return false;
    if (input.listingType && listing.listingType !== input.listingType) return false;
    if (input.assetClass && listing.assetClass !== input.assetClass) return false;
    if (input.propertyType && listing.propertyType !== input.propertyType) return false;
    if (input.bhk) {
      if (input.bhk === "5+ BHK") {
        if ((listing.bhk || 0) < 5) return false;
      } else if (listing.bhk !== Number(input.bhk.split(" ")[0])) {
        return false;
      }
    }
    if (input.minPrice && listing.price < input.minPrice) return false;
    if (input.maxPrice && listing.price > input.maxPrice) return false;
    if (input.minArea && listing.area < input.minArea) return false;
    if (input.furnishing && listing.furnishing !== input.furnishing) return false;
    if (input.possession && listing.possessionStatus !== input.possession) return false;
    if (input.postedBy && listing.ownerType !== input.postedBy) return false;
    if (input.verified && !listing.verified) return false;
    if (input.featured && !listing.featured) return false;
    if (input.amenity && !listing.amenities.includes(input.amenity)) return false;
    if (query) {
      const locality = getLocality(listing.localitySlug)?.displayName || "";
      const haystack = [
        listing.title,
        listing.description,
        listing.city,
        locality,
        listing.propertyType,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return listing.status === "active";
  });

  switch (input.sort) {
    case "featured":
      return filtered.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price,
      );
    case "newest":
      return filtered.sort(
        (a, b) => new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime(),
      );
    case "priceAsc":
      return filtered.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return filtered.sort((a, b) => b.price - a.price);
    default:
      return filtered.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(b.verified) - Number(a.verified) ||
          new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime(),
      );
  }
}

export function getFeaturedListings() {
  return listings.filter((listing) => listing.featured).slice(0, 4);
}

export function getCommercialListings() {
  return listings.filter((listing) => listing.assetClass === "commercial");
}

export function getSimilarListings(listing: Listing) {
  return listings
    .filter(
      (candidate) =>
        candidate.id !== listing.id &&
        candidate.city === listing.city &&
        candidate.assetClass === listing.assetClass,
    )
    .slice(0, 3);
}

export function getPortalMetrics() {
  return {
    activeListings: listings.filter((listing) => listing.status === "active").length,
    verifiedExperts: profiles.filter((profile) => profile.verificationStatus === "verified")
      .length,
    projects: projects.length,
    cities: new Set(localities.map((locality) => locality.city)).size,
  };
}

export function buildCanonical(pathname: string) {
  return `${portalEnv.appUrl}${pathname}`;
}

export function getPortalSnapshot() {
  return {
    profiles,
    localities,
    projects,
    listings,
    inquiries,
    savedSearches,
  };
}
