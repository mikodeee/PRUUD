"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { meteringPoints, users } from "@/lib/db/schema";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { eicField } from "@/lib/actions/schemas";
import { validateEic } from "@/lib/calculations/eic";
import { recordLead } from "@/lib/db/leads";
import { notifyTeam } from "@/lib/actions/notify";
import { lookupMeteringPoint } from "@/lib/services/meteringRegistry";
import type { ActionState } from "@/lib/actions/leads";

const loginSchema = z.object({
  email: z.string().trim().email("Zadajte platný e-mail."),
  password: z.string().min(1, "Zadajte heslo."),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Zadajte meno a priezvisko."),
    email: z.string().trim().email("Zadajte platný e-mail."),
    phone: z.string().trim().optional(),
    password: z.string().min(8, "Heslo musí mať aspoň 8 znakov."),
    passwordConfirm: z.string(),
    product: z.enum(["odber", "vyroba", "kombi"]),
    eic: eicField,
    consent: z.literal(true, {
      message: "Bez súhlasu s podmienkami vás nevieme zaregistrovať.",
    }),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Heslá sa nezhodujú.",
    path: ["passwordConfirm"],
  });

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

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Skontrolujte zadané údaje.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email.toLowerCase()))
    .limit(1);

  // Rovnaká hláška pri neexistujúcom e-maile aj pri zlom hesle —
  // inak by sa dalo zisťovať, ktoré e-maily sú zaregistrované.
  const invalid: ActionState = {
    status: "error",
    message: "Nesprávny e-mail alebo heslo.",
  };

  if (!user) return invalid;
  if (!(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return invalid;
  }

  await createSession(user.id);
  redirect("/portal");
}

export async function register(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    product: formData.get("product"),
    eic: formData.get("eic"),
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Skontrolujte zadané údaje.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const data = parsed.data;
  const email = data.email.toLowerCase();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return {
      status: "error",
      message: "Účet s týmto e-mailom už existuje.",
      fieldErrors: { email: "Tento e-mail je už zaregistrovaný." },
    };
  }

  const validation = validateEic(data.eic);
  if (!validation.valid) {
    return {
      status: "error",
      message: "Neplatný EIC kód.",
      fieldErrors: { eic: "Skontrolujte EIC kód." },
    };
  }

  const [pointOwner] = await db
    .select({ id: meteringPoints.id })
    .from(meteringPoints)
    .where(eq(meteringPoints.eic, validation.normalized))
    .limit(1);

  if (pointOwner) {
    return {
      status: "error",
      message: "Toto odberné miesto je už zaregistrované.",
      fieldErrors: { eic: "Odberné miesto už evidujeme." },
    };
  }

  const [user] = await db
    .insert(users)
    .values({
      email,
      name: data.name,
      phone: data.phone || null,
      passwordHash: await hashPassword(data.password),
      role: "klient",
    })
    .returning();

  // Zistíme, či má miesto priebehové meranie — tú istú informáciu vidí
  // zákazník už počas registrácie, tu ju ukladáme k odbernému miestu.
  const lookup = await lookupMeteringPoint(validation.normalized);

  await db.insert(meteringPoints).values({
    eic: validation.normalized,
    label: data.product === "vyroba" ? "Odovzdávacie miesto" : "Odberné miesto",
    type:
      data.product === "vyroba"
        ? "vyroba"
        : data.product === "kombi"
          ? "kombinovane"
          : "odber",
    distributor: lookup?.distributor?.code ?? null,
    status: "caka",
    userId: user.id,
  });

  await recordLead({
    kind: "registration",
    email,
    payload: { name: data.name, product: data.product, eic: validation.normalized },
  });

  await notifyTeam({
    subject: `Nová registrácia — ${data.name}`,
    lines: [
      ["Meno", data.name],
      ["E-mail", email],
      ["Telefón", data.phone || "neuvedený"],
      ["Riešenie", data.product],
      ["EIC", validation.normalized],
      [
        "Priebehové meranie",
        lookup?.status === "ims"
          ? "áno"
          : lookup?.status === "bez-ims"
            ? "NIE — treba riešiť s distribútorom"
            : "NEOVERENÉ — treba overiť v registri",
      ],
      ["Distribútor", lookup?.distributor?.name ?? "nezistený"],
    ],
  });

  await createSession(user.id);
  redirect("/portal");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
