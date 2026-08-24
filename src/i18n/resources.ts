import enGBCart from "./locales/en-GB/cart.json";
import enGBCatalog from "./locales/en-GB/catalog.json";
import enGBCheckout from "./locales/en-GB/checkout.json";
import enGBCommon from "./locales/en-GB/common.json";
import enGBOrders from "./locales/en-GB/orders.json";
import enUSCart from "./locales/en-US/cart.json";
import enUSCatalog from "./locales/en-US/catalog.json";
import enUSCheckout from "./locales/en-US/checkout.json";
import enUSCommon from "./locales/en-US/common.json";
import enUSOrders from "./locales/en-US/orders.json";
import frFRCart from "./locales/fr-FR/cart.json";
import frFRCatalog from "./locales/fr-FR/catalog.json";
import frFRCheckout from "./locales/fr-FR/checkout.json";
import frFRCommon from "./locales/fr-FR/common.json";
import frFROrders from "./locales/fr-FR/orders.json";

import type { SupportedLocale } from "./locales";

/**
 * Translation namespaces, one per customer-facing domain plus `common` for global chrome.
 * Domain namespaces arrive with the ticket that translates that domain; admin has none —
 * it stays English-only (ADR-0017).
 */
export const NAMESPACES = ["common", "catalog", "cart", "checkout", "orders"] as const;

export type Namespace = (typeof NAMESPACES)[number];

/** A namespace's copy: nested groups of strings, as authored in the locale JSON files. */
export type ResourceTree = Record<string, unknown>;

/**
 * Every locale's resources, bundled rather than fetched. They are small, and having them
 * in the bundle is what lets a locale render on its first pass with no loading state.
 *
 * Typing this as a total `Record` over the supported locales means adding a locale to
 * `SUPPORTED_LOCALES` without adding its files is a compile error, not a runtime fallback.
 */
export const resources: Record<SupportedLocale, Record<Namespace, ResourceTree>> = {
  "en-US": {
    common: enUSCommon,
    catalog: enUSCatalog,
    cart: enUSCart,
    checkout: enUSCheckout,
    orders: enUSOrders,
  },
  "en-GB": {
    common: enGBCommon,
    catalog: enGBCatalog,
    cart: enGBCart,
    checkout: enGBCheckout,
    orders: enGBOrders,
  },
  "fr-FR": {
    common: frFRCommon,
    catalog: frFRCatalog,
    cart: frFRCart,
    checkout: frFRCheckout,
    orders: frFROrders,
  },
};
