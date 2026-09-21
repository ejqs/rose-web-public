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
    globalForDb.rosePool = new Pool({
      connectionString: url,
      max: 3,
      ssl: { rejectUnauthorized: false },
    });
    globalForDb.roseDb = drizzle(globalForDb.rosePool, { schema });
  }
  return globalForDb.roseDb;
}
