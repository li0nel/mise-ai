import { test, expect } from "@playwright/test";

test.describe("Recipe builder flow", () => {
  test("builder shows analysis, questions, and recipe ready state", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.getByText("Chicken curry").click();

    // Analysis phase
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    // Verdict appears after analysis
    await expect(page.getByText("Which protein would you like?")).toBeVisible({
      timeout: 15_000,
    });

    // Analyzed sources card
    await expect(page.getByText("Analyzed 47 sources")).toBeVisible();

    // Quick reply options visible
    await expect(
      page.getByText("\uD83D\uDC04 Beef (traditional)"),
    ).toBeVisible();
    await expect(page.getByText("\uD83C\uDF57 Chicken")).toBeVisible();
    await expect(page.getByText("\uD83E\uDED8 Tofu")).toBeVisible();
    await expect(page.getByText("\uD83E\uDD90 Shrimp")).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("answering all questions leads to recipe ready", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.getByText("Chicken curry").click();

    // Wait for first question
    await expect(page.getByText("Which protein would you like?")).toBeVisible({
      timeout: 15_000,
    });

    // Answer all 4 questions
    await page.getByText("\uD83D\uDC04 Beef (traditional)").click();
    await page.getByText("\u26A1 Weeknight express (45 min)").click();
    await page.getByText("\uD83C\uDFEA Store-bought (totally fine)").click();
    await page.getByText("\uD83C\uDF36\uFE0F\uD83C\uDF36\uFE0F Medium").click();

    // Recipe ready
    await expect(page.getByText("Your recipe is ready")).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByText("View Recipe \u2192")).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
