import { z } from "zod";
import { EIC_ERROR_MESSAGES, validateEic } from "@/lib/calculations/eic";

/** EIC pole s plnou kontrolou vrátane kontrolného znaku. */
export const eicField = z
  .string()
  .trim()
  .min(1, "Zadajte EIC kód odberného miesta.")
  .superRefine((value, ctx) => {
    const result = validateEic(value);
    if (!result.valid) {
      ctx.addIssue({
        code: "custom",
        message: EIC_ERROR_MESSAGES[result.reason],
      });
    }
  });

export const eicVerificationSchema = z.object({
  eic: eicField,
  /** Nepovinný kontakt — overenie funguje aj bez neho. */
  email: z.string().trim().email("Zadajte platný e-mail.").optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Zadajte meno."),
  email: z.string().trim().email("Zadajte platný e-mail."),
  phone: z.string().trim().optional(),
  segment: z.enum(["domacnost", "firma", "obec"]),
  message: z.string().trim().min(10, "Napíšte nám aspoň pár viet."),
  consent: z.literal(true, {
    message: "Bez súhlasu so spracovaním údajov vás nevieme kontaktovať.",
  }),
});

export type EicVerificationInput = z.infer<typeof eicVerificationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
