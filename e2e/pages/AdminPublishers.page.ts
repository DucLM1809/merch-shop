import { type Locator, type Page } from "@playwright/test";

export class AdminPublishersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newPublisherButton: Locator;
  readonly nameInput: Locator;
  readonly slugInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // exact: true — "Publishers" could otherwise match a substring of a longer
    // heading elsewhere; keeping this strict guards against a silent pass after
    // a redirect away from /admin/publishers.
    this.heading = page.getByRole("heading", { name: "Publishers", exact: true });
    this.newPublisherButton = page.getByRole("button", { name: "+ New Publisher" });
    this.nameInput = page.getByLabel("Name");
    this.slugInput = page.getByLabel("Slug");
    this.saveButton = page.getByRole("button", { name: "Save" });
  }

  rowByName(name: string): Locator {
    return this.page.locator('[data-testid^="publisher-row-"]').filter({ hasText: name });
  }

  rowById(id: string): Locator {
    return this.page.getByTestId(`publisher-row-${id}`);
  }

  async idFor(name: string): Promise<string> {
    const testId = await this.rowByName(name).getAttribute("data-testid");
    if (!testId) throw new Error(`Publisher row for "${name}" is missing its data-testid.`);
    return testId.replace("publisher-row-", "");
  }

  async createPublisher(name: string, slug: string): Promise<void> {
    await this.newPublisherButton.click();
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
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
