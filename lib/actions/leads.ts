"use server";

import { validateEic } from "@/lib/calculations/eic";
import { contactSchema, eicVerificationSchema } from "@/lib/actions/schemas";
import { notifyTeam } from "@/lib/actions/notify";
import { recordLead } from "@/lib/db/leads";

export type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

function fieldErrorsFrom(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Overenie odberného miesta.
 *
 * Fáza 1: kontrolujeme štruktúru a kontrolný znak EIC podľa ENTSO-E
 * a odovzdávame kód na manuálne overenie v registri. Vo fáze 3 sa
 * na tomto mieste zavolá EDC/OKTE — rozhranie akcie ostane rovnaké.
 */
export async function verifyMeteringPoint(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = eicVerificationSchema.safeParse({
    eic: formData.get("eic"),
    email: formData.get("email") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Skontrolujte zadané údaje.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const validation = validateEic(parsed.data.eic);
  if (!validation.valid) {
    return { status: "error", message: "Neplatný EIC kód." };
  }

  await recordLead({
    kind: "eic-verification",
    email: parsed.data.email || null,
    payload: { eic: validation.normalized },
  });

  await notifyTeam({
    subject: `Overenie odberného miesta — ${validation.normalized}`,
    lines: [
      ["EIC", validation.normalized],
      ["E-mail", parsed.data.email || "neuvedený"],
    ],
  });

  return {
    status: "success",
    message:
      "EIC kód má platnú štruktúru aj kontrolný znak. Odovzdali sme ho na overenie dostupnosti inteligentného merania — ozveme sa do jedného pracovného dňa.",
  };
}

export async function submitContact(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    segment: formData.get("segment"),
    message: formData.get("message"),
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Skontrolujte zadané údaje.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const { name, email, phone, segment, message } = parsed.data;

  await recordLead({
    kind: "contact",
    email,
    payload: { name, phone: phone ?? "", segment, message },
  });

  await notifyTeam({
    subject: `Nová správa z webu — ${name} (${segment})`,
    lines: [
      ["Meno", name],
      ["E-mail", email],
      ["Telefón", phone || "neuvedený"],
      ["Segment", segment],
      ["Správa", message],
    ],
  });

  return {
    status: "success",
    message: "Ďakujeme, správu sme dostali. Ozveme sa do jedného pracovného dňa.",
  };
}
