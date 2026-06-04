/** Shared search query keys — use everywhere (hero, search page, SEO links). */

export const SEARCH_CITIES = ["Ahmedabad", "Gandhinagar"] as const;

export const SEARCH_PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Builder Floor",
  "Plot",
  "Office Space",
  "Retail Shop",
  "Warehouse",
] as const;

export const SEARCH_BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"] as const;

export const SEARCH_BUDGET_OPTIONS = [
  { label: "Under ₹50 Lac", value: "0-5000000" },
  { label: "₹50 Lac – ₹1 Cr", value: "5000000-10000000" },
  { label: "₹1 Cr – ₹2 Cr", value: "10000000-20000000" },
  { label: "₹2 Cr – ₹5 Cr", value: "20000000-50000000" },
  { label: "Above ₹5 Cr", value: "50000000-999999999" },
] as const;

export const SEARCH_RENT_BUDGET_OPTIONS = [
  { label: "Under ₹10,000/mo", value: "0-10000" },
  { label: "₹10k – ₹25k/mo", value: "10000-25000" },
  { label: "₹25k – ₹50k/mo", value: "25000-50000" },
  { label: "₹50k – ₹1 Lac/mo", value: "50000-100000" },
  { label: "Above ₹1 Lac/mo", value: "100000-9999999" },
] as const;

export const SEARCH_POSSESSION = ["Ready to Move", "Under Construction", "New Launch"] as const;

export const SEARCH_SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Price: High to Low", value: "priceDesc" },
] as const;

export type SearchSort = (typeof SEARCH_SORT_OPTIONS)[number]["value"];

export interface SearchFiltersInput {
  q?: string;
  city?: string;
  listing_type?: string;
  asset_class?: string;
  property_type?: string;
  bhk?: string;
  furnishing?: string;
  possession?: string;
  locality?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  featured?: string | boolean;
  sort?: string;
}

export function parseBhkNumber(bhk?: string): number | null {
  if (!bhk) return null;
  const match = bhk.match(/(\d+)/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isNaN(n) ? null : n;
}

export function readSearchParam(
  sp: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const v = sp[key];
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export function parseSearchFilters(
  sp: Record<string, string | string[] | undefined>,
): SearchFiltersInput & { minPriceNum?: number; maxPriceNum?: number; bhkNum?: number | null } {
  const q = readSearchParam(sp, "q");
  const city = readSearchParam(sp, "city");
  const listing_type = readSearchParam(sp, "listing_type");
  const asset_class = readSearchParam(sp, "asset_class");
  const property_type =
    readSearchParam(sp, "property_type") || readSearchParam(sp, "propertyType");
  const bhk = readSearchParam(sp, "bhk");
  const furnishing = readSearchParam(sp, "furnishing");
  const possession = readSearchParam(sp, "possession");
  const locality = readSearchParam(sp, "locality");
  const sort = readSearchParam(sp, "sort") || "relevance";
  const featured = readSearchParam(sp, "featured") === "true";

  const minRaw = readSearchParam(sp, "minPrice");
  const maxRaw = readSearchParam(sp, "maxPrice");
  const minPriceNum = minRaw ? Number(minRaw) : undefined;
  const maxPriceNum = maxRaw ? Number(maxRaw) : undefined;

  const postedBy = readSearchParam(sp, "postedBy");

  return {
    q,
    city,
    listing_type,
    asset_class,
    property_type,
    bhk,
    furnishing,
    possession,
    locality,
    featured: featured || undefined,
    sort,
    postedBy: postedBy || undefined,
    minPriceNum: minPriceNum && !Number.isNaN(minPriceNum) ? minPriceNum : undefined,
    maxPriceNum: maxPriceNum && !Number.isNaN(maxPriceNum) ? maxPriceNum : undefined,
    bhkNum: parseBhkNumber(bhk),
  };
}

export function buildSearchQueryString(filters: SearchFiltersInput): string {
  const params = new URLSearchParams();
  const set = (key: string, value?: string | number | boolean) => {
    if (value === undefined || value === "" || value === false) return;
    params.set(key, String(value));
  };

  set("q", filters.q);
  set("city", filters.city);
  set("listing_type", filters.listing_type);
  set("asset_class", filters.asset_class);
  set("property_type", filters.property_type);
  set("bhk", filters.bhk);
  set("furnishing", filters.furnishing);
  set("possession", filters.possession);
  set("locality", filters.locality);
  set("minPrice", filters.minPrice);
  set("maxPrice", filters.maxPrice);
  if (filters.featured === true || filters.featured === "true") set("featured", "true");
  set("sort", filters.sort && filters.sort !== "relevance" ? filters.sort : undefined);

  return params.toString();
}

export const POPULAR_LOCALITIES = [
  { name: "Bodakdev", city: "Ahmedabad", slug: "bodakdev" },
  { name: "Ashram Road", city: "Ahmedabad", slug: "ashram-road" },
  { name: "Vastrapur", city: "Ahmedabad", slug: "vastrapur" },
  { name: "Science City", city: "Ahmedabad", slug: "science-city" },
  { name: "GIFT City", city: "Gandhinagar", slug: "gift-city" },
] as const;
