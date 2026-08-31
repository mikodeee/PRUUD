/*
 * Validácia EIC kódu (Energy Identification Code) podľa ENTSO-E.
 *
 * EIC má 16 znakov:
 *   1–2   kód vydávajúcej kancelárie — Slovensko = "24"
 *   3     typ objektu — "Z" = odberné/odovzdávacie miesto
 *   4–15  alfanumerický identifikátor
 *   16    kontrolný znak (modulo 37)
 *
 * Algoritmus kontrolného znaku overený proti referenčnej implementácii
 * ENTSO-E EIC validatora aj proti dokumentovanému príkladu 11Y123456789012T.
 */

const VALUE_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-";

/** Kód vydávajúcej kancelárie pre Slovensko. */
export const SK_ISSUING_OFFICE = "24";
function charValue(char: string): number {
  const index = VALUE_CHARS.indexOf(char);
  return index; // -1 pre neplatný znak
}

/**
 * Vypočíta kontrolný znak z prvých 15 znakov EIC kódu.
 * Vráti null, ak vstup obsahuje neplatný znak alebo kód nemôže mať
 * platný kontrolný znak (výsledok 36 = "-").
 */
export function calculateEicCheckChar(first15: string): string | null {
  const chars = first15.toUpperCase().split("");
  if (chars.length !== 15) return null;

  let sum = 0;
  for (let i = 0; i < 15; i += 1) {
    const value = charValue(chars[i]);
    if (value < 0) return null;
    sum += value * (16 - i);
  }

  const checkValue = 36 - ((sum - 1) % 37);
  // 36 zodpovedá znaku "-", ktorý nesmie byť kontrolným znakom.
  if (checkValue === 36 || checkValue < 0) return null;

  return VALUE_CHARS[checkValue];
}

export type EicValidation =
  | {
      valid: true;
      normalized: string;
      isSlovak: boolean;
      /**
       * Či kontrolný znak sedí podľa ENTSO-E. Needovoľuje ani nezamieta —
       * v praxi sa vyskytujú platné slovenské kódy, ktoré tomuto výpočtu
       * nevyhovejú, a odmietnuť reálneho zákazníka je horšie než prijať
       * kód na manuálne overenie.
       */
      checksumOk: boolean;
    }
  | { valid: false; reason: EicError };

export type EicError = "empty" | "length" | "charset" | "not-slovak";

export const EIC_ERROR_MESSAGES: Record<EicError, string> = {
  empty: "Zadajte EIC kód odberného miesta.",
  length: "EIC kód má presne 16 znakov.",
  charset: "EIC kód môže obsahovať len číslice, veľké písmená a pomlčku.",
  "not-slovak":
    "Zadaný kód nie je slovenský — slovenské miesta sa začínajú číslicami 24.",
};

/**
 * Overí EIC kód. `requireSlovak` zapne kontrolu, či ide o slovenské
 * miesto, teda kód začínajúci na 24.
 *
 * Blokujúce sú len dĺžka, povolené znaky a prefix krajiny. Kontrolný znak
 * sa počíta, ale výsledok sa vracia ako informácia (`checksumOk`), nie ako
 * dôvod na odmietnutie.
 */
export function validateEic(
  input: string,
  requireSlovak = true,
): EicValidation {
  const normalized = input.trim().toUpperCase().replace(/\s+/g, "");

  if (!normalized) return { valid: false, reason: "empty" };
  if (normalized.length !== 16) return { valid: false, reason: "length" };
  if (!/^[0-9A-Z-]{16}$/.test(normalized)) {
    return { valid: false, reason: "charset" };
  }

  const isSlovak = normalized.startsWith(SK_ISSUING_OFFICE);
  if (requireSlovak && !isSlovak) {
    return { valid: false, reason: "not-slovak" };
  }

  const expected = calculateEicCheckChar(normalized.slice(0, 15));

  return {
    valid: true,
    normalized,
    isSlovak,
    checksumOk: expected !== null && expected === normalized[15],
  };
}
