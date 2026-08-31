"use client";

import { useActionState, useState, useTransition } from "react";
import { CheckCircle2, Gauge, Info, Loader2, TriangleAlert, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { register } from "@/lib/actions/auth";
import { checkMeteringPoint, type MeteringCheckState } from "@/lib/actions/metering";
import type { ActionState } from "@/lib/actions/leads";
import { EIC_ERROR_MESSAGES, validateEic } from "@/lib/calculations/eic";
import { products } from "@/lib/site";
import { cn } from "@/lib/utils";

const initial: ActionState = { status: "idle" };

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-ink-300 bg-white px-4 text-ink-950 placeholder:text-ink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600";

/** Výsledok overenia priebehového merania pre zadané odberné miesto. */
function MeteringStatusCard({
  state,
  checking,
}: {
  state: MeteringCheckState;
  checking: boolean;
}) {
  if (checking) {
    return (
      <div className="mt-4 flex items-center gap-3 rounded-card border border-ink-200 bg-white p-5">
        <Loader2 size={20} className="shrink-0 animate-spin text-ink-400" aria-hidden="true" />
        <p className="text-ink-600">Overujem odberné miesto…</p>
      </div>
    );
  }

  if (state.status === "idle") return null;

  if (state.status === "invalid") {
    return (
      <div
        role="status"
        className="mt-4 flex items-start gap-3 rounded-card border border-ink-200 bg-white p-5"
      >
        <Info size={20} className="mt-0.5 shrink-0 text-ink-400" aria-hidden="true" />
        <p className="text-ink-600">{state.message}</p>
      </div>
    );
  }

  const { result } = state;

  const distributorLine = result.distributor && (
    <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
      <Gauge size={15} aria-hidden="true" />
      Distribučná oblasť: <strong>{result.distributor.name}</strong>
    </p>
  );

  const demoNote = result.source === "demo" && (
    <p className="mt-4 border-t border-current/15 pt-3 text-xs opacity-80">
      Ukážkový výsledok pre demo. V produkcii sa zobrazí až po napojení na EDC.
    </p>
  );

  if (result.status === "ims") {
    return (
      <div role="status" className="mt-4 rounded-card border border-green-300 bg-green-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-700" aria-hidden="true" />
          <div className="text-green-900">
            <p className="font-medium">Odberné miesto má priebehový elektromer</p>
            <p className="mt-1 leading-relaxed">
              Meranie prebieha v 15-minútových intervaloch, čo je podmienka
              zdieľania. U vás je zdieľanie možné.
            </p>
            {distributorLine}
            {demoNote}
          </div>
        </div>
      </div>
    );
  }

  if (result.status === "bez-ims") {
    return (
      <div role="status" className="mt-4 rounded-card border border-gold-400 bg-gold-50 p-5">
        <div className="flex items-start gap-3">
          <TriangleAlert size={20} className="mt-0.5 shrink-0 text-gold-700" aria-hidden="true" />
          <div className="text-gold-900">
            <p className="font-medium">Toto miesto zatiaľ nemá priebehový elektromer</p>
            <p className="mt-1 leading-relaxed">
              Bez 15-minútového merania sa zdieľanie nedá spustiť. Elektromer
              inštaluje distribútor — v registrácii môžete pokračovať a my vám
              so žiadosťou o výmenu pomôžeme.
            </p>
            {distributorLine}
            {demoNote}
          </div>
        </div>
      </div>
    );
  }

  /*
   * Stav "nezname" je bežný a čestný: či má miesto priebehové meranie,
   * sa z verejných zdrojov zistiť nedá. Namiesto vymyslenej odpovede
   * dáme zákazníkovi krok, ktorý vie spraviť hneď sám.
   */
  return (
    <div role="status" className="mt-4 rounded-card border border-ink-300 bg-white p-5">
      <div className="flex items-start gap-3">
        <Info size={20} className="mt-0.5 shrink-0 text-petrol-500" aria-hidden="true" />
        <div className="text-ink-800">
          <p className="font-medium text-ink-950">
            Kód je v poriadku, typ elektromera overíme
          </p>
          <p className="mt-1 leading-relaxed text-ink-600">
            Či má miesto priebehové meranie, vidno až v registri
            prevádzkovateľa. Overíme to za vás a ozveme sa — v registrácii
            môžete pokračovať.
          </p>
          {result.distributor && (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-700">
              <Gauge size={15} aria-hidden="true" />
              Distribučná oblasť: <strong>{result.distributor.name}</strong>
            </p>
          )}
          {result.distributor && (
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Overiť si to viete aj sami v zákazníckom portáli{" "}
              <a
                href={result.distributor.portalUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-gold-700 underline underline-offset-4"
              >
                {result.distributor.name}
              </a>{" "}
              — hľadajte typ merania alebo &bdquo;priebehové meranie&ldquo;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function RegisterForm({ defaultProduct }: { defaultProduct?: string }) {
  const [state, formAction, pending] = useActionState(register, initial);
  const [product, setProduct] = useState(defaultProduct ?? "odber");
  const [eic, setEic] = useState("");
  const [metering, setMetering] = useState<MeteringCheckState>({ status: "idle" });
  const [checking, startCheck] = useTransition();

  /*
   * Chyby zo servera platia pre hodnoty, s ktorými sa formulár odoslal.
   * Keď používateľ pole odvtedy upravil, hlášku prestaneme ukazovať —
   * inak visí pri poli, ktoré už je opravené, a mätie.
   */
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const serverErrors = state.status === "error" ? state.fieldErrors : undefined;
  const err = serverErrors
    ? Object.fromEntries(
        Object.entries(serverErrors).filter(([field]) => !dirty[field]),
      )
    : undefined;

  function markClean(field: string) {
    setDirty((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }

  const eicCheck = eic.length === 16 ? validateEic(eic) : null;

  /*
   * Po zadaní úplného a formálne platného kódu sa hneď pýtame registra,
   * či má miesto priebehové meranie — zákazník to má vedieť ešte pred
   * dokončením registrácie, nie až po nej.
   *
   * Overenie spúšťame priamo zo zmeny vstupu, nie z efektu: je to reakcia
   * na akciu používateľa, nie synchronizácia s vonkajším systémom.
   */
  function handleEicChange(raw: string) {
    const value = raw.toUpperCase();
    setEic(value);
    markClean("eic");

    if (value.length !== 16 || !validateEic(value).valid) {
      setMetering({ status: "idle" });
      return;
    }

    startCheck(async () => {
      setMetering(await checkMeteringPoint(value));
    });
  }

  return (
    <form
      action={formAction}
      onSubmit={() => setDirty({})}
      className="space-y-10"
    >
      <fieldset>
        <legend className="font-display text-lg font-semibold text-ink-950">
          1. Čo vás zaujíma
        </legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {products.map((p) => (
            <label
              key={p.slug}
              className={cn(
                "cursor-pointer rounded-card border p-5 transition-colors",
                product === p.slug
                  ? "border-gold-500 bg-gold-50 ring-1 ring-gold-500"
                  : "border-ink-200 bg-white hover:border-ink-300",
              )}
            >
              <input
                type="radio"
                name="product"
                value={p.slug}
                checked={product === p.slug}
                onChange={() => setProduct(p.slug)}
                className="sr-only"
              />
              <span className="block font-display font-semibold text-ink-950">
                {p.name}
              </span>
              <span className="mt-1 block text-sm text-ink-600">{p.audience}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-lg font-semibold text-ink-950">
          2. Odberné miesto
        </legend>
        <div className="mt-5">
          <label htmlFor="r-eic" className="text-sm font-medium text-ink-800">
            EIC kód{" "}
            <span className="font-normal text-ink-500">
              (16 znakov z faktúry, začína na 24)
            </span>
          </label>
          <input
            id="r-eic"
            name="eic"
            value={eic}
            onChange={(e) => handleEicChange(e.target.value)}
            maxLength={16}
            required
            autoComplete="off"
            spellCheck={false}
            placeholder="24ZZS0000000000X"
            aria-describedby="r-eic-hint"
            className={cn(inputClass, "font-mono tracking-wider")}
          />
          <p id="r-eic-hint" className="mt-1 min-h-5 text-sm">
            {eicCheck?.valid && !eicCheck.checksumOk && (
              <span className="text-gold-800">
                Kontrolný znak nesedí — pravdepodobne je v kóde preklep.
                Skontrolujte prepis z faktúry. Pokračovať môžete, overíme ho
                manuálne.
              </span>
            )}
            {eicCheck && !eicCheck.valid && (
              <span className="text-red-700">
                {EIC_ERROR_MESSAGES[eicCheck.reason]}
              </span>
            )}
            {!eicCheck && eic.length > 0 && (
              <span className="text-ink-400">{eic.length} / 16 znakov</span>
            )}
            {err?.eic && !eicCheck && (
              <span className="text-red-700">{err.eic}</span>
            )}
          </p>

          <MeteringStatusCard state={metering} checking={checking} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-lg font-semibold text-ink-950">
          3. Váš účet
        </legend>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="r-name" className="text-sm font-medium text-ink-800">
              Meno a priezvisko
            </label>
            <input
              id="r-name"
              name="name"
              required
              autoComplete="name"
              onChange={() => markClean("name")}
              className={inputClass}
            />
            {err?.name && <p className="mt-1 text-sm text-red-700">{err.name}</p>}
          </div>
          <div>
            <label htmlFor="r-email" className="text-sm font-medium text-ink-800">
              E-mail
            </label>
            <input
              id="r-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              onChange={() => markClean("email")}
              className={inputClass}
            />
            {err?.email && <p className="mt-1 text-sm text-red-700">{err.email}</p>}
          </div>
          <div>
            <label htmlFor="r-phone" className="text-sm font-medium text-ink-800">
              Telefón <span className="font-normal text-ink-500">(nepovinné)</span>
            </label>
            <input id="r-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
          </div>
          <div />
          <div>
            <label htmlFor="r-password" className="text-sm font-medium text-ink-800">
              Heslo <span className="font-normal text-ink-500">(aspoň 8 znakov)</span>
            </label>
            <input
              id="r-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              onChange={() => markClean("password")}
              className={inputClass}
            />
            {err?.password && <p className="mt-1 text-sm text-red-700">{err.password}</p>}
          </div>
          <div>
            <label htmlFor="r-password2" className="text-sm font-medium text-ink-800">
              Heslo znova
            </label>
            <input
              id="r-password2"
              name="passwordConfirm"
              type="password"
              required
              autoComplete="new-password"
              onChange={() => markClean("passwordConfirm")}
              className={inputClass}
            />
            {err?.passwordConfirm && (
              <p className="mt-1 text-sm text-red-700">{err.passwordConfirm}</p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="flex items-start gap-3">
        <input
          id="r-consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-gold-600"
        />
        <label htmlFor="r-consent" className="text-sm leading-relaxed text-ink-600">
          Súhlasím s obchodnými podmienkami a so spracovaním osobných údajov
          na účel poskytovania služby zdieľania elektriny.
        </label>
      </div>
      {err?.consent && <p className="text-sm text-red-700">{err.consent}</p>}

      {state.status === "error" &&
        Object.keys(dirty).length === 0 && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-card border border-red-300 bg-red-50 p-5"
          >
            <XCircle size={20} className="mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
            <p className="text-red-900">{state.message}</p>
          </div>
        )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {pending ? "Zakladám účet…" : "Vytvoriť účet"}
      </Button>
    </form>
  );
}
