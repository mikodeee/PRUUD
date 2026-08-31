import { connect } from "./db-connect.ts";
import * as schema from "../lib/db/schema.ts";
import { eq } from "drizzle-orm";

/*
 * Povýši existujúci účet na správcu.
 *
 *   npm run db:make-admin -- vas@email.sk
 *
 * Funguje aj proti vzdialenej databáze — stačí pred príkaz doplniť
 * DATABASE_URL s externým connection stringom z Renderu. Na free pláne
 * Render neposkytuje shell, takže toto je cesta, ako po nasadení
 * vytvoriť prvého správcu.
 */

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Použitie: npm run db:make-admin -- vas@email.sk");
  process.exit(1);
}

const conn = await connect();
console.log(`Databáza: ${conn.label}`);

const [user] = await conn.db
  .select({ id: schema.users.id, name: schema.users.name, role: schema.users.role })
  .from(schema.users)
  .where(eq(schema.users.email, email))
  .limit(1);

if (!user) {
  console.error(`\nÚčet s e-mailom ${email} neexistuje.`);
  console.error("Najprv sa zaregistrujte na webe, potom spustite tento príkaz.\n");
  const all = await conn.db
    .select({ email: schema.users.email, role: schema.users.role })
    .from(schema.users);
  if (all.length > 0) {
    console.error("Existujúce účty:");
    for (const u of all) console.error(`  ${u.email} (${u.role})`);
  } else {
    console.error("V databáze zatiaľ nie je žiadny účet.");
  }
  await conn.close();
  process.exit(1);
}

if (user.role === "admin") {
  console.log(`\n${user.name} (${email}) už správcom je. Nič sa nemenilo.`);
  await conn.close();
  process.exit(0);
}

await conn.db
  .update(schema.users)
  .set({ role: "admin" })
  .where(eq(schema.users.id, user.id));

console.log(`\n✓ ${user.name} (${email}) je odteraz správca.`);
console.log("Po opätovnom prihlásení sa v menu portálu objaví položka Správa.\n");
await conn.close();
