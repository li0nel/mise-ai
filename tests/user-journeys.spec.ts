import { test, expect } from "@playwright/test";

test.describe("User journeys", () => {
  test("Search → builder → answer questions → recipe ready", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    // Navigate to main
    await page.goto("/");
    await expect(page.getByText("Find any dish.")).toBeVisible();

    // Select a recently searched item (stable) to enter builder flow
    await page.getByText("Chicken curry").click();

    // Analyzing phase
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    // Wait for analysis to complete and conversing phase to start
    // Mock streams 11 CoT lines at 600ms intervals + 400ms transition ≈ 7s
    await expect(page.getByText("Which protein would you like?")).toBeVisible({
      timeout: 15_000,
    });

    // Answer first question by clicking a quick reply
    await page.getByText("\uD83D\uDC04 Beef (traditional)").click();

    // Second question appears
    await expect(
      page.getByText(/slow-cook version or something quicker/),
    ).toBeVisible({ timeout: 5_000 });
    await page.getByText("\u26A1 Weeknight express (45 min)").click();

    // Third question
    await expect(page.getByText(/Homemade or store-bought/)).toBeVisible({
      timeout: 5_000,
    });
    await page.getByText("\uD83C\uDFEA Store-bought (totally fine)").click();

    // Fourth question — spice level
    await expect(page.getByText(/How spicy do you want it/)).toBeVisible({
      timeout: 5_000,
    });
    await page.getByText("\uD83C\uDF36\uFE0F\uD83C\uDF36\uFE0F Medium").click();

    // Recipe ready celebration
    await expect(page.getByText("Your recipe is ready")).toBeVisible({
      timeout: 5_000,
    });

    // Click View Recipe
    await page.getByText("View Recipe \u2192").click();

    // Navigated to recipe detail page
    await expect(
      page.getByText("Weeknight Chicken Massaman Curry"),
    ).toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("Recently searched item enters builder", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Click a recently searched item (use exact match to avoid quick pick collision)
    await page.getByText("Pad Thai", { exact: true }).click();

    // Builder flow starts
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });

  test("Builder analyzing phase shows CoT lines", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Enter builder via recently searched
    await page.getByText("Chicken curry").click();

    // Analyzing phase starts
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    // CoT lines stream in
    await expect(
      page.getByText("Searching the web for massaman curry recipes\u2026"),
    ).toBeVisible({ timeout: 10_000 });

    expect(errors).toHaveLength(0);
  });
});
