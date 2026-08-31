import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MdxContent } from "@/components/MdxContent";
import { formatDate, getPost, getPosts } from "@/lib/content/mdx";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getPosts("blog");
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost("blog", slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { type: "article", title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost("blog", slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author ?? siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <article className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-pruud max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Späť na blog
        </Link>

        <p className="mt-10 text-sm text-ink-500">
          {formatDate(post.date)} · {post.readingMinutes} min čítania
          {post.author && ` · ${post.author}`}
        </p>
        <h1 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-ink-600 text-pretty">
          {post.description}
        </p>

        <div className="mt-12 border-t border-ink-200 pt-4">
          <MdxContent source={post.content} />
        </div>
      </div>
    </article>
  );
}
