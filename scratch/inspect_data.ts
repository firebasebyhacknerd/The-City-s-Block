import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function inspectData() {
  try {
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const listingCount = await sql`SELECT COUNT(*) as count FROM listings`;
    const activeListings = await sql`SELECT COUNT(*) as count FROM listings WHERE status = 'active'`;
    
    console.log("User count:", userCount[0].count);
    console.log("Total listing count:", listingCount[0].count);
    console.log("Active listing count:", activeListings[0].count);

    if (userCount[0].count > 0) {
      const users = await sql`SELECT id, email, role FROM users LIMIT 5`;
      console.log("Sample users:", users);
    }

  } catch (error) {
    console.error("Data inspection failed:", error);
  }
}

inspectData();
