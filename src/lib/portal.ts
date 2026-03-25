import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  resendKey: process.env.RESEND_API_KEY || "",
  resendFrom: process.env.RESEND_FROM || "",
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
  aiEnabled: Boolean(process.env.GOOGLE_API_KEY),
};

export const integrationStatus = {
  supabase: Boolean(portalEnv.supabaseUrl && portalEnv.supabaseAnonKey),
  resend: Boolean(portalEnv.resendKey && portalEnv.resendFrom),
  mapbox: Boolean(portalEnv.mapboxToken),
  ai: portalEnv.aiEnabled,
};

function createSupabaseClient(
  key: string,
): SupabaseClient | null {
  if (!portalEnv.supabaseUrl || !key) {
    return null;
  }

  return createClient(portalEnv.supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const getSupabasePublicClient = cache(() =>
  createSupabaseClient(portalEnv.supabaseAnonKey),
);
export const getSupabaseServiceClient = cache(() =>
  createSupabaseClient(portalEnv.supabaseServiceRoleKey),
);

export const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
export const propertyTypes: PropertyType[] = [
  "Apartment",
  "Builder Floor",
  "Villa",
  "Plot",
  "Office Space",
  "Retail Shop",
  "Warehouse",
];
export const amenityOptions = [
  "Clubhouse",
  "Power Backup",
  "Swimming Pool",
  "Gym",
  "EV Charging",
  "24x7 Security",
  "Metro Connectivity",
  "Visitor Parking",
  "Business Lounge",
  "Cafeteria",
  "Loading Bay",
  "Rainwater Harvesting",
];

export const profiles: Profile[] = [
  {
    id: "profile-agent-1",
    slug: "ananya-mehra",
    role: "agent",
    name: "Ananya Mehra",
    phone: "+91 98110 22110",
    email: "ananya@citysblock.in",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    city: "Gurugram",
    companyName: "Urban Acres Advisory",
    verificationStatus: "verified",
    bio: "Luxury residential specialist for NCR micro-markets with high-conversion site visit pipelines.",
  },
  {
    id: "profile-agent-2",
    slug: "rahul-kapoor",
    role: "agent",
    name: "Rahul Kapoor",
    phone: "+91 98990 77881",
    email: "rahul@citysblock.in",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    city: "Noida",
    companyName: "Capital Realty Network",
    verificationStatus: "verified",
    bio: "Investor-focused consultant covering Noida Expressway, data-led pricing, and resale velocity.",
  },
  {
    id: "profile-builder-1",
    slug: "altura-homes",
    role: "builder",
    name: "Altura Homes",
    phone: "+91 120 400 8800",
    email: "sales@alturahomes.in",
    avatar:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    city: "Bengaluru",
    companyName: "Altura Homes",
    verificationStatus: "verified",
    bio: "Mid-premium developer focused on transit-oriented communities across South India.",
  },
  {
    id: "profile-owner-1",
    slug: "meenal-arora",
    role: "owner",
    name: "Meenal Arora",
    phone: "+91 99713 55442",
    email: "meenal@example.com",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
    city: "Bengaluru",
    verificationStatus: "pending",
    bio: "Owner listing a small curated portfolio of premium apartments and managed rentals.",
  },
  {
    id: "profile-buyer-1",
    slug: "avi-malhotra",
    role: "buyer",
    name: "Avi Malhotra",
    phone: "+91 98201 70000",
    email: "avi@example.com",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    city: "Mumbai",
    verificationStatus: "verified",
    bio: "Actively exploring end-use and income-generating property in top-tier Indian markets.",
  },
  {
    id: "profile-admin-1",
    slug: "ops-team",
    role: "admin",
    name: "Ops Team",
    phone: "+91 11 4555 7788",
    email: "ops@citysblock.in",
    avatar:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    city: "New Delhi",
    companyName: "The City's Block",
    verificationStatus: "verified",
    bio: "Marketplace operations and listing moderation.",
  },
];

export const localities: Locality[] = [
  {
    id: "loc-gurugram-gcr",
    city: "Gurugram",
    slug: "golf-course-road",
    displayName: "Golf Course Road",
    overview:
      "Golf Course Road remains a premium NCR corridor with Grade A residences, direct rapid metro access, and sustained end-user demand.",
    avgPricePerSqft: 19500,
    rentalYield: "3.4%",
    coordinates: { lat: 28.4491, lng: 77.1008 },
    highlights: ["Rapid metro connectivity", "Luxury projects", "Corporate catchment"],
    landmarks: ["Sector 42-43 Metro", "DLF Cyber Hub", "Artemis Hospital"],
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "loc-noida-150",
    city: "Noida",
    slug: "sector-150",
    displayName: "Sector 150",
    overview:
      "Sector 150 is a low-density sports-city micro-market favored by upgraders seeking larger layouts and planned open space.",
    avgPricePerSqft: 11200,
    rentalYield: "2.8%",
    coordinates: { lat: 28.4088, lng: 77.4837 },
    highlights: ["Wide roads", "Sports infrastructure", "Expressway access"],
    landmarks: ["Noida-Greater Noida Expressway", "Shaheed Bhagat Singh Park", "Jewar corridor"],
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "loc-bengaluru-whitefield",
    city: "Bengaluru",
    slug: "whitefield",
    displayName: "Whitefield",
    overview:
      "Whitefield blends mature IT occupancy, metro-led connectivity, and a deep inventory pool across apartments, villas, and office space.",
    avgPricePerSqft: 9800,
    rentalYield: "3.9%",
    coordinates: { lat: 12.9698, lng: 77.75 },
    highlights: ["Tech employment hub", "Purple line metro", "Strong rental demand"],
    landmarks: ["ITPL", "Hopefarm", "Nexus Shantiniketan"],
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "loc-mumbai-bkc",
    city: "Mumbai",
    slug: "bkc",
    displayName: "Bandra Kurla Complex",
    overview:
      "BKC is Mumbai's institutional-grade commercial district with scarce supply, blue-chip occupiers, and premium mixed-use projects.",
    avgPricePerSqft: 32400,
    rentalYield: "5.1%",
    coordinates: { lat: 19.0669, lng: 72.8696 },
    highlights: ["Institutional occupiers", "Transit access", "Prime office inventory"],
    landmarks: ["Jio World Drive", "US Consulate", "MCA Club"],
    image:
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80",
  },
];

export const projects: Project[] = [
  {
    id: "project-azure-heights",
    slug: "azure-heights-residences",
    name: "Azure Heights Residences",
    builderId: "profile-builder-1",
    city: "Noida",
    localitySlug: "sector-150",
    coverImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
    ],
    minPrice: 12500000,
    maxPrice: 24500000,
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    possessionDate: "2028-03-01",
    status: "Under Construction",
    brochureUrl: "#",
    featured: true,
    summary:
      "Sports-centric premium development with club-grade amenities, larger balconies, and skyline-facing towers.",
    amenities: ["Olympic pool", "Sky lounge", "Pickleball court", "Retail arcade"],
  },
  {
    id: "project-sierra-court",
    slug: "sierra-court-signature",
    name: "Sierra Court Signature",
    builderId: "profile-builder-1",
    city: "Bengaluru",
    localitySlug: "whitefield",
    coverImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    ],
    minPrice: 9200000,
    maxPrice: 17800000,
    configurations: ["2 BHK", "3 BHK"],
    possessionDate: "2027-11-15",
    status: "New Launch",
    brochureUrl: "#",
    featured: true,
    summary:
      "Metro-adjacent apartment community positioned for tech corridor professionals and rental investors.",
    amenities: ["Business lounge", "Cricket net", "Creche", "Co-working pavilion"],
  },
  {
    id: "project-atrium-one",
    slug: "atrium-one-business-park",
    name: "Atrium One Business Park",
    builderId: "profile-builder-1",
    city: "Mumbai",
    localitySlug: "bkc",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    ],
    minPrice: 52000000,
    maxPrice: 145000000,
    configurations: ["800 sq.ft.", "1200 sq.ft.", "5000 sq.ft. floor plates"],
    possessionDate: "2026-12-30",
    status: "Ready to Move",
    brochureUrl: "#",
    featured: false,
    summary:
      "Institutional-ready commercial address with LEED-aligned design, concierge services, and flagship frontage.",
    amenities: ["Board rooms", "Smart access", "Valet parking", "Food court"],
  },
];

