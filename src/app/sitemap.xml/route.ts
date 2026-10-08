import { baseMetadata } from "@/lib/metadata";

const locales = ["en", "fa"] as const;

const pages = [
  { path: "", changefreq: "monthly", priority: "1.0" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
] as const;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const siteUrl = baseMetadata.url;
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = pages.flatMap(({ path, changefreq, priority }) =>
    locales.map((locale) => {
      const loc = `${siteUrl}/${locale}${path}`;
      const alternates = (
        [
          ["en", `${siteUrl}/en${path}`],
          ["fa", `${siteUrl}/fa${path}`],
          ["x-default", `${siteUrl}/en${path}`],
        ] as const
      )
        .map(
          ([hreflang, href]) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
