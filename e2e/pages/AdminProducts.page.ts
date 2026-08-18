import { type Locator, type Page } from "@playwright/test";

export class AdminProductsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newProductButton: Locator;
  readonly nameInput: Locator;
  readonly gameSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // exact: true — "Products" is a substring of the catalog homepage's "All Products"
    // heading, so a non-exact match here would silently pass even after a redirect away
    // from /admin/products.
    this.heading = page.getByRole("heading", { name: "Products", exact: true });
    this.newProductButton = page.getByRole("button", { name: "+ New Product" });
    this.nameInput = page.getByLabel("Name");
    this.gameSelect = page.getByLabel("Game");
    this.saveButton = page.getByRole("button", { name: "Save" });
  }

  rowByName(name: string): Locator {
    return this.page.locator('[data-testid^="product-row-"]').filter({ hasText: name });
  }

  rowById(id: string): Locator {
    return this.page.getByTestId(`product-row-${id}`);
  }

  async idFor(name: string): Promise<string> {
    const testId = await this.rowByName(name).getAttribute("data-testid");
    if (!testId) throw new Error(`Product row for "${name}" is missing its data-testid.`);
    return testId.replace("product-row-", "");
  }

  async createProduct(name: string): Promise<void> {
    await this.newProductButton.click();
    await this.nameInput.fill(name);
    // Index 0 is the "Game…" placeholder — any real game works for this smoke test.
    await this.gameSelect.selectOption({ index: 1 });
    await this.saveButton.click();
  }

  async startEdit(id: string): Promise<void> {
    await this.rowById(id).getByRole("button", { name: "Edit" }).click();
  }

  async startDelete(id: string): Promise<void> {
    await this.rowById(id).getByRole("button", { name: "Delete" }).click();
  }

  async confirmDelete(id: string): Promise<void> {
    await this.rowById(id).getByRole("button", { name: "Confirm" }).click();
  }
}
