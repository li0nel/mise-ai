import { test, expect } from "@playwright/test";

test.describe("Ingredients widget — Add All to Shopping List", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("What ingredients do I need?");
    await input.press("Enter");
    // Wait for mock conversation with ingredients widget
    await expect(
      page.getByText("Add All to Shopping List"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("ingredients widget renders header with servings and item count", async ({
    page,
  }) => {
    // Header shows "🧂 Ingredients" and "6 servings · 13 items"
    await expect(page.getByText(/Ingredients/).first()).toBeVisible();
    await expect(page.getByText(/13 items/)).toBeVisible();
  });

  test("ingredients widget shows ingredient names", async ({ page }) => {
    await expect(page.getByText(/Lardons/).first()).toBeVisible();
    await expect(page.getByText(/Stewing beef/).first()).toBeVisible();
    await expect(page.getByText(/Full-bodied red wine/).first()).toBeVisible();
  });

  test("ingredients widget shows amounts and units", async ({ page }) => {
    // "170 g" for Lardons — use regex to match the full amount+unit text
    await expect(page.getByText(/170\s*g/).first()).toBeVisible();
    // "1.3 kg" for Stewing beef
    await expect(page.getByText(/1\.3\s*kg/).first()).toBeVisible();
  });

  test("ingredients widget shows ingredient notes", async ({ page }) => {
    await expect(
      page.getByText(/Chuck, brisket or beef cheek/),
    ).toBeVisible();
  });

  test("ingredients widget shows section headers", async ({ page }) => {
    await expect(page.getByText("Main", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Garnish", { exact: true })).toBeVisible();
  });

  test("clicking Add All shows permanent 'Added to shopping list' feedback", async ({
    page,
  }) => {
    await page.getByText("Add All to Shopping List").click();

    // Button should be replaced with permanent feedback text
    await expect(
      page.getByText(/Added to shopping list/),
    ).toBeVisible({ timeout: 3_000 });

    // Original button text should be gone
    await expect(
      page.getByText("Add All to Shopping List"),
    ).not.toBeVisible();
  });

  test("feedback text shows checkmark", async ({ page }) => {
    await page.getByText("Add All to Shopping List").click();

    // Should show "✓ Added to shopping list"
    await expect(
      page.getByText(/✓.*Added to shopping list/),
    ).toBeVisible({ timeout: 3_000 });
  });

  test("feedback state persists — does not revert after wait", async ({
    page,
  }) => {
    await page.getByText("Add All to Shopping List").click();

    await expect(
      page.getByText(/Added to shopping list/),
    ).toBeVisible({ timeout: 3_000 });

    // Wait 3 seconds — should still show feedback (permanent, not timed)
    await page.waitForTimeout(3_000);

    await expect(
      page.getByText(/Added to shopping list/),
    ).toBeVisible();
    await expect(
      page.getByText("Add All to Shopping List"),
    ).not.toBeVisible();
  });

  test("clicking Add All adds items to shopping store", async ({ page }) => {
    await page.getByText("Add All to Shopping List").click();
    await expect(
      page.getByText(/Added to shopping list/),
    ).toBeVisible({ timeout: 3_000 });

    // Navigate to shopping list
    await page.goto("/(main)/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // Ingredients from the recipe should now appear
    // Mock data has "Lardons (thick-cut pancetta or bacon)" as first item
    await expect(
      page.getByText(/Lardons/).first(),
    ).toBeVisible();
    await expect(
      page.getByText(/Tomato paste/).first(),
    ).toBeVisible();
  });

  test("no console errors during add to shopping flow", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.getByText("Add All to Shopping List").click();
    await expect(
      page.getByText(/Added to shopping list/),
    ).toBeVisible({ timeout: 3_000 });

    expect(errors).toHaveLength(0);
  });
});
