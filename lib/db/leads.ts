import "server-only";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";

type LeadInput = {
  kind: "eic-verification" | "contact" | "registration";
  email: string | null;
  payload: Record<string, unknown>;
};

/**
 * Uloží dopyt z webu. Zlyhanie zápisu nesmie zhodiť formulár —
 * notifikácia tímu odíde tak či tak, takže lead sa nestratí.
 */
export async function recordLead(input: LeadInput) {
  try {
    await db.insert(leads).values({
      kind: input.kind,
      email: input.email,
      payload: input.payload,
    });
    return { stored: true as const };
  } catch (error) {
    console.error("Lead sa nepodarilo uložiť:", error);
    return { stored: false as const };
  }
}
