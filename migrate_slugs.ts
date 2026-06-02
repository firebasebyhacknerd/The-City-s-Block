import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { listings as mockListings, projects as mockProjects } from "./src/lib/mock-data";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  try {
    console.log("🚀 Starting database migration (slugs)...");

    // 1. Add slug columns if they don't exist
    await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT`;

    // 2. Populate Listings slugs
    console.log("🏠 Populating listing slugs...");
    const dbListings = await sql`SELECT id, title FROM listings`;
    for (const listing of dbListings) {
      // Find matching mock listing to get its original slug if possible, else generate from title
      const mock = mockListings.find(m => m.title === listing.title);
      const slug = mock ? mock.id : listing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await sql`UPDATE listings SET slug = ${slug} WHERE id = ${listing.id}`;
    }

    // 3. Populate Projects slugs
    console.log("🏗️ Populating project slugs...");
    const dbProjects = await sql`SELECT id, name FROM projects`;
    for (const project of dbProjects) {
      const mock = mockProjects.find(p => p.name === project.name);
      const slug = mock ? mock.slug : project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await sql`UPDATE projects SET slug = ${slug} WHERE id = ${project.id}`;
    }

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

migrate();
