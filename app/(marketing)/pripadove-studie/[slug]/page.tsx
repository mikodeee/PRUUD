import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MdxContent } from "@/components/MdxContent";
import { ButtonLink } from "@/components/ui/Button";
import { getPost, getPosts } from "@/lib/content/mdx";

export async function generateStaticParams() {
  const posts = await getPosts("pripadove-studie");
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/pripadove-studie/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost("pripadove-studie", slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function StudyPage({
  params,
}: PageProps<"/pripadove-studie/[slug]">) {
  const { slug } = await params;
  const post = await getPost("pripadove-studie", slug);
  if (!post) notFound();

  return (
    <article className="py-16 md:py-24">
      <div className="container-pruud max-w-3xl">
        <Link
          href="/pripadove-studie"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Späť na prípadové štúdie
        </Link>

        {post.location && (
          <p className="mt-10 text-sm text-ink-500">{post.location}</p>
        )}
        <h1 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
          {post.title}
        </h1>

        {(post.savings || post.volume) && (
          <dl className="mt-10 grid gap-6 rounded-card border border-ink-200 bg-white p-8 sm:grid-cols-2">
            {post.savings && (
              <div>
                <dt className="text-sm text-ink-500">Ročná úspora</dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-gold-600">
                  {post.savings}
                </dd>
              </div>
            )}
            {post.volume && (
              <div>
                <dt className="text-sm text-ink-500">Zdieľaný objem</dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-ink-950">
                  {post.volume}
                </dd>
              </div>
            )}
          </dl>
        )}

        <div className="mt-10">
          <MdxContent source={post.content} />
        </div>

        <div className="mt-14 border-t border-ink-200 pt-10">
          <ButtonLink href="/kontakt">Chcem podobný prepočet</ButtonLink>
        </div>
      </div>
    </article>
  );
}
