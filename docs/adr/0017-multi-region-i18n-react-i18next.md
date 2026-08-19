# Multi-region i18n via react-i18next, URL-prefixed locale, static-first content

The storefront was English-only with no i18n library, no currency field anywhere in the API (prices are plain `number`, implicit USD), and 44 Vitest/Playwright test files that assert on hardcoded English strings. We're adding multi-region language support — `en-US` (default), `en-GB`, `fr-FR` at launch — with type-safety as a primary goal, not an afterthought.

We chose **react-i18next** over Paraglide-JS. Paraglide compiles each message into its own typed, tree-shakeable function, which gives stronger automatic type-safety today, but that compile-per-message model is a poor fit for a stated future intent: pulling translation keys from a CMS. react-i18next separates the `t()` call site from where resources come from (its "backend" plugin architecture), so a future CMS-backed loader can replace static JSON without touching any call site. We accept doing type-safety by hand (TS module augmentation on `CustomTypeOptions["resources"]`, sourced from the `en-US` JSON as the canonical shape) rather than getting it for free, in exchange for that swap-ability plus react-i18next's larger ecosystem/hiring pool.

Content scope is phased: Phase 1 is UI chrome only (static, dev-maintained translation files). Dynamic catalog content (`Product`/`Team`/`Character`/`Publisher` names and descriptions) and real currency conversion are explicitly **out of scope** — both require the backend to add per-locale/currency fields that don't exist today. Prices are formatted per-locale (`Intl.NumberFormat`) but stay denominated in USD.

Locale is resolved via a URL path segment (`/$locale/...`), which becomes the single source of truth while browsing — not a cookie read client-side after the fact. A bare/unprefixed URL resolves locale server-side (cookie → `Accept-Language` header → `en-US` default) and redirects before render, so SSR never ships a page in the wrong language. The cookie's only job is remembering the last choice for that redirect decision.

## Considered Options

- **react-i18next vs. Paraglide-JS** — react-i18next chosen: ecosystem maturity and a straightforward future path to a CMS-backed dynamic loader via its pluggable backend architecture, at the cost of hand-rolled type augmentation instead of Paraglide's automatic per-message typed functions.
- **Locale in the URL vs. cookie/header-only, no URL change** — URL-prefixed chosen: SEO (distinct indexable URLs per language), shareable/bookmarkable links, and deterministic SSR locale resolution with no cookie-timing ambiguity. Cost: restructuring the route tree with a leading `$locale` param wrapping all existing `(group)` directories.
- **Static JSON now vs. CMS-backed runtime fetch now** — static JSON chosen. The CMS is a stated future intent, not a confirmed requirement; wiring a dynamic backend today would trade away build-time key-parity checking for something not yet needed. When the CMS lands, the recommended path is a **build-time sync script** that writes CMS content into these same JSON files, preserving type-safety — not a runtime fetch, which would make keys unknowable at compile time.
- **Real currency conversion vs. locale-formatted display of the existing USD number** — formatting-only chosen: conversion needs a `currency` field on `Product`/`SKU`/`Order` that doesn't exist in the API today.
- **Translating dynamic catalog content now vs. deferring** — deferred, same backend-dependency reason as currency.
- **Localizing the admin panel vs. keeping it English-only** — English-only chosen: internal tool, no customer-facing SEO/UX value, keeps the translation namespace list a clean 1:1 with the five customer-facing domains (no `admin` namespace).

## Consequences

A new top-level `src/i18n/` directory (locale JSON under `src/i18n/locales/<locale>/{common,catalog,cart,checkout,orders,account}.json`, i18next config, per-request SSR init, and an `i18next.d.ts` type-augmentation file keyed off the `en-US` JSON) is added to the Module Structure convention (ADR-0010) alongside `src/api/`, `src/components/`, and `src/store/`. Locale _preference_ state (cookie-backed, mirroring the existing `authStore`/`cartStore` pattern) lives in `src/store/locale.ts`, not in `src/i18n/` — `src/i18n/` owns translation resources and config, `src/store/` owns app state, matching the existing split.

The route tree gains a leading `$locale` param wrapping every existing `(group)` directory. `src/test-utils.tsx`'s `renderRoute`/`renderWithProviders` wrap components in a real (non-mocked) `I18nextProvider` seeded with `en-US` resources, and `renderRoute` defaults its path to the `en-US` locale prefix — so the 44 existing test files that call `renderRoute("/some/path")` keep working unchanged.

Because react-i18next doesn't check key-parity across locales natively, a CI-enforced script diffs every non-default locale's namespace files against `en-US` (the source of truth) and fails the build on any missing key, rather than silently falling back at runtime.

Going forward, new or touched tests assert translated copy via the imported JSON value (`import en from ".../en-US/cart.json"`, then `getByText(en.empty)`) or via role/testid rather than a literal string, so a test breaks only when a _key_ changes, not when copy is merely reworded. The 44 existing hardcoded-string tests are not mass-rewritten on day one — this is enforced for new/touched code, mirroring how Chakra enforcement (ADR-0008) is a merge-time gate, not a retroactive one. e2e (Playwright) stays single-locale English per ADR-0009's "optional, lowest priority" stance — it is not part of "done" and is not multiplied by locale.

Explicitly deferred, tracked as follow-up work: backend-supplied per-locale catalog content, real multi-currency conversion, and a CMS-backed translation source (revisit the static-JSON loader in `src/i18n/` once that's a confirmed requirement).
