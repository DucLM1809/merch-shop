import { type Locator, type Page } from "@playwright/test";

// Product cards render identically (LinkOverlay over the card, accessible name =
// product name) on the shop page, publisher page, and game page, so one page object
// covers all three instead of duplicating card locators per route. The homepage's
// "Featured Drops" rail uses the same card markup too, but its "Shop by Game" tiles
// don't — those are plain Cards, not `role="article"`, so they never match here.
export class CatalogPage {
  readonly page: Page;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.getByRole("article");
  }

  firstProductLink(): Locator {
    return this.productCards.first().getByRole("link");
  }

  // PublisherNav game links have no stable accessible name available to the test
  // (only game.name, which isn't known until a product's already been picked) — the
  // href encodes the same publisherSlug/gameSlug the test already has, so it's the
  // more precise identifier here.
  gameNavLink(publisherSlug: string, gameSlug: string): Locator {
    return this.page.locator(`nav a[href="/en-US/${publisherSlug}/${gameSlug}"]`);
  }
}
