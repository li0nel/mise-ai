import { test, expect } from "@playwright/test";

test.describe("Recipe Discovery via Chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
    // Send first message to trigger mock conversation fallback
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Tell me about Beef Bourguignon");
    await input.press("Enter");
    // Wait for mock conversation to load
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("recipe card widget renders in chat", async ({ page }) => {
    // Mock conversation includes a recipe-card block
    await expect(page.getByText("3h 30 min")).toBeVisible();
    await expect(page.getByText("6 servings", { exact: true })).toBeVisible();
    await expect(page.getByText(/French/).first()).toBeVisible();
  });

  test("recipe card shows action buttons", async ({ page }) => {
    await expect(page.getByText("Start Cooking")).toBeVisible();
    await expect(page.getByText("View Full Recipe")).toBeVisible();
  });

  test("recipe carousel renders multiple cards", async ({ page }) => {
    // Mock conversation includes a recipe-carousel
    await expect(page.getByText("Pommes Puree")).toBeVisible();
    await expect(page.getByText("French Onion Soup")).toBeVisible();
    await expect(page.getByText("Tarte Tatin")).toBeVisible();
  });

  test("tips widget renders cooking tips", async ({ page }) => {
    // Mock conversation includes tips
    await expect(page.getByText("Dry the beef")).toBeVisible();
    await expect(page.getByText("Use good wine")).toBeVisible();
    await expect(page.getByText("Brown in small batches")).toBeVisible();
  });
});
