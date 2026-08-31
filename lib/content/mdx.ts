import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

/*
 * Jednoduchý MDX loader nad adresárom content/.
 * Zámerne bez Contentlayeru — ten už nie je udržiavaný a pre pár
 * desiatok článkov je réžia zbytočná.
 */

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  /** Prípadové štúdie: merateľné výsledky do prehľadovej karty. */
  location?: string;
  savings?: string;
  volume?: string;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingMinutes: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function readingTime(text: string) {
  // ~200 slov za minútu, minimum 1 minúta.
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export async function getPosts(collection: string): Promise<Post[]> {
  const dir = path.join(CONTENT_DIR, collection);

  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(dir, file), "utf8");
        const { data, content } = matter(raw);
        return {
          ...(data as PostFrontmatter),
          slug: file.replace(/\.mdx$/, ""),
          content,
          readingMinutes: readingTime(content),
        };
      }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(collection: string, slug: string) {
  const posts = await getPosts(collection);
  return posts.find((p) => p.slug === slug) ?? null;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
