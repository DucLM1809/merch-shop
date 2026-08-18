import { type Locator, type Page } from "@playwright/test";

export class AdminGamesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newGameButton: Locator;
  readonly nameInput: Locator;
  readonly slugInput: Locator;
  readonly publisherSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // exact: true — "Games" is a substring of other admin headings' surrounding text,
    // so a non-exact match here would silently pass even after a redirect away from
    // /admin/games.
    this.heading = page.getByRole("heading", { name: "Games", exact: true });
    this.newGameButton = page.getByRole("button", { name: "+ New Game" });
    this.nameInput = page.getByLabel("Name");
    this.slugInput = page.getByLabel("Slug");
    this.publisherSelect = page.getByLabel("Publisher");
    this.saveButton = page.getByRole("button", { name: "Save" });
  }

  rowByName(name: string): Locator {
    return this.page.locator('[data-testid^="game-row-"]').filter({ hasText: name });
  }

  rowById(id: string): Locator {
    return this.page.getByTestId(`game-row-${id}`);
  }

  async idFor(name: string): Promise<string> {
    const testId = await this.rowByName(name).getAttribute("data-testid");
    if (!testId) throw new Error(`Game row for "${name}" is missing its data-testid.`);
    return testId.replace("game-row-", "");
  }

  async createGame(name: string, slug: string): Promise<void> {
    await this.newGameButton.click();
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
    // Index 0 is the "Publisher…" placeholder — any real publisher works for this
    // smoke test.
    await this.publisherSelect.selectOption({ index: 1 });
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
