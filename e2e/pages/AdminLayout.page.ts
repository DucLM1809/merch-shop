import { type Locator, type Page } from "@playwright/test";

// Mirrors NAV_ITEMS in src/modules/admin/components/AdminLayout.tsx.
export const ADMIN_NAV_ITEMS = [
  { label: "Orders", to: "/admin/orders" },
  { label: "Publishers", to: "/admin/publishers" },
  { label: "Games", to: "/admin/games" },
  { label: "Teams", to: "/admin/teams" },
  { label: "Characters", to: "/admin/characters" },
  { label: "Products", to: "/admin/products" },
  { label: "SKUs", to: "/admin/skus" },
] as const;

export class AdminLayoutPage {
  readonly page: Page;
  readonly nav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.getByRole("navigation");
  }

  // TanStack Router's <Link> stamps the active anchor with aria-current="page" itself
  // (see @tanstack/react-router/link.js STATIC_ACTIVE_PROPS), so this needs no
  // data-testid of its own.
  navLink(label: string): Locator {
    return this.nav.getByRole("link", { name: label });
  }
}
