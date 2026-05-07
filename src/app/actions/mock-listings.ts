"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { listings as mockListings } from "@/lib/portal";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("Admin access required.");
  return session;
}

// Since mock listings live in TypeScript source, we can't mutate them at runtime
// without a database. We surface a clear message and guide the user to the DB flow.
// For a full implementation, these would write to the DB and the homepage would
// read from DB with a fallback to mock data.

export async function saveMockListingAction(data: {
  id: string;
  title: string;
  description: string;
  city: string;
  localitySlug: string;
  address: string;
  price: number;
  priceUnit: string;
  area: number;
  bhk: number | null;
  bathrooms: number;
  propertyType: string;
  listingType: string;
  assetClass: string;
  furnishing: string;
  possessionStatus: string;
  featured: boolean;
  verified: boolean;
  status: string;
  images: string[];
  mode: "new" | "edit";
}): Promise<{ ok: boolean; message?: string }> {
  await requireAdmin();

  try {
    // Dynamically import the DB to avoid build-time issues
    const { default: sql } = await import("@/lib/db");

    if (data.mode === "new") {
      await sql`
        INSERT INTO listings (
          user_id, title, description, listing_type, asset_class, property_type,
          city, locality, address, price, price_unit, area, bhk, bathrooms,
          furnishing, possession, images, status, featured, verified
        ) VALUES (
          1,
          ${data.title},
          ${data.description},
          ${data.listingType},
          ${data.assetClass},
          ${data.propertyType},
          ${data.city},
          ${data.localitySlug},
          ${data.address},
          ${data.price},
          ${data.priceUnit},
          ${data.area},
          ${data.bhk},
          ${data.bathrooms},
          ${data.furnishing},
          ${data.possessionStatus},
          ${data.images},
          ${data.status},
          ${data.featured},
          ${data.verified}
        )
      `;
    } else {
      // For mock listings (string IDs like "listing-ahm-1"), update in mock-data
      // For DB listings (numeric IDs), update in DB
      const numericId = parseInt(data.id, 10);
      if (!isNaN(numericId)) {
        await sql`
          UPDATE listings SET
            title = ${data.title},
            description = ${data.description},
            listing_type = ${data.listingType},
            asset_class = ${data.assetClass},
            property_type = ${data.propertyType},
            city = ${data.city},
            locality = ${data.localitySlug},
            address = ${data.address},
            price = ${data.price},
            price_unit = ${data.priceUnit},
            area = ${data.area},
            bhk = ${data.bhk},
            bathrooms = ${data.bathrooms},
            furnishing = ${data.furnishing},
            possession = ${data.possessionStatus},
            images = ${data.images},
            status = ${data.status},
            featured = ${data.featured},
            verified = ${data.verified},
            updated_at = NOW()
          WHERE id = ${numericId}
        `;
      } else {
        // Mock listing — insert as new DB record so it persists
        await sql`
          INSERT INTO listings (
            user_id, title, description, listing_type, asset_class, property_type,
            city, locality, address, price, price_unit, area, bhk, bathrooms,
            furnishing, possession, images, status, featured, verified
          ) VALUES (
            1,
            ${data.title},
            ${data.description},
            ${data.listingType},
            ${data.assetClass},
            ${data.propertyType},
            ${data.city},
            ${data.localitySlug},
            ${data.address},
            ${data.price},
            ${data.priceUnit},
            ${data.area},
            ${data.bhk},
            ${data.bathrooms},
            ${data.furnishing},
            ${data.possessionStatus},
            ${data.images},
            ${data.status},
            ${data.featured},
            ${data.verified}
          )
        `;
      }
    }

    revalidatePath("/admin/mock-listings");
    revalidatePath("/");
    return { ok: true };
  } catch (err: any) {
    console.error("saveMockListingAction error:", err);
    return { ok: false, message: err?.message ?? "Failed to save listing." };
  }
}

export async function deleteMockListingAction(id: string): Promise<{ ok: boolean; message?: string }> {
  await requireAdmin();

  try {
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      const { default: sql } = await import("@/lib/db");
      await sql`DELETE FROM listings WHERE id = ${numericId}`;
      revalidatePath("/admin/mock-listings");
      revalidatePath("/");
      return { ok: true };
    }
    // Mock listing with string ID — can't delete from source at runtime
    return { ok: false, message: "This is a built-in listing. To remove it, set its status to 'archived' instead." };
  } catch (err: any) {
    return { ok: false, message: err?.message ?? "Delete failed." };
  }
}
