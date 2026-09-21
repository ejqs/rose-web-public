import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  rosePool?: Pool;
  roseDb?: ReturnType<typeof drizzle<typeof schema>>;
};

export function getDb() {
  if (!globalForDb.roseDb) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is required (Postgres).");
    }
    const local = /localhost|127\.0\.0\.1/i.test(url) || process.env.DATABASE_SSL === "0";
    globalForDb.rosePool = new Pool({
      connectionString: url,
      max: 3,
      ssl: local ? false : { rejectUnauthorized: false },
    });
    globalForDb.roseDb = drizzle(globalForDb.rosePool, { schema });
  }
  return globalForDb.roseDb;
}
