"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { SavedSearch } from "@/types";

// Whitelist of allowed filter keys — prevents storing arbitrary data
const ALLOWED_FILTER_KEYS = ["q", "city", "listing_type", "asset_class", "property_type", "bhk", "furnishing", "possession", "locality", "minPrice", "maxPrice"] as const;
const MAX_FILTER_VALUE_LENGTH = 200;
const MAX_LABEL_LENGTH = 200;

function sanitizeFilters(raw: Record<string, string>): Record<string, string> {
  const clean: Record<string, string> = {};
  for (const key of ALLOWED_FILTER_KEYS) {
    if (raw[key] && typeof raw[key] === "string") {
      clean[key] = String(raw[key]).slice(0, MAX_FILTER_VALUE_LENGTH).trim();
    }
  }
  return clean;
}

function generateLabel(filters: Record<string, string>): string {
  const parts: string[] = [];
  if (filters.bhk) parts.push(`${filters.bhk} BHK`);
  if (filters.listing_type) parts.push(filters.listing_type === "sale" ? "Sale" : "Rent");
  if (filters.property_type) parts.push(filters.property_type);
  if (filters.city) parts.push(`in ${filters.city}`);
  if (filters.q) parts.push(`"${filters.q.slice(0, 50)}"`);
  return parts.length > 0 ? parts.join(" ") : "Saved Search";
}

export async function saveSearchAction(
  filters: Record<string, string>,
  label?: string
): Promise<{ ok: boolean; message: string }> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Sign in to save searches." };

  const sanitized = sanitizeFilters(filters);
  if (Object.keys(sanitized).length === 0) {
    return { ok: false, message: "No filters to save." };
  }

  const finalLabel = (label?.trim().slice(0, MAX_LABEL_LENGTH)) || generateLabel(sanitized);

  await sql`
    INSERT INTO saved_searches (user_id, label, filters)
    VALUES (${session.id}, ${finalLabel}, ${JSON.stringify(sanitized)})
  `;

  revalidatePath("/dashboard/saved-searches");
  return { ok: true, message: "Search saved." };
}

export async function getMySavedSearchesAction(): Promise<SavedSearch[]> {
  const session = await getSession();
  if (!session) return [];
  const rows = await sql`
    SELECT * FROM saved_searches
    WHERE user_id = ${session.id}
    ORDER BY created_at DESC
  `;
  return rows as SavedSearch[];
}

export async function deleteSavedSearchAction(id: number): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  if (!Number.isInteger(id) || id <= 0) return { ok: false };
  await sql`
    DELETE FROM saved_searches WHERE id = ${id} AND user_id = ${session.id}
  `;
  revalidatePath("/dashboard/saved-searches");
  return { ok: true };
}
