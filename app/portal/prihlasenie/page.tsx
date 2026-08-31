import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "@/components/forms/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Prihlásenie do portálu",
  robots: { index: false, follow: false },
};

export default async function PrihlaseniePage() {
  // Prihlásený používateľ nemá dôvod vidieť prihlasovací formulár.
  if (await getCurrentUser()) redirect("/portal");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto block w-fit text-[1.3rem]">
          <Logo withTagline />
        </Link>

        <div className="mt-12 rounded-card border border-ink-200 bg-white p-8">
          <h1 className="font-display text-2xl font-semibold text-ink-950">
            Prihlásenie
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            Prihláste sa do zákazníckeho portálu PRUUD.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <div className="mt-8 rounded-xl border border-gold-300 bg-gold-50 p-4">
            <p className="text-sm leading-relaxed text-gold-900">
              <strong className="font-semibold">Demo prístup:</strong>{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                demo@pruud.sk
              </code>{" "}
              /{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                demo1234
              </code>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-ink-600">
          Nemáte účet?{" "}
          <Link
            href="/registracia"
            className="font-medium text-gold-700 underline underline-offset-4"
          >
            Zaregistrujte sa
          </Link>
        </p>
      </div>
    </main>
  );
}
