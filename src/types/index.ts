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
