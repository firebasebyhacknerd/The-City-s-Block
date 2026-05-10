import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function checkSchema() {
  try {
    const tables = ["users", "listings", "inquiries", "favorites", "notifications", "saved_searches", "projects"];
    for (const table of tables) {
      console.log(`\n--- Schema for ${table} ---`);
      const schema = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = ${table}
        ORDER BY ordinal_position
      `;
      console.log(schema);
    }
  } catch (error) {
    console.error("Schema check failed:", error);
  }
}

checkSchema();
