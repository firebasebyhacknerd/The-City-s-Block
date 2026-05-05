"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function createListingAction(formData: {
  title: string;
  description: string;
  listing_type: string;
  asset_class: string;
  property_type: string;
  city: string;
  locality: string;
  address: string;
  price: string;
  price_unit: string;
  area: string;
  bhk: string;
  bathrooms: string;
  furnishing: string;
  possession: string;
  amenities: string[];
  images: string[];
}) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Please sign in to post a listing." };
  if (!["owner", "agent", "admin"].includes(session.role)) {
    return { ok: false, message: "Only owners and agents can post listings." };
  }
  if (!formData.title || !formData.city || !formData.price) {
    return { ok: false, message: "Title, city and price are required." };
  }

  await sql`
    INSERT INTO listings (
      user_id, title, description, listing_type, asset_class, property_type,
      city, locality, address, price, price_unit, area, bhk, bathrooms,
      furnishing, possession, amenities, images, status
    ) VALUES (
      ${session.id}, ${formData.title}, ${formData.description},
      ${formData.listing_type}, ${formData.asset_class}, ${formData.property_type},
      ${formData.city}, ${formData.locality}, ${formData.address},
      ${Number(formData.price)}, ${formData.price_unit},
      ${formData.area ? Number(formData.area) : null},
      ${formData.bhk ? Number(formData.bhk) : null},
      ${formData.bathrooms ? Number(formData.bathrooms) : null},
      ${formData.furnishing}, ${formData.possession},
      ${formData.amenities}, ${formData.images},
      'pending'
    )
  `;

  revalidatePath("/dashboard/listings");
  return { ok: true, message: "Listing submitted for review. It will go live once approved by admin." };
}

export async function getMyListingsAction() {
  const session = await getSession();
  if (!session) return [];
  const rows = await sql`
    SELECT * FROM listings WHERE user_id = ${session.id} ORDER BY created_at DESC
  `;
  return rows;
}

export async function deleteMyListingAction(id: number) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Not authenticated." };
  await sql`DELETE FROM listings WHERE id = ${id} AND user_id = ${session.id}`;
  revalidatePath("/dashboard/listings");
  return { ok: true };
}

export async function getMyListingByIdAction(id: number) {
  const session = await getSession();
  if (!session) return null;
  const rows = await sql`SELECT * FROM listings WHERE id=${id} AND user_id=${session.id} LIMIT 1`;
  return rows[0] || null;
}

export async function updateMyListingAction(
  id: number,
  formData: {
    title: string;
    description: string;
    listing_type: string;
    asset_class: string;
    property_type: string;
    city: string;
    locality: string;
    address: string;
    price: string;
    price_unit: string;
    area: string;
    bhk: string;
    bathrooms: string;
    furnishing: string;
    possession: string;
    amenities: string[];
    images: string[];
  }
) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Please sign in." };
  if (!formData.title || !formData.city || !formData.price) {
    return { ok: false, message: "Title, city and price are required." };
  }

  const result = await sql`
    UPDATE listings SET
      title = ${formData.title},
      description = ${formData.description},
      listing_type = ${formData.listing_type},
      asset_class = ${formData.asset_class},
      property_type = ${formData.property_type},
      city = ${formData.city},
      locality = ${formData.locality},
      address = ${formData.address},
      price = ${Number(formData.price)},
      price_unit = ${formData.price_unit},
      area = ${formData.area ? Number(formData.area) : null},
      bhk = ${formData.bhk ? Number(formData.bhk) : null},
      bathrooms = ${formData.bathrooms ? Number(formData.bathrooms) : null},
      furnishing = ${formData.furnishing},
      possession = ${formData.possession},
      amenities = ${formData.amenities},
      images = ${formData.images},
      status = 'pending'
    WHERE id = ${id} AND user_id = ${session.id}
  `;

  revalidatePath("/dashboard/listings");
  return { ok: true, message: "Listing updated. It will go live again after admin approval." };
}

