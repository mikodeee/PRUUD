import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content/mdx";
import { glossary } from "@/lib/content/glossary";
import { siteConfig } from "@/lib/site";

const staticRoutes = [
  "",
  "/riesenia",
  "/odber",
  "/vyroba",
  "/kombi",
  "/ako-to-funguje",
  "/cennik",
  "/overenie-miesta",
  "/pripadove-studie",
  "/blog",
  "/faq",
  "/slovnik",
  "/dokumenty",
  "/o-nas",
  "/kontakt",
  "/registracia",
  "/obchodne-podmienky",
  "/ochrana-osobnych-udajov",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, studies] = await Promise.all([
    getPosts("blog"),
    getPosts("pripadove-studie"),
  ]);

  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: now,
      priority: route === "" ? 1 : 0.7,
    })),
    ...posts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      priority: 0.6,
    })),
    ...studies.map((p) => ({
      url: `${siteConfig.url}/pripadove-studie/${p.slug}`,
      lastModified: new Date(p.date),
      priority: 0.6,
    })),
    ...glossary.map((t) => ({
      url: `${siteConfig.url}/slovnik/${t.slug}`,
      lastModified: now,
      priority: 0.4,
    })),
  ];
}
