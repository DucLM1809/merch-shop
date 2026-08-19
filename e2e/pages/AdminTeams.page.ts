import { type Locator, type Page } from "@playwright/test";

export class AdminTeamsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newTeamButton: Locator;
  readonly nameInput: Locator;
  readonly slugInput: Locator;
  readonly gameSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // exact: true — "Teams" is a substring of other admin headings' surrounding
    // text, so a non-exact match here would silently pass even after a redirect away
    // from /admin/teams.
    this.heading = page.getByRole("heading", { name: "Teams", exact: true });
    this.newTeamButton = page.getByRole("button", { name: "+ New Team" });
    this.nameInput = page.getByLabel("Name");
    this.slugInput = page.getByLabel("Slug");
    this.gameSelect = page.getByLabel("Game");
    this.saveButton = page.getByRole("button", { name: "Save" });
  }

  rowByName(name: string): Locator {
    return this.page.locator('[data-testid^="team-row-"]').filter({ hasText: name });
  }

  rowById(id: string): Locator {
    return this.page.getByTestId(`team-row-${id}`);
  }

  async idFor(name: string): Promise<string> {
    const testId = await this.rowByName(name).getAttribute("data-testid");
    if (!testId) throw new Error(`Team row for "${name}" is missing its data-testid.`);
    return testId.replace("team-row-", "");
  }

  async createTeam(name: string, slug: string): Promise<void> {
    await this.newTeamButton.click();
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