export async function getPublicListingsAction(filters?: {
  city?: string;
  listing_type?: string;
  asset_class?: string;
  property_type?: string;
  bhk?: string;
  q?: string;
}) {
  let rows;
  if (filters?.q) {
    const q = `%${filters.q}%`;
    rows = await sql`
      SELECT l.*, u.name as owner_name, u.phone as owner_phone
      FROM listings l
      JOIN users u ON u.id = l.user_id
      WHERE l.status = 'active'
        AND (l.title ILIKE ${q} OR l.city ILIKE ${q} OR l.locality ILIKE ${q} OR l.address ILIKE ${q})
      ORDER BY l.featured DESC, l.created_at DESC
    `;
  } else {
    rows = await sql`
      SELECT l.*, u.name as owner_name, u.phone as owner_phone
      FROM listings l
      JOIN users u ON u.id = l.user_id
      WHERE l.status = 'active'
        AND (${filters?.city ?? null}::text IS NULL OR l.city = ${filters?.city ?? null})
        AND (${filters?.listing_type ?? null}::text IS NULL OR l.listing_type = ${filters?.listing_type ?? null})
        AND (${filters?.asset_class ?? null}::text IS NULL OR l.asset_class = ${filters?.asset_class ?? null})
        AND (${filters?.property_type ?? null}::text IS NULL OR l.property_type = ${filters?.property_type ?? null})
      ORDER BY l.featured DESC, l.created_at DESC
    `;
  }
  return rows;
}

export async function getListingByIdAction(id: number) {
  const rows = await sql`
    SELECT l.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email
    FROM listings l
    JOIN users u ON u.id = l.user_id
    WHERE l.id = ${id}
  `;
  return rows[0] || null;
}

export async function submitInquiryAction(formData: {
  listing_id: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  message: string;
}) {
  if (!formData.buyer_name || !formData.buyer_email || !formData.buyer_phone) {
    return { ok: false, message: "Name, email and phone are required." };
  }
  await sql`
    INSERT INTO inquiries (listing_id, buyer_name, buyer_email, buyer_phone, message)
    VALUES (${formData.listing_id}, ${formData.buyer_name}, ${formData.buyer_email}, ${formData.buyer_phone}, ${formData.message})
  `;
  return { ok: true, message: "Your inquiry has been sent. The owner will contact you shortly." };
}

export async function getMyInquiriesAction() {
  const session = await getSession();
  if (!session) return [];
  const rows = await sql`
    SELECT i.*, l.title as listing_title, l.city as listing_city
    FROM inquiries i
    JOIN listings l ON l.id = i.listing_id
    WHERE l.user_id = ${session.id}
    ORDER BY i.created_at DESC
  `;
  return rows;
}

export async function toggleFavoriteAction(listingId: number) {
  const session = await getSession();
  if (!session) return { ok: false, saved: false, message: "Sign in to save listings." };
  const existing = await sql`SELECT id FROM favorites WHERE user_id=${session.id} AND listing_id=${listingId}`;
  if (existing.length > 0) {
    await sql`DELETE FROM favorites WHERE user_id=${session.id} AND listing_id=${listingId}`;
    return { ok: true, saved: false };
  } else {
    await sql`INSERT INTO favorites (user_id, listing_id) VALUES (${session.id}, ${listingId}) ON CONFLICT DO NOTHING`;
    return { ok: true, saved: true };
  }
}

export async function getMyFavoritesAction() {
  const session = await getSession();
  if (!session) return [];
  const rows = await sql`
    SELECT l.* FROM listings l
    JOIN favorites f ON f.listing_id = l.id
    WHERE f.user_id = ${session.id} AND l.status = 'active'
    ORDER BY f.created_at DESC
  `;
  return rows;
}

export async function updateInquiryStatusAction(id: number, status: string) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Not authenticated." };
  // Only allow if inquiry belongs to a listing owned by session user
  const rows = await sql`
    SELECT i.id FROM inquiries i
    JOIN listings l ON l.id = i.listing_id
    WHERE i.id = ${id} AND l.user_id = ${session.id}
  `;
  if (rows.length === 0) return { ok: false, message: "Not authorized." };
  await sql`UPDATE inquiries SET status = ${status} WHERE id = ${id}`;
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

export async function getHomepageListingsAction(): Promise<{
  featured: any[];
  commercial: any[];
  stats: { activeListings: number; cities: number };
}> {
  const [featuredRows, commercialRows, statsRows] = await Promise.all([
    sql`
      SELECT * FROM listings
      WHERE status = 'active' AND featured = true
      ORDER BY created_at DESC
      LIMIT 4
    `,
    sql`
      SELECT * FROM listings
      WHERE status = 'active' AND asset_class = 'commercial'
      ORDER BY created_at DESC
      LIMIT 2
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'active') AS "activeListings",
        COUNT(DISTINCT city) FILTER (WHERE status = 'active') AS "cities"
      FROM listings
    `,
  ]);

  const statsRow = statsRows[0] ?? { activeListings: 0, cities: 0 };

  return {
    featured: featuredRows as any[],
    commercial: commercialRows as any[],
    stats: {
      activeListings: Number(statsRow.activeListings ?? 0),
      cities: Number(statsRow.cities ?? 0),
    },
  };
}
