import type { MetadataRoute } from "next";
import { baseMetadata } from "@/lib/metadata";

const locales = ["en", "fa"] as const;

const pages: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = baseMetadata.url;
  const lastModified = new Date();

  return pages.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: `${siteUrl}/en${path}`,
          fa: `${siteUrl}/fa${path}`,
          "x-default": `${siteUrl}/en${path}`,
        },
      },
    }))
  );
}
