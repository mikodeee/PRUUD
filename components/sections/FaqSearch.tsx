"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { faqCategories, faqItems, type FaqCategory } from "@/lib/content/faq";
import { cn } from "@/lib/utils";

/** Odstráni diakritiku, aby "uspora" našlo aj "úspora". */
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function FaqSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory | "vsetky">("vsetky");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return faqItems.filter((item) => {
      if (category !== "vsetky" && item.category !== category) return false;
      if (!q) return true;
      return normalize(`${item.question} ${item.answer}`).includes(q);
    });
  }, [query, category]);

  const categories = Object.entries(faqCategories) as Array<[FaqCategory, string]>;

  return (
    <div>
      <div className="relative">
        <Search
          size={20}
          className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-ink-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Čo potrebujete zistiť?"
          aria-label="Hľadať v otázkach"
          className="h-14 w-full rounded-full border border-ink-300 bg-white pr-6 pl-13 text-ink-950 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("vsetky")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            category === "vsetky"
              ? "bg-ink-950 text-white"
              : "bg-white text-ink-600 ring-1 ring-ink-300 ring-inset hover:bg-ink-50",
          )}
        >
          Všetky
        </button>
        {categories.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === key
                ? "bg-ink-950 text-white"
                : "bg-white text-ink-600 ring-1 ring-ink-300 ring-inset hover:bg-ink-50",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-500" role="status">
        {filtered.length === faqItems.length
          ? `${faqItems.length} otázok`
          : `Našli sme ${filtered.length} z ${faqItems.length} otázok`}
      </p>

      <div className="mt-4">
        <Accordion items={filtered} />
      </div>
    </div>
  );
}