export const listings: Listing[] = [
  {
    id: "listing-1",
    slug: "4-bhk-apartment-golf-course-road-gurugram",
    listingType: "sale",
    assetClass: "residential",
    propertyType: "Apartment",
    title: "4 BHK luxury apartment with Aravalli-facing deck",
    description:
      "A verified premium residence with double-height arrival lobby, semi-private lift landing, modular kitchen, and clubhouse access minutes from corporate Gurugram.",
    city: "Gurugram",
    localitySlug: "golf-course-road",
    address: "Sector 54, Golf Course Road, Gurugram",
    coordinates: { lat: 28.4391, lng: 77.1017 },
    price: 58500000,
    priceUnit: "total",
    area: 3150,
    areaUnit: "sqft",
    bhk: 4,
    bathrooms: 5,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    ownerType: "agent",
    featured: true,
    verified: true,
    status: "active",
    tags: ["Verified", "Featured", "Corner unit"],
    amenities: ["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "EV Charging"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    ],
    profileId: "profile-agent-1",
    postedOn: "2026-03-11",
  },
  {
    id: "listing-2",
    slug: "3-bhk-investor-apartment-sector-150-noida",
    listingType: "sale",
    assetClass: "residential",
    propertyType: "Apartment",
    title: "3 BHK investor-grade apartment in sports city enclave",
    description:
      "Low-density tower inventory with golf-facing views, large utility space, and flexible payment plan in one of Noida's most searched upgrade markets.",
    city: "Noida",
    localitySlug: "sector-150",
    address: "Sector 150, Noida",
    coordinates: { lat: 28.4095, lng: 77.4841 },
    price: 22800000,
    priceUnit: "total",
    area: 2100,
    areaUnit: "sqft",
    bhk: 3,
    bathrooms: 3,
    furnishing: "Unfurnished",
    possessionStatus: "Under Construction",
    projectId: "project-azure-heights",
    ownerType: "agent",
    featured: true,
    verified: true,
    status: "active",
    tags: ["New phase", "Expressway access"],
    amenities: ["Power Backup", "Clubhouse", "Swimming Pool", "Visitor Parking"],
    images: [
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    ],
    profileId: "profile-agent-2",
    postedOn: "2026-03-18",
  },
  {
    id: "listing-3",
    slug: "2-bhk-rental-whitefield-bengaluru",
    listingType: "rent",
    assetClass: "residential",
    propertyType: "Apartment",
    title: "2 BHK furnished rental near Hopefarm metro",
    description:
      "Managed rental inventory with full furnishings, modular storage, and strong access to major tech parks and retail.",
    city: "Bengaluru",
    localitySlug: "whitefield",
    address: "Whitefield Main Road, Bengaluru",
    coordinates: { lat: 12.9712, lng: 77.7491 },
    price: 62000,
    priceUnit: "month",
    area: 1280,
    areaUnit: "sqft",
    bhk: 2,
    bathrooms: 2,
    furnishing: "Fully Furnished",
    possessionStatus: "Ready to Move",
    ownerType: "owner",
    featured: false,
    verified: true,
    status: "active",
    tags: ["Rental", "Metro access"],
    amenities: ["Gym", "24x7 Security", "Metro Connectivity", "Power Backup"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    ],
    profileId: "profile-owner-1",
    postedOn: "2026-03-19",
  },
  {
    id: "listing-4",
    slug: "grade-a-office-space-bkc-mumbai",
    listingType: "rent",
    assetClass: "commercial",
    propertyType: "Office Space",
    title: "Plug-and-play Grade A office suite in BKC",
    description:
      "Fully fitted commercial suite with reception, cabins, board room, and premium frontage in Mumbai's top institutional office district.",
    city: "Mumbai",
    localitySlug: "bkc",
    address: "Bandra Kurla Complex, Mumbai",
    coordinates: { lat: 19.0677, lng: 72.8701 },
    price: 640000,
    priceUnit: "month",
    area: 2800,
    areaUnit: "sqft",
    bhk: null,
    bathrooms: 2,
    furnishing: "Fully Furnished",
    possessionStatus: "Ready to Move",
    projectId: "project-atrium-one",
    ownerType: "builder",
    featured: true,
    verified: true,
    status: "active",
    tags: ["Commercial", "Ready office"],
    amenities: ["Business Lounge", "Visitor Parking", "24x7 Security", "Cafeteria"],
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    ],
    profileId: "profile-builder-1",
    postedOn: "2026-03-20",
  },
  {
    id: "listing-5",
    slug: "retail-shop-high-street-noida",
    listingType: "sale",
    assetClass: "commercial",
    propertyType: "Retail Shop",
    title: "High-street retail shop with assured frontage",
    description:
      "Corner retail investment product in a mixed-use district positioned for weekday office catchment and weekend family footfall.",
    city: "Noida",
    localitySlug: "sector-150",
    address: "High Street Plaza, Sector 150, Noida",
    coordinates: { lat: 28.4115, lng: 77.4828 },
    price: 18500000,
    priceUnit: "total",
    area: 620,
    areaUnit: "sqft",
    bhk: null,
    bathrooms: 1,
    furnishing: "Semi-Furnished",
    possessionStatus: "Under Construction",
    ownerType: "agent",
    featured: false,
    verified: true,
    status: "active",
    tags: ["Pre-leased potential", "Retail"],
    amenities: ["Visitor Parking", "Power Backup", "24x7 Security"],
    images: [
      "https://images.unsplash.com/photo-1517502166878-35c93a0072f0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1600&q=80",
    ],
    profileId: "profile-agent-2",
    postedOn: "2026-03-16",
  },
  {
    id: "listing-6",
    slug: "villa-community-whitefield-bengaluru",
    listingType: "sale",
    assetClass: "residential",
    propertyType: "Villa",
    title: "4 BHK villa in gated Whitefield community",
    description:
      "End-use villa product with private garden, skylit staircase, maid room, and easy connectivity to tech campuses and school clusters.",
    city: "Bengaluru",
    localitySlug: "whitefield",
    address: "Varthur Road, Whitefield, Bengaluru",
    coordinates: { lat: 12.9611, lng: 77.7471 },
    price: 47200000,
    priceUnit: "total",
    area: 3420,
    areaUnit: "sqft",
    bhk: 4,
    bathrooms: 4,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    ownerType: "owner",
    featured: true,
    verified: false,
    status: "active",
    tags: ["Villa", "Private garden"],
    amenities: ["Clubhouse", "Gym", "Swimming Pool", "24x7 Security"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    ],
    profileId: "profile-owner-1",
    postedOn: "2026-03-09",
  },
  {
    id: "listing-7",
    slug: "builder-floor-gurugram-golf-course-road",
    listingType: "rent",
    assetClass: "residential",
    propertyType: "Builder Floor",
    title: "3 BHK builder floor with private terrace",
    description:
      "Low-density independent floor product with terrace deck, lift, 2-car parking, and quick access to premium schools and metro.",
    city: "Gurugram",
    localitySlug: "golf-course-road",
    address: "DLF Phase 5, Gurugram",
    coordinates: { lat: 28.4462, lng: 77.1032 },
    price: 140000,
    priceUnit: "month",
    area: 2400,
    areaUnit: "sqft",
    bhk: 3,
    bathrooms: 3,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    ownerType: "agent",
    featured: false,
    verified: true,
    status: "active",
    tags: ["Family rental", "Terrace"],
    amenities: ["Power Backup", "24x7 Security", "Visitor Parking"],
    images: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80",
    ],
    profileId: "profile-agent-1",
    postedOn: "2026-03-22",
  },
  {
    id: "listing-8",
    slug: "warehouse-investment-whitefield-bengaluru",
    listingType: "sale",
    assetClass: "commercial",
    propertyType: "Warehouse",
    title: "Peripheral warehouse asset with long-term lease upside",
    description:
      "Clear-height warehouse shell suited to logistics, light assembly, or long-hold lease strategy near arterial East Bengaluru road links.",
    city: "Bengaluru",
    localitySlug: "whitefield",
    address: "Hoskote belt, Bengaluru East",
    coordinates: { lat: 13.0354, lng: 77.7858 },
    price: 76000000,
    priceUnit: "total",
    area: 12000,
    areaUnit: "sqft",
    bhk: null,
    bathrooms: 2,
    furnishing: "Unfurnished",
    possessionStatus: "Ready to Move",
    ownerType: "builder",
    featured: false,
    verified: true,
    status: "active",
    tags: ["Yield play", "Logistics"],
    amenities: ["Loading Bay", "24x7 Security", "Power Backup", "Rainwater Harvesting"],
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    ],
    profileId: "profile-builder-1",
    postedOn: "2026-03-13",
  },
];

