"use server";

import { lookupMeteringPoint, type MeteringLookup } from "@/lib/services/meteringRegistry";

export type MeteringCheckState =
  | { status: "idle" }
  | { status: "invalid"; message: string }
  | { status: "ok"; result: MeteringLookup };

/**
 * Overí, či má odberné miesto priebehové meranie. Volá sa z registrácie
 * hneď po zadaní úplného EIC kódu, aby zákazník vedel ešte pred
 * dokončením registrácie, či je zdieľanie u neho vôbec možné.
 */
export async function checkMeteringPoint(
  eic: string,
): Promise<MeteringCheckState> {
  const result = await lookupMeteringPoint(eic);

  if (!result) {
    return {
      status: "invalid",
      message: "Kód nemá platný formát slovenského odberného miesta.",
    };
  }

  return { status: "ok", result };
}
