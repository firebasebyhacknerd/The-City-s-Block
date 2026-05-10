"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth";
import { insertAdminNotification, insertUserNotification } from "@/app/actions/notifications";

const VALID_LISTING_TYPES = ["sale", "rent"];
const VALID_ASSET_CLASSES = ["residential", "commercial"];
const VALID_PROPERTY_TYPES = ["Apartment", "Builder Floor", "Villa", "Plot", "Office Space", "Retail Shop", "Warehouse"];
const VALID_FURNISHING = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const VALID_POSSESSION = ["Ready to Move", "Under Construction", "New Launch"];
const VALID_INQUIRY_STATUSES = ["new", "contacted", "closed"];
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_IMAGES = 20;

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

  const title = String(formData.title ?? "").trim();
  const city = String(formData.city ?? "").trim();
  const price = Number(formData.price);

  if (!title) return { ok: false, message: "Title is required." };
  if (!city) return { ok: false, message: "City is required." };
  if (!price || isNaN(price) || price <= 0) return { ok: false, message: "A valid price is required." };

  // Validate enums
  if (!VALID_LISTING_TYPES.includes(formData.listing_type)) return { ok: false, message: "Invalid listing type." };
  if (!VALID_ASSET_CLASSES.includes(formData.asset_class)) return { ok: false, message: "Invalid asset class." };
  if (!VALID_PROPERTY_TYPES.includes(formData.property_type)) return { ok: false, message: "Invalid property type." };

  const description = String(formData.description ?? "").slice(0, MAX_DESCRIPTION_LENGTH);
  // Limit images to prevent abuse
  const images = (Array.isArray(formData.images) ? formData.images : []).slice(0, MAX_IMAGES);
  const amenities = Array.isArray(formData.amenities) ? formData.amenities : [];

  const newListings = await sql`
    INSERT INTO listings (
      user_id, title, description, listing_type, asset_class, property_type,
      city, locality, address, price, price_unit, area, bhk, bathrooms,
      furnishing, possession, amenities, images, status
    ) VALUES (
      ${session.id}, ${title}, ${description},
      ${formData.listing_type}, ${formData.asset_class}, ${formData.property_type},
      ${city}, ${String(formData.locality ?? "").trim()}, ${String(formData.address ?? "").trim()},
      ${price}, ${formData.price_unit},
      ${formData.area ? Number(formData.area) : null},
      ${formData.bhk ? Number(formData.bhk) : null},
      ${formData.bathrooms ? Number(formData.bathrooms) : null},
      ${formData.furnishing}, ${formData.possession},
      ${amenities}, ${images},
      'pending'
    )
    RETURNING id
  `;

  const listingId = newListings[0]?.id ?? null;
  await insertAdminNotification(
    "listing_pending",
    `New listing pending approval: "${title}" in ${city}`,
    listingId,
    "listing"
  );

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
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  await sql`DELETE FROM listings WHERE id = ${id} AND user_id = ${session.id}`;
  revalidatePath("/dashboard/listings");
  return { ok: true };
}

export async function getMyListingByIdAction(id: number) {
  const session = await getSession();
  if (!session) return null;
  if (!Number.isInteger(id) || id <= 0) return null;
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
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };

  const title = String(formData.title ?? "").trim();
  const city = String(formData.city ?? "").trim();
  const price = Number(formData.price);

  if (!title) return { ok: false, message: "Title is required." };
  if (!city) return { ok: false, message: "City is required." };
  if (!price || isNaN(price) || price <= 0) return { ok: false, message: "A valid price is required." };

  const description = String(formData.description ?? "").slice(0, MAX_DESCRIPTION_LENGTH);
  const images = (Array.isArray(formData.images) ? formData.images : []).slice(0, MAX_IMAGES);
  const amenities = Array.isArray(formData.amenities) ? formData.amenities : [];

  await sql`
    UPDATE listings SET
      title = ${title},
      description = ${description},
      listing_type = ${formData.listing_type},
      asset_class = ${formData.asset_class},
      property_type = ${formData.property_type},
      city = ${city},
      locality = ${String(formData.locality ?? "").trim()},
      address = ${String(formData.address ?? "").trim()},
      price = ${price},
      price_unit = ${formData.price_unit},
      area = ${formData.area ? Number(formData.area) : null},
      bhk = ${formData.bhk ? Number(formData.bhk) : null},
      bathrooms = ${formData.bathrooms ? Number(formData.bathrooms) : null},
      furnishing = ${formData.furnishing},
      possession = ${formData.possession},
      amenities = ${amenities},
      images = ${images},
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
  // Never return owner phone — removed from SELECT
  let rows;
  if (filters?.q) {
    const q = `%${filters.q}%`;
    rows = await sql`
      SELECT l.*, u.name as owner_name
      FROM listings l
      JOIN users u ON u.id = l.user_id
      WHERE l.status = 'active'
        AND (l.title ILIKE ${q} OR l.city ILIKE ${q} OR l.locality ILIKE ${q} OR l.address ILIKE ${q})
      ORDER BY l.featured DESC, l.created_at DESC
    `;
  } else {
    rows = await sql`
      SELECT l.*, u.name as owner_name
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

