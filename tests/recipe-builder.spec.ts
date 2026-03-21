import { test, expect } from "@playwright/test";

test.describe("Recipe builder wizard (search entry)", () => {
  test("search -> analysis -> questions -> celebration -> view recipe", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    // Navigate to home
    await page.goto("/");
    await expect(page.getByText("Find any dish.")).toBeVisible();

    // Enter builder via search
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });
    const overlayInput = page.getByRole("textbox").last();
    await overlayInput.fill("Massaman Curry");
    await overlayInput.press("Enter");

    // Analyzing phase
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    // Wait for first question card (analysis -> conversing transition)
    await expect(page.getByText("Which protein?")).toBeVisible({
      timeout: 15_000,
    });

    // Verify options visible
    await expect(
      page.getByText("\uD83D\uDC04 Beef (traditional)"),
    ).toBeVisible();
    await expect(page.getByText("\uD83C\uDF57 Chicken")).toBeVisible();
    await expect(page.getByText("\uD83E\uDED8 Tofu")).toBeVisible();
    await expect(page.getByText("\uD83E\uDD90 Shrimp")).toBeVisible();

    // Verify analysis chip shows dish name and source count
    await expect(page.getByText(/Massaman Curry.*sources/)).toBeVisible();

    // Tap Chicken
    await page.getByText("\uD83C\uDF57 Chicken").click();

    // Q2: Cooking approach
    await expect(page.getByText("Cooking approach?")).toBeVisible({
      timeout: 10_000,
    });
    await page.getByText("\u26A1 Weeknight express (45 min)").click();

    // Q3: Curry paste
    await expect(page.getByText("Curry paste?")).toBeVisible({
      timeout: 10_000,
    });
    await page.getByText("\uD83C\uDFEA Store-bought (totally fine)").click();

    // Q4: Spice level
    await expect(page.getByText("Spice level?")).toBeVisible({
      timeout: 10_000,
    });
    await page.getByText("\uD83C\uDF36\uFE0F\uD83C\uDF36\uFE0F Medium").click();

    // Celebration
    await expect(page.getByText("Your recipe is ready")).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByText("View Recipe \u2192")).toBeVisible();

    // View recipe
    await page.getByText("View Recipe \u2192").click();
    await expect(
      page.getByText("Weeknight Chicken Massaman Curry"),
    ).toBeVisible({ timeout: 10_000 });

    expect(errors).toHaveLength(0);
  });

  test("progress bar visible during analyzing phase", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Enter builder via search
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });
    const overlayInput = page.getByRole("textbox").last();
    await overlayInput.fill("Massaman Curry");
    await overlayInput.press("Enter");

    // Analyzing phase
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    // CoT trace lines stream in (generated from Exa response)
    await expect(
      page.getByText(/Found \d+ sources across the web/),
    ).toBeVisible({ timeout: 10_000 });

    expect(errors).toHaveLength(0);
  });

  test("no chat input during analyzing phase", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Enter builder via search
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });
    const overlayInput = page.getByRole("textbox").last();
    await overlayInput.fill("Massaman Curry");
    await overlayInput.press("Enter");

    // Wait for analyzing phase to be active
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    // No TextInput during analyzing phase
    const textInputs = page.getByRole("textbox");
    await expect(textInputs).toHaveCount(0);

    // No chat placeholder
    await expect(page.locator("text=Ask about recipes")).not.toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
