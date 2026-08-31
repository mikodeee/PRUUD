"use client";

import { useActionState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { login } from "@/lib/actions/auth";
import type { ActionState } from "@/lib/actions/leads";

const initial: ActionState = { status: "idle" };

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-ink-300 bg-white px-4 text-ink-950 placeholder:text-ink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="l-email" className="text-sm font-medium text-ink-800">
          E-mail
        </label>
        <input
          id="l-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="l-password" className="text-sm font-medium text-ink-800">
          Heslo
        </label>
        <input
          id="l-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state.status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4"
        >
          <XCircle size={18} className="mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
          <p className="text-sm text-red-900">{state.message}</p>
        </div>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {pending ? "Prihlasujem…" : "Prihlásiť sa"}
      </Button>
    </form>
  );
}
