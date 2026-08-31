"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submitContact, type ActionState } from "@/lib/actions/leads";

const initial: ActionState = { status: "idle" };

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-ink-300 bg-white px-4 text-ink-950 placeholder:text-ink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-card border border-green-300 bg-green-50 p-8"
      >
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-green-700" aria-hidden="true" />
        <div>
          <h2 className="font-display text-lg font-semibold text-green-900">
            Správa odoslaná
          </h2>
          <p className="mt-2 leading-relaxed text-green-900">{state.message}</p>
        </div>
      </div>
    );
  }

  const err = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink-800">
            Meno a priezvisko
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputClass} />
          {err?.name && <p className="mt-1 text-sm text-red-700">{err.name}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="text-sm font-medium text-ink-800">
            E-mail
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
          {err?.email && <p className="mt-1 text-sm text-red-700">{err.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-ink-800">
            Telefón <span className="font-normal text-ink-500">(nepovinné)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="segment" className="text-sm font-medium text-ink-800">
            Píšem ako
          </label>
          <select id="segment" name="segment" defaultValue="domacnost" className={inputClass}>
            <option value="domacnost">Domácnosť</option>
            <option value="firma">Firma</option>
            <option value="obec">Obec alebo škola</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink-800">
          Správa
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Napíšte nám, čo potrebujete zistiť."
          className="mt-2 w-full rounded-xl border border-ink-300 bg-white p-4 leading-relaxed text-ink-950 placeholder:text-ink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
        />
        {err?.message && <p className="mt-1 text-sm text-red-700">{err.message}</p>}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-gold-600"
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-ink-600">
          Súhlasím so spracovaním osobných údajov na účel odpovede na moju
          správu. Údaje neposkytujeme tretím stranám.
        </label>
      </div>
      {err?.consent && <p className="text-sm text-red-700">{err.consent}</p>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {pending ? "Odosielam…" : "Odoslať správu"}
      </Button>

      {state.status === "error" && !err && (
        <div role="alert" className="flex items-start gap-3 rounded-card border border-red-300 bg-red-50 p-5">
          <XCircle size={20} className="mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
          <p className="text-red-900">{state.message}</p>
        </div>
      )}
    </form>
  );
}
