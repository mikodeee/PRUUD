/*
 * Pripojenie pre skripty spúšťané mimo Next.js (migrácie, seed).
 * Rovnaká logika ako lib/db/index.ts: DATABASE_URL → Postgres, inak PGlite.
 */
import * as schema from "../lib/db/schema.ts";

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

export async function connect() {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");

    const ssl = sslConfig(connectionString);
    const pool = new Pool({
      connectionString,
      ...(ssl === undefined ? {} : { ssl }),
    });

    return {
      db: drizzle(pool, { schema }),
      migrate: (folder: string) =>
        migrate(drizzle(pool, { schema }), { migrationsFolder: folder }),
      close: () => pool.end(),
      label: "Postgres (DATABASE_URL)",
    };
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");

  const dir = process.env.PGLITE_DIR ?? "./.pglite";
  const client = new PGlite(dir);

  return {
    db: drizzle(client, { schema }),
    migrate: (folder: string) =>
      migrate(drizzle(client, { schema }), { migrationsFolder: folder }),
    close: () => client.close(),
    label: `PGlite (${dir})`,
  };
}
