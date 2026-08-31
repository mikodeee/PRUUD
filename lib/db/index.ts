import "server-only";
import type { PgDatabase } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/*
 * Dvojitý driver nad rovnakou schémou:
 *
 *   DATABASE_URL nastavené  → node-postgres (Render, Neon, Supabase)
 *   DATABASE_URL prázdne    → PGlite, Postgres vo WASM, dáta v ./.pglite
 *
 * PGlite sa načíta len vtedy, keď sa naozaj používa — v produkcii by
 * zbytočne držal desiatky MB pamäte na WASM blob, ktorý nikto nezavolá.
 * Preto dynamický import a nie statický.
 *
 * Schéma aj dopyty sú rovnaké, ide o ten istý Postgres dialekt.
 */

type Db = PgDatabase<never, typeof schema>;

const globalForDb = globalThis as unknown as { pruudDb?: Db };

/**
 * Nastavenie TLS pre spravovaný Postgres.
 *
 * Keď connection string sám určuje `sslmode`, necháme rozhodnutie na
 * ovládači `pg` a nič nevnucujeme. Lokálna databáza beží bez TLS.
 * Inak zapneme TLS, ale bez overovania reťazca — Render, Neon aj Supabase
 * podpisujú vlastnou autoritou a prísne overenie by spojenie zhodilo.
 */
function sslConfig(connectionString: string) {
  if (/[?&]sslmode=/.test(connectionString)) return undefined;
  if (/@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(connectionString)) return false;
  return { rejectUnauthorized: false };
}

async function createDb(): Promise<Db> {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");

    const ssl = sslConfig(connectionString);
    const pool = new Pool({
      connectionString,
      ...(ssl === undefined ? {} : { ssl }),
      max: 5,
    });

    return drizzle(pool, { schema }) as unknown as Db;
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");

  const client = new PGlite(process.env.PGLITE_DIR ?? "./.pglite");
  return drizzle(client, { schema }) as unknown as Db;
}

// V dev režime Next prekladá moduly opakovane; bez singletonu by každý
// hot reload otvoril nové spojenie nad tou istou databázou.
export const db: Db = globalForDb.pruudDb ?? (await createDb());

if (process.env.NODE_ENV !== "production") {
  globalForDb.pruudDb = db;
}

export { schema };
