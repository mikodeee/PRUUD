"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { verifyMeteringPoint, type ActionState } from "@/lib/actions/leads";
import { EIC_ERROR_MESSAGES, validateEic } from "@/lib/calculations/eic";
import { cn } from "@/lib/utils";

const initial: ActionState = { status: "idle" };

export function EicVerification() {
  const [state, formAction, pending] = useActionState(
    verifyMeteringPoint,
    initial,
  );
  const [eic, setEic] = useState("");

  // Okamžitá spätná väzba ešte pred odoslaním — kontrolný znak sa dá
  // overiť priamo v prehliadači, netreba naň server.
  const liveCheck = eic.length === 16 ? validateEic(eic) : null;

  return (
    <div className="rounded-card border border-ink-200 bg-white p-6 md:p-10">
      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="eic" className="block text-sm font-medium text-ink-800">
            EIC kód odberného miesta
          </label>
          <p className="mt-1 text-sm text-ink-500">
            Nájdete ho na faktúre od dodávateľa elektriny. Má 16 znakov
            a slovenské miesta sa začínajú číslicami 24.
          </p>
          <input
            id="eic"
            name="eic"
            value={eic}
            onChange={(e) => setEic(e.target.value.toUpperCase())}
            maxLength={16}
            autoComplete="off"
            spellCheck={false}
            placeholder="24ZZS0000000000X"
            aria-describedby="eic-hint"
            aria-invalid={liveCheck ? !liveCheck.valid : undefined}
            className={cn(
              "mt-4 h-13 w-full rounded-full border bg-white px-6 font-mono text-lg tracking-wider text-ink-950 placeholder:text-ink-300 focus-visible:outline-2 focus-visible:outline-offset-2",
              liveCheck && !liveCheck.valid
                ? "border-red-400 focus-visible:outline-red-500"
                : "border-ink-300 focus-visible:outline-gold-600",
            )}
          />
          <p id="eic-hint" className="mt-2 min-h-5 text-sm">
            {liveCheck?.valid && liveCheck.checksumOk && (
              <span className="text-green-700">
                Formát aj kontrolný znak sedia.
              </span>
            )}
            {liveCheck?.valid && !liveCheck.checksumOk && (
              <span className="text-ink-600">
                Formát sedí. Kontrolný znak nám nevyšiel, kód preto overíme
                manuálne — odoslať ho môžete.
              </span>
            )}
            {liveCheck && !liveCheck.valid && (
              <span className="text-red-700">
                {EIC_ERROR_MESSAGES[liveCheck.reason]}
              </span>
            )}
            {!liveCheck && eic.length > 0 && (
              <span className="text-ink-400">{eic.length} / 16 znakov</span>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-800">
            E-mail <span className="font-normal text-ink-500">(nepovinné)</span>
          </label>
          <p className="mt-1 text-sm text-ink-500">
            Ak ho vyplníte, pošleme vám výsledok overenia dostupnosti
            inteligentného merania.
          </p>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vas@email.sk"
            className="mt-4 h-13 w-full rounded-full border border-ink-300 bg-white px-6 text-ink-950 placeholder:text-ink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          />
        </div>

        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
          {pending ? "Overujem…" : "Overiť odberné miesto"}
        </Button>
      </form>

      {state.status === "success" && (
        <div
          role="status"
          className="mt-8 flex items-start gap-3 rounded-card border border-green-300 bg-green-50 p-5"
        >
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-700" aria-hidden="true" />
          <p className="leading-relaxed text-green-900">{state.message}</p>
        </div>
      )}

      {state.status === "error" && (
        <div
          role="alert"
          className="mt-8 flex items-start gap-3 rounded-card border border-red-300 bg-red-50 p-5"
        >
          <XCircle size={20} className="mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
          <div className="text-red-900">
            <p className="leading-relaxed">{state.message}</p>
            {state.fieldErrors && (
              <ul className="mt-2 list-inside list-disc text-sm">
                {Object.entries(state.fieldErrors).map(([field, msg]) => (
                  <li key={field}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
