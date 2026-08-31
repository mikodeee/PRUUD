import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { IconConsumer, IconInfiniteFlow, IconProducer } from "@/components/brand/icons";
import { faqItems } from "@/lib/content/faq";
import { products, type Product } from "@/lib/site";

const icons = {
  producer: IconProducer,
  consumer: IconConsumer,
  infinite: IconInfiniteFlow,
};

export function ProductHero({ product }: { product: Product }) {
  const Icon = icons[product.icon];
  return (
    <section className="bg-ink-950 text-white">
      <div className="container-pruud py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="claim text-xs text-gold-400">{product.name}</p>
            <h1 className="mt-6 font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
              {product.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300 text-pretty">
              {product.lead}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/registracia" size="lg">
                Začať registráciu
              </ButtonLink>
              <ButtonLink href="/overenie-miesta" variant="onDark" size="lg">
                Overiť odberné miesto
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-card border border-white/10 bg-white/[0.03] p-10 text-center">
            <Icon className="mx-auto h-14 w-14 text-gold-400" aria-hidden="true" />
            <p className="mt-8 font-display text-5xl font-semibold tracking-tight text-gold-400">
              {product.highlight}
            </p>
            <p className="mt-2 text-ink-300">{product.highlightLabel}</p>
            <p className="mt-6 border-t border-white/10 pt-6 text-sm text-ink-400">
              {product.audience}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Steps({
  steps,
}: {
  steps: Array<{ title: string; text: string }>;
}) {
  return (
    <ol className="mt-14 grid gap-8 md:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100 font-display text-lg font-semibold text-gold-700">
            {i + 1}
          </span>
          <h3 className="mt-5 font-display text-lg font-semibold text-ink-950">
            {step.title}
          </h3>
          <p className="mt-2 leading-relaxed text-ink-600">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function BenefitList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-ink-700">
          <Check size={19} className="mt-0.5 shrink-0 text-gold-600" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProductFaq({ categories }: { categories: string[] }) {
  const items = faqItems.filter((i) => categories.includes(i.category));
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container-pruud">
        <SectionHeading eyebrow="Časté otázky" title="Čo sa najčastejšie pýtate" />
        <div className="mt-12 max-w-3xl">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}

export function OtherProducts({ currentSlug }: { currentSlug: string }) {
  const others = products.filter((p) => p.slug !== currentSlug);
  return (
    <section className="py-20 md:py-24">
      <div className="container-pruud">
        <SectionHeading eyebrow="Ďalšie riešenia" title="Možno sa vás týka aj toto" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {others.map((p) => {
            const Icon = icons[p.icon];
            return (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="group rounded-card border border-ink-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                <Icon className="h-9 w-9 text-gold-500" aria-hidden="true" />
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-950">
                  {p.name}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-600">{p.lead}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink-950">
                  Zistiť viac
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-20 md:py-24 ${className}`}>
      <div className="container-pruud">{children}</div>
    </section>
  );
}
