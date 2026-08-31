import { connect } from "./db-connect.ts";

/*
 * Migrácie sa spúšťajú pri každom štarte aplikácie. Drizzle si applikované
 * migrácie eviduje, takže opakované spustenie nič nepokazí.
 *
 * Hneď po vytvorení databázy nemusí byť ešte dostupná — DNS aj samotný
 * server sa chvíľu rozbiehajú. Preto pri chybách spojenia opakujeme pokus,
 * namiesto toho aby prvý deploy zbytočne zlyhal.
 */

const RETRIES = 5;
const BASE_DELAY_MS = 3000;

/** Chyby spojenia, ktoré majú zmysel skúsiť znova. */
const TRANSIENT = new Set([
  "ENOTFOUND",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "ECONNRESET",
]);

function errorCode(error: unknown): string | undefined {
  const seen = new Set<unknown>();
  let current: unknown = error;

  // Drizzle chybu obaľuje, skutočný kód býva až v `cause`.
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string") return code;
    current = (current as { cause?: unknown }).cause;
  }
  return undefined;
}

function explain(code: string | undefined, host: string | undefined) {
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    return [
      `Hostname databázy sa nepodarilo preložiť${host ? `: ${host}` : ""}.`,
      "",
      "Najčastejšia príčina na Renderi: databáza a webová služba sú",
      "v rôznych regiónoch. Interný hostname (dpg-…) sa preloží len",
      "v rámci toho istého regiónu.",
      "",
      "Skontrolujte, že obe majú rovnaký región. V render.yaml musí mať",
      "región nastavený aj blok `databases:`, nielen `services:`.",
      "Existujúcu databázu presunúť nemožno — treba ju zmazať a nechať",
      "blueprint vytvoriť nanovo, alebo použiť externý connection string.",
    ].join("\n");
  }
  if (code === "ECONNREFUSED") {
    return "Databáza spojenie odmietla — beží a počúva na uvedenom porte?";
  }
  if (code === "28P01") {
    return "Nesprávne prihlasovacie údaje v DATABASE_URL.";
  }
  if (code === "3D000") {
    return "Databáza s týmto názvom neexistuje.";
  }
  return undefined;
}

const conn = await connect();
console.log(`Migrujem: ${conn.label}`);

for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
  try {
    await conn.migrate("./drizzle");
    console.log("Migrácie aplikované.");
    await conn.close();
    process.exit(0);
  } catch (error) {
    const code = errorCode(error);
    const host = (error as { cause?: { hostname?: string } })?.cause?.hostname;
    const last = attempt === RETRIES;

    if (!TRANSIENT.has(code ?? "") || last) {
      console.error(`\nMigrácia zlyhala${code ? ` (${code})` : ""}.`);
      const hint = explain(code, host);
      if (hint) console.error(`\n${hint}\n`);
      console.error(error);
      await conn.close().catch(() => {});
      process.exit(1);
    }

    const delay = BASE_DELAY_MS * attempt;
    console.warn(
      `Databáza zatiaľ nedostupná (${code}). Pokus ${attempt}/${RETRIES}, skúšam znova o ${delay / 1000} s…`,
    );
    await new Promise((r) => setTimeout(r, delay));
  }
}