export async function getListingByIdAction(idOrSlug: string | number) {
  const session = await getSession();
  const isNumeric = !isNaN(Number(idOrSlug));

  let query;
  if (session) {
    query = sql`
      SELECT l.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email
      FROM listings l
      JOIN users u ON u.id = l.user_id
      WHERE ${isNumeric ? sql`l.id = ${Number(idOrSlug)}` : sql`l.slug = ${idOrSlug}`}
    `;
  } else {
    query = sql`
      SELECT l.*, u.name as owner_name
      FROM listings l
      JOIN users u ON u.id = l.user_id
      WHERE ${isNumeric ? sql`l.id = ${Number(idOrSlug)}` : sql`l.slug = ${idOrSlug}`}
    `;
  }

  const rows = await query;
  return rows[0] || null;
}

export async function submitInquiryAction(formData: {
  listing_id: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  message: string;
}) {
  const name = String(formData.buyer_name ?? "").trim();
  const email = String(formData.buyer_email ?? "").trim().toLowerCase();
  const phone = String(formData.buyer_phone ?? "").trim();

  if (!name || !email || !phone) {
    return { ok: false, message: "Name, email and phone are required." };
  }
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (!Number.isInteger(formData.listing_id) || formData.listing_id <= 0) {
    return { ok: false, message: "Invalid listing." };
  }

  const message = String(formData.message ?? "").slice(0, 2000);

  await sql`
    INSERT INTO inquiries (listing_id, buyer_name, buyer_email, buyer_phone, message)
    VALUES (${formData.listing_id}, ${name}, ${email}, ${phone}, ${message})
  `;

  // Notify the listing owner (non-critical)
  const listingRows = await sql`SELECT user_id, title FROM listings WHERE id = ${formData.listing_id} LIMIT 1`;
  if (listingRows[0]) {
    await insertUserNotification(
      listingRows[0].user_id,
      "inquiry_received",
      `New inquiry on your listing: "${listingRows[0].title}"`,
      formData.listing_id,
      "inquiry"
    );
  }

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
  if (!Number.isInteger(listingId) || listingId <= 0) return { ok: false, saved: false, message: "Invalid listing." };

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
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Invalid ID." };
  // Validate status against allowed values
  if (!VALID_INQUIRY_STATUSES.includes(status)) {
    return { ok: false, message: "Invalid status." };
  }
  // Ownership check — single query that verifies ownership AND updates atomically
  const result = await sql`
    UPDATE inquiries SET status = ${status}
    WHERE id = ${id}
      AND listing_id IN (
        SELECT id FROM listings WHERE user_id = ${session.id}
      )
    RETURNING id
  `;
  if (result.length === 0) return { ok: false, message: "Not authorized." };

  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/pipeline");
  return { ok: true };
}

