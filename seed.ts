import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { profiles, listings, projects } from "./src/lib/mock-data";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // 1. Clear existing data
    console.log("🧹 Clearing existing data...");
    await sql`TRUNCATE TABLE inquiries, favorites, notifications, saved_searches, listings, projects, users RESTART IDENTITY CASCADE`;

    // 2. Hash a default password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 3. Insert Users (Profiles)
    console.log("👤 Inserting users...");
    const userMap: Record<string, number> = {};
    
    for (const profile of profiles) {
      const result = await sql`
        INSERT INTO users (name, email, password, role, phone, city, bio, avatar, company, verified)
        VALUES (
          ${profile.name}, 
          ${profile.email}, 
          ${hashedPassword}, 
          ${profile.role}, 
          ${profile.phone}, 
          ${profile.city}, 
          ${profile.bio}, 
          ${profile.avatar}, 
          ${profile.companyName || null}, 
          ${profile.verificationStatus === 'verified'}
        )
        RETURNING id
      `;
      userMap[profile.id] = result[0].id;
    }

    // Add a default admin if not in mock data
    if (!profiles.some(p => p.email === 'admin@citysblock.in')) {
      const adminResult = await sql`
        INSERT INTO users (name, email, password, role, verified)
        VALUES ('Admin', 'admin@citysblock.in', ${hashedPassword}, 'admin', true)
        RETURNING id
      `;
      userMap['admin'] = adminResult[0].id;
    }

    // 4. Insert Listings
    console.log("🏠 Inserting listings...");
    for (const listing of listings) {
      const userId = userMap[listing.profileId] || userMap['admin'];
      await sql`
        INSERT INTO listings (
          user_id, title, description, listing_type, asset_class, property_type,
          city, locality, address, price, price_unit, area, bhk, bathrooms,
          furnishing, possession, amenities, images, status, featured, verified
        ) VALUES (
          ${userId}, ${listing.title}, ${listing.description},
          ${listing.listingType}, ${listing.assetClass}, ${listing.propertyType},
          ${listing.city}, ${listing.localitySlug}, ${listing.address},
          ${listing.price}, ${listing.priceUnit}, ${listing.area},
          ${listing.bhk}, ${listing.bathrooms}, ${listing.furnishing},
          ${listing.possessionStatus}, ${listing.amenities}, ${listing.images},
          'active', ${listing.featured}, ${listing.verified}
        )
      `;
    }

    // 5. Insert Projects
    console.log("🏗️ Inserting projects...");
    for (const project of projects) {
      await sql`
        INSERT INTO projects (name, developer, city, locality, description, status, image_url)
        VALUES (
          ${project.name}, 
          ${profiles.find(p => p.id === project.builderId)?.companyName || 'Bespoke Developers'}, 
          ${project.city}, 
          ${project.localitySlug}, 
          ${project.summary}, 
          ${project.status}, 
          ${project.coverImage}
        )
      `;
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  }
}

seed();
