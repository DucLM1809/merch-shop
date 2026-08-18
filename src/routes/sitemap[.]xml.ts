import { createFileRoute } from "@tanstack/react-router";

import { client } from "@/api/client";

// Loads the `server` route option's type augmentation; nothing else in the app imports this package.
import type {} from "@tanstack/react-start";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "http://localhost:3000";

export async function buildSitemapResponse(): Promise<Response> {
  const { data: products } = await client.getProducts();

  const urls = products
    .map(
      (product) =>
        `${SITE_URL}/${product.publisherSlug}/${product.gameSlug}/products/${product.slug}`
    )
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => buildSitemapResponse(),
    },
  },
});