export const inquiries: Inquiry[] = [
  {
    id: "inq-1",
    listingId: "listing-1",
    listingTitle: "4 BHK luxury apartment with Aravalli-facing deck",
    buyerName: "Avi Malhotra",
    buyerPhone: "+91 98201 70000",
    buyerEmail: "avi@example.com",
    message: "Need a weekend site visit and payment-plan breakup.",
    createdAt: "2026-03-23T11:00:00.000Z",
    channel: "form",
    status: "new",
  },
  {
    id: "inq-2",
    listingId: "listing-4",
    listingTitle: "Plug-and-play Grade A office suite in BKC",
    buyerName: "Richa Sood",
    buyerPhone: "+91 98188 09876",
    buyerEmail: "richa@startup.in",
    message: "Looking for 30 seats with immediate move-in.",
    createdAt: "2026-03-22T08:30:00.000Z",
    channel: "email",
    status: "contacted",
  },
];

export const savedSearches: SavedSearch[] = [
  {
    id: "saved-1",
    label: "Premium 3 BHK in Noida",
    city: "Noida",
    filters: { city: "Noida", bhk: "3 BHK", listingType: "sale" },
    resultCount: 14,
  },
  {
    id: "saved-2",
    label: "Commercial rentals in Mumbai",
    city: "Mumbai",
    filters: { city: "Mumbai", assetClass: "commercial", listingType: "rent" },
    resultCount: 6,
  },
];

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
