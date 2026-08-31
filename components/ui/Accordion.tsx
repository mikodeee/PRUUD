"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = { question: string; answer: string };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  if (items.length === 0) {
    return (
      <p className="py-8 text-ink-600">
        Pre zadaný výraz sme nič nenašli. Skúste iné slovo alebo nám napíšte.
      </p>
    );
  }

  return (
    <div className="divide-y divide-ink-200 border-y border-ink-200">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                <span className="font-display text-lg font-medium text-ink-950">
                  {item.question}
                </span>
                <Plus
                  size={20}
                  className={cn(
                    "mt-1 shrink-0 text-gold-600 transition-transform duration-200",
                    isOpen && "rotate-45",
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isOpen && (
              <p className="max-w-2xl pb-6 leading-relaxed text-ink-600">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
