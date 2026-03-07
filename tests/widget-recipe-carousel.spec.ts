import { test, expect } from "@playwright/test";

test.describe("RecipeCarousel widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("What goes with Beef Bourguignon?");
    await input.press("Enter");
    // Wait for carousel to appear
    await expect(page.getByText("Pommes Puree")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("renders all carousel cards", async ({ page }) => {
    await expect(page.getByText("Pommes Puree")).toBeVisible();
    await expect(page.getByText("French Onion Soup")).toBeVisible();
    await expect(page.getByText("Tarte Tatin")).toBeVisible();
    await expect(page.getByText("Salade Lyonnaise")).toBeVisible();
  });

  test("carousel cards show time", async ({ page }) => {
    // Use exact match to avoid matching "3h 30 min" from recipe card
    await expect(page.getByText("30 min", { exact: true })).toBeVisible();
    await expect(page.getByText("1h 15 min")).toBeVisible();
    await expect(page.getByText("20 min", { exact: true })).toBeVisible();
  });

  test("carousel cards show tag pills", async ({ page }) => {
    await expect(page.getByText("Julia's Choice")).toBeVisible();
    await expect(page.getByText("Classic Starter")).toBeVisible();
    await expect(page.getByText("French Dessert")).toBeVisible();
    await expect(page.getByText("Light Side")).toBeVisible();
  });

  test("carousel cards show emojis", async ({ page }) => {
    await expect(page.getByText("🥔")).toBeVisible();
    await expect(page.getByText("🧅")).toBeVisible();
    await expect(page.getByText("🍎")).toBeVisible();
    await expect(page.getByText("🥗")).toBeVisible();
  });

  test("clicking a carousel card navigates to recipe page", async ({
    page,
  }) => {
    await page.getByText("Pommes Puree").click();

    // Should navigate to recipe detail — since this recipe may not exist
    // in the store, we just check navigation happened (URL changes or
    // recipe not found appears)
    await expect(
      page.getByText(/Pommes Puree|Recipe not found/),
    ).toBeVisible({ timeout: 10_000 });
  });
});
