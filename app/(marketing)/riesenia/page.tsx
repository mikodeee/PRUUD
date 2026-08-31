import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/Card";
import { Section } from "@/components/sections/ProductLayout";
import {
  IconConsumer,
  IconInfiniteFlow,
  IconProducer,
} from "@/components/brand/icons";
import { products } from "@/lib/site";

const icons = {
  producer: IconProducer,
  consumer: IconConsumer,
  infinite: IconInfiniteFlow,
};

export const metadata: Metadata = {
  title: "Riešenia",
  description:
    "Tri spôsoby, ako sa zapojiť do zdieľania elektriny — pre spotrebiteľov, výrobcov aj organizácie s viacerými budovami.",
};

export default function RieseniaPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Riešenia"
        title="Vyberte si podľa toho, čo máte"
        lead="Rozdiel je jediný: či elektrinu vyrábate, spotrebúvate, alebo oboje naraz vo viacerých budovách."
      />

      <div className="mt-14 space-y-6">
        {products.map((product) => {
          const Icon = icons[product.icon];
          return (
            <Link
              key={product.slug}
              href={`/${product.slug}`}
              className="group grid items-center gap-8 rounded-card border border-ink-200 bg-white p-8 transition-all hover:border-gold-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 md:grid-cols-[auto_1fr_auto] md:p-10"
            >
              <Icon className="h-12 w-12 text-gold-500" aria-hidden="true" />
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink-950">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-ink-500">{product.audience}</p>
                <p className="mt-4 max-w-2xl leading-relaxed text-ink-600">
                  {product.lead}
                </p>
              </div>
              <div className="md:text-right">
                <p className="font-display text-3xl font-semibold text-gold-600">
                  {product.highlight}
                </p>
                <p className="text-sm text-ink-500">{product.highlightLabel}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink-950">
                  Zistiť viac
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
