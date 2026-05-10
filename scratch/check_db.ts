import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function checkDb() {
  try {
    console.log("Checking database connection...");
    const result = await sql`SELECT 1 as connected`;
    console.log("Connection result:", result);

    console.log("Listing tables...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables found:", tables.map(t => t.table_name));

    const expectedTables = ["users", "listings", "inquiries", "favorites", "notifications", "saved_searches"];
    const existingTables = tables.map(t => t.table_name);
    const missingTables = expectedTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log("Missing tables:", missingTables);
    } else {
      console.log("All expected tables exist.");
    }

  } catch (error) {
    console.error("Database check failed:", error);
  }
}

checkDb();
