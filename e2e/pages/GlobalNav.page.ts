import { expect, type Locator, type Page } from "@playwright/test";

export class GlobalNavPage {
  readonly page: Page;

  readonly openDrawerButton: Locator;
  readonly desktopAccountMenu: Locator;
  readonly cartLink: Locator;

  readonly drawer: Locator;
  readonly drawerOverlay: Locator;
  readonly drawerCloseButton: Locator;
  readonly drawerCartLink: Locator;
  readonly drawerUsername: Locator;
  readonly drawerSignOutButton: Locator;
  readonly drawerGuestLinks: Locator;
  readonly drawerSignInLink: Locator;
  readonly drawerSignUpLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.openDrawerButton = page.getByRole("button", { name: "Open navigation" });
    this.desktopAccountMenu = page.getByTestId("nav-account-menu");
    // Scoped by href, not accessible name — the badge digit renders inside the same
    // link as the "Cart" text, so the computed name is ambiguous ("1 Cart" etc.).
    this.cartLink = page.locator('a[href="/cart"]').first();

    this.drawer = page.getByRole("dialog", { name: "Navigation menu" });
    this.drawerOverlay = page.getByTestId("nav-drawer-overlay");
    this.drawerCloseButton = this.drawer.getByRole("button", { name: "Close" });
    this.drawerCartLink = this.drawer.getByRole("link", { name: "Cart" });
    this.drawerUsername = this.drawer.getByTestId("drawer-username");
    this.drawerSignOutButton = this.drawer.getByRole("button", { name: "Sign out" });
    this.drawerGuestLinks = this.drawer.getByTestId("drawer-guest-links");
    this.drawerSignInLink = this.drawer.getByRole("link", { name: "Sign in" });
    this.drawerSignUpLink = this.drawer.getByRole("link", { name: "Sign up" });
  }

  cartBadgeCount(count: string): Locator {
    return this.cartLink.getByText(count, { exact: true });
  }

  async open(): Promise<void> {
    // The SSR'd button exists in the DOM before React finishes hydrating and attaching
    // its onClick handler (same race documented in e2e/global-setup.ts), so a click that
    // lands too early is a no-op. Retry through that window rather than guessing at a
    // fixed hydration delay.
    for (let attempt = 1; attempt <= 5; attempt++) {
      await this.openDrawerButton.click();
      try {
        await expect(this.drawer).toBeVisible({ timeout: 1000 });
        return;
      } catch {
        if (attempt === 5) throw new Error("Nav drawer button never hydrated after 5 attempts.");
      }
    }
  }

  async closeViaCloseButton(): Promise<void> {
    await this.drawerCloseButton.click();
    await expect(this.drawer).toBeHidden();
  }

  async closeViaEscape(): Promise<void> {
    await this.page.keyboard.press("Escape");
    await expect(this.drawer).toBeHidden();
  }

  async closeViaOverlay(): Promise<void> {
    const box = await this.drawerOverlay.boundingBox();
    if (!box) {
      throw new Error("Drawer overlay has no bounding box — is the drawer open?");
    }

    // Click a point clear of the 280px-wide drawer panel, which sits on top of the
    // overlay's left edge and would otherwise intercept the click.
    await this.drawerOverlay.click({ position: { x: box.width - 16, y: 16 } });
    await expect(this.drawer).toBeHidden();
  }

  async signOut(): Promise<void> {
    await this.drawerSignOutButton.click();
  }
}
