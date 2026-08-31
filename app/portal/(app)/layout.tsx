import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { PortalNav } from "@/components/portal/PortalNav";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";

export default async function PortalLayout({ children }: LayoutProps<"/portal">) {
  const user = await getCurrentUser();
  if (!user) redirect("/portal/prihlasenie");

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="border-b border-ink-200 bg-white">
        <div className="container-pruud flex h-18 items-center justify-between gap-6">
          <Link href="/" className="text-[1.1rem]">
            <Logo />
          </Link>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-sm font-medium text-ink-950">{user.name}</p>
              <p className="text-xs text-ink-500">{user.email}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                <LogOut size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Odhlásiť</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container-pruud flex flex-1 gap-10 py-10">
        <aside className="hidden w-60 shrink-0 lg:block">
          <PortalNav isAdmin={user.role === "admin"} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Na mobile je navigácia pod obsahom, aby neujedala výšku obrazovky. */}
      <div className="border-t border-ink-200 bg-white py-4 lg:hidden">
        <div className="container-pruud">
          <PortalNav isAdmin={user.role === "admin"} />
        </div>
      </div>
    </div>
  );
}
