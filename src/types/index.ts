// ─── Database Row Types ───────────────────────────────────────────────────────

/** Raw row returned from the NeonDB `listings` table */
export interface DbListing {
  id: number;
  title: string;
  city: string;
  locality: string | null;
  price: number | string;
  price_unit: "total" | "month" | string;
  area: number | string | null;
  bhk: string | null;
  bathrooms: number | null;
  property_type: string;
  listing_type: "sale" | "rent" | string;
  asset_class: string | null;
  furnishing: string | null;
  possession: string | null;
  verified: boolean;
  images: string[];
  description: string | null;
  address: string | null;
  slug: string | null;
  status: "pending" | "active" | "rejected" | string;
  created_at: string;
  updated_at: string | null;
  user_id: number | null;
  /** True when the record came from the static mock portal data */
  isMock?: boolean;
}

// ─── Notification & Saved Search Types ────────────────────────────────────────

export type NotificationType = "listing_pending" | "user_registered" | "inquiry_received";
export type ReferenceType = "listing" | "user" | "inquiry";

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  message: string;
  reference_id: number | null;
  reference_type: ReferenceType | null;
  read: boolean;
  created_at: string;
}

export interface SavedSearch {
  id: number;
  user_id: number;
  label: string;
  filters: Record<string, string>;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  developer: string | null;
  city: string;
  locality: string | null;
  description: string | null;
  status: "draft" | "published";
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