export async function getHomepageListingsAction(): Promise<{
  featured: any[];
  commercial: any[];
  bungalows: any[];
  stats: { activeListings: number; cities: number };
}> {
  const [featuredRows, commercialRows, bungalowRows, statsRows] = await Promise.all([
    sql`
      SELECT * FROM listings
      WHERE status = 'active' AND featured = true
      ORDER BY created_at DESC
      LIMIT 4
    `,
    sql`
      SELECT * FROM listings
      WHERE status = 'active' AND property_type = 'Office Space'
      ORDER BY created_at DESC
      LIMIT 8
    `,
    sql`
      SELECT * FROM listings
      WHERE status = 'active' AND property_type = 'Villa'
      ORDER BY created_at DESC
      LIMIT 4
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
    bungalows: bungalowRows as any[],
    stats: {
      activeListings: Number(statsRow.activeListings ?? 0),
      cities: Number(statsRow.cities ?? 0),
    },
  };
}

export async function getProjectsAction() {
  const rows = await sql`
    SELECT * FROM projects
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function getProjectBySlugAction(slug: string) {
  const rows = await sql`
    SELECT * FROM projects
    WHERE slug = ${slug}
  `;
  return rows[0] || null;
}

export async function getListingsByLocalityAction(localitySlug: string) {
  const rows = await sql`
    SELECT l.*, u.name as owner_name
    FROM listings l
    JOIN users u ON u.id = l.user_id
    WHERE l.status = 'active' AND l.locality = ${localitySlug}
    ORDER BY l.featured DESC, l.created_at DESC
  `;
  return rows;
}

export async function getBrokerStatsAction() {
  const session = await getSession();
  if (!session) return null;
  if (!["agent", "owner", "admin"].includes(session.role)) return null;

  try {
    const [activeRows, pendingRows, totalInqRows, newInqRows, listingInqRows] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM listings WHERE user_id = ${session.id} AND status = 'active'`,
      sql`SELECT COUNT(*) as count FROM listings WHERE user_id = ${session.id} AND status = 'pending'`,
      sql`
        SELECT COUNT(*) as count FROM inquiries i
        JOIN listings l ON l.id = i.listing_id
        WHERE l.user_id = ${session.id}
      `,
      sql`
        SELECT COUNT(*) as count FROM inquiries i
        JOIN listings l ON l.id = i.listing_id
        WHERE l.user_id = ${session.id}
          AND i.status = 'new'
          AND i.created_at >= NOW() - INTERVAL '30 days'
      `,
      sql`
        SELECT l.id, l.title, l.status, COUNT(i.id)::int as inquiry_count
        FROM listings l
        LEFT JOIN inquiries i ON i.listing_id = l.id
        WHERE l.user_id = ${session.id}
        GROUP BY l.id, l.title, l.status
        ORDER BY l.created_at DESC
      `,
    ]);

    return {
      activeListings: Number(activeRows[0]?.count ?? 0),
      pendingListings: Number(pendingRows[0]?.count ?? 0),
      totalInquiries: Number(totalInqRows[0]?.count ?? 0),
      newInquiriesLast30Days: Number(newInqRows[0]?.count ?? 0),
      listingsWithInquiryCounts: listingInqRows as Array<{
        id: number;
        title: string;
        status: string;
        inquiry_count: number;
      }>,
    };
  } catch {
    return null;
  }
}

export async function getBuyerInquiriesAction() {
  const session = await getSession();
  if (!session) return [];
  // Query by both email AND user_id for robustness
  const rows = await sql`
    SELECT i.id, i.message, i.status, i.created_at,
           l.title as listing_title, l.id as listing_id
    FROM inquiries i
    JOIN listings l ON l.id = i.listing_id
    WHERE i.buyer_email = ${session.email}
    ORDER BY i.created_at DESC
  `;
  return rows;
}

export async function getCustomerStatsAction() {
  const session = await getSession();
  if (!session) return { savedListings: 0, inquiries: 0, savedSearches: 0 };

  try {
    const [favRows, inqRows, ssRows] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM favorites WHERE user_id = ${session.id}`,
      sql`SELECT COUNT(*) as count FROM inquiries WHERE buyer_email = ${session.email}`,
      sql`SELECT COUNT(*) as count FROM saved_searches WHERE user_id = ${session.id}`,
    ]);

    return {
      savedListings: Number(favRows[0]?.count ?? 0),
      inquiries: Number(inqRows[0]?.count ?? 0),
      savedSearches: Number(ssRows[0]?.count ?? 0),
    };
  } catch {
    return { savedListings: 0, inquiries: 0, savedSearches: 0 };
  }
}
