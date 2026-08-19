import { type Locator, type Page } from "@playwright/test";

export class AdminCharactersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newCharacterButton: Locator;
  readonly nameInput: Locator;
  readonly slugInput: Locator;
  readonly gameSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // exact: true — "Characters" is a substring of other admin headings' surrounding
    // text, so a non-exact match here would silently pass even after a redirect away
    // from /admin/characters.
    this.heading = page.getByRole("heading", { name: "Characters", exact: true });
    this.newCharacterButton = page.getByRole("button", { name: "+ New Character" });
    this.nameInput = page.getByLabel("Name");
    this.slugInput = page.getByLabel("Slug");
    this.gameSelect = page.getByLabel("Game");
    this.saveButton = page.getByRole("button", { name: "Save" });
  }

  rowByName(name: string): Locator {
    return this.page.locator('[data-testid^="character-row-"]').filter({ hasText: name });
  }

  rowById(id: string): Locator {
    return this.page.getByTestId(`character-row-${id}`);
  }

  async idFor(name: string): Promise<string> {
    const testId = await this.rowByName(name).getAttribute("data-testid");
    if (!testId) throw new Error(`Character row for "${name}" is missing its data-testid.`);
    return testId.replace("character-row-", "");
  }

  async createCharacter(name: string, slug: string): Promise<void> {
    await this.newCharacterButton.click();
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
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
