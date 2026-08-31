import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentProps } from "react";

/* Typografia pre MDX obsah. Bez plugin-u — postačí mapovanie prvkov. */
const components = {
  h2: (p: ComponentProps<"h2">) => (
    <h2
      className="mt-14 font-display text-2xl font-semibold tracking-tight text-ink-950"
      {...p}
    />
  ),
  h3: (p: ComponentProps<"h3">) => (
    <h3 className="mt-10 font-display text-xl font-semibold text-ink-950" {...p} />
  ),
  p: (p: ComponentProps<"p">) => (
    <p className="mt-5 text-lg leading-relaxed text-ink-700" {...p} />
  ),
  ul: (p: ComponentProps<"ul">) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-ink-700" {...p} />
  ),
  ol: (p: ComponentProps<"ol">) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-lg text-ink-700" {...p} />
  ),
  strong: (p: ComponentProps<"strong">) => (
    <strong className="font-semibold text-ink-950" {...p} />
  ),
  blockquote: (p: ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-8 border-l-3 border-gold-400 bg-gold-50 py-4 pl-6 text-base leading-relaxed text-ink-700 italic"
      {...p}
    />
  ),
  a: (p: ComponentProps<"a">) => (
    <a className="text-gold-700 underline underline-offset-4" {...p} />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
