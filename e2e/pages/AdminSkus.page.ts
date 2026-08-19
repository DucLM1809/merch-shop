import { type Locator, type Page } from "@playwright/test";

export class AdminSkusPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newSkuButton: Locator;
  readonly productSelect: Locator;
  readonly priceInput: Locator;
  readonly saveButton: Locator;
  readonly bulkFacetSelect: Locator;
  readonly bulkFacetValueSelect: Locator;
  readonly bulkAvailableSelect: Locator;
  readonly bulkApplyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // exact: true — "SKUs" is a substring of other admin headings' surrounding text, so a
    // non-exact match here would silently pass even after a redirect away from /admin/skus.
    this.heading = page.getByRole("heading", { name: "SKUs", exact: true });
    this.newSkuButton = page.getByRole("button", { name: "+ New SKU" });
    this.productSelect = page.getByLabel("Product");
    this.priceInput = page.getByLabel("Price");
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.bulkFacetSelect = page.getByLabel("Facet", { exact: true });
    this.bulkFacetValueSelect = page.getByLabel("Facet value");
    this.bulkAvailableSelect = page.getByLabel("Available");
    this.bulkApplyButton = page.getByRole("button", { name: "Apply" });
  }

  rowByProductName(productName: string): Locator {
    return this.page.locator('[data-testid^="sku-row-"]').filter({ hasText: productName });
  }

  rowById(id: string): Locator {
    return this.page.getByTestId(`sku-row-${id}`);
  }

  async idFor(productName: string): Promise<string> {
    const testId = await this.rowByProductName(productName).getAttribute("data-testid");
    if (!testId) throw new Error(`SKU row for "${productName}" is missing its data-testid.`);
    return testId.replace("sku-row-", "");
  }

  async createSku(productName: string, price: string): Promise<void> {
    await this.newSkuButton.click();
    await this.productSelect.selectOption({ label: productName });
    await this.priceInput.fill(price);
    await this.saveButton.click();
  }

  availabilityButton(id: string): Locator {
    return this.rowById(id).getByRole("button", { name: /^(Available|Unavailable)$/ });
  }

  async toggleAvailability(id: string): Promise<void> {
    await this.availabilityButton(id).click();
  }

  async applyBulkAvailability(
    facet: "game" | "team" | "character",
    facetValueLabel: string,
    available: boolean
  ): Promise<void> {
    await this.bulkFacetSelect.selectOption(facet);
    await this.bulkFacetValueSelect.selectOption({ label: facetValueLabel });
    await this.bulkAvailableSelect.selectOption(available ? "true" : "false");
    await this.bulkApplyButton.click();
  }

  async startDelete(id: string): Promise<void> {
    await this.rowById(id).getByRole("button", { name: "Delete" }).click();
  }

  async confirmDelete(id: string): Promise<void> {
    await this.rowById(id).getByRole("button", { name: "Confirm" }).click();
  }
}
