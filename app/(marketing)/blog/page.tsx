import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/sections/ProductLayout";
import { formatDate, getPosts } from "@/lib/content/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Články o zdieľaní elektriny, legislatíve a tom, ako z fotovoltiky dostať viac.",
};

export default async function BlogPage() {
  const posts = await getPosts("blog");

  return (
    <Section>
      <p className="claim text-xs text-gold-600">Blog</p>
      <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
        Zdieľaniu elektriny sa dá rozumieť
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
        Píšeme o tom, ako systém naozaj funguje — vrátane toho, čo od neho
        čakať nemožno.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-card border border-ink-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <p className="text-sm text-ink-500">
              {formatDate(post.date)} · {post.readingMinutes} min čítania
            </p>
            <h2 className="mt-3 font-display text-xl leading-snug font-semibold text-ink-950 group-hover:text-gold-700">
              {post.title}
            </h2>
            <p className="mt-3 flex-1 leading-relaxed text-ink-600">
              {post.description}
            </p>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-ink-600">Zatiaľ tu nie sú žiadne články.</p>
        )}
      </div>
    </Section>
  );
}
