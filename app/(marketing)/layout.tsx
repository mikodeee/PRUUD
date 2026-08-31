import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#obsah"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        Preskočiť na obsah
      </a>
      <Header />
      <main id="obsah" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
