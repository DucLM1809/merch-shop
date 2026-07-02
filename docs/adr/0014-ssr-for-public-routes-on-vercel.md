# SSR (not SSG/hybrid) for public catalog routes, deployed on Vercel

Catalog and product-detail routes were pure client-side rendered, giving crawlers an empty shell and no per-route metadata. We enabled TanStack Start SSR for these routes only (cart/checkout/account/admin stay CSR — no SEO value, behind auth), fetching from the existing REST/OpenAPI backend at render time. We rejected build-time SSG and hybrid SSR+SSG: product price/stock change frequently, and SSG would require a rebuild-on-catalog-change trigger or a custom on-demand revalidation layer that doesn't exist today (TanStack Start has no built-in ISR). SSR + CDN edge caching gets most of SSG's speed without that staleness/rebuild machinery. Deploy target is Vercel — native SSR support, no server to own, keeping this repo's "frontend-only" posture (ADR-0004) intact since rendering still calls the REST API rather than a DB or server function.

## Considered Options

- Static site generation (SSG) at build time — rejected: staleness on price/stock, no rebuild trigger exists
- Hybrid SSR (catalog search) + SSG (product detail) — rejected: same staleness problem for detail pages, plus two render modes to maintain and test
- SSR for public routes only, CSR elsewhere ✓

## Consequences

Sitemap and per-route metadata are generated/rendered at request time, not at build time, so a rebuild-on-content-change pipeline is never needed. Deploy target is now coupled to a platform with SSR support (Vercel); moving off Vercel later means standing up an equivalent Node/edge runtime.
