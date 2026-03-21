import { test, expect } from "@playwright/test";

test.describe("Recipe save flow", () => {
  test("Complete builder flow and save recipe", async ({ page }) => {
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

    // View Recipe navigates to detail page
    await page.getByText("View Recipe \u2192").click();
    await expect(
      page.getByText("Weeknight Chicken Massaman Curry"),
    ).toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("Seed recipe detail page shows recipe content", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/recipe/massaman-curry");

    // Recipe renders
    await expect(page.getByText("Massaman Curry").first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Beef chuck").first()).toBeVisible();
    await expect(page.getByText("Coconut milk").first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
