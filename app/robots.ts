import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Portál je za prihlásením a nemá čo robiť vo vyhľadávačoch.
      disallow: ["/portal/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
