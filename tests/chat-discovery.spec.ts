import { test, expect } from "@playwright/test";

test.describe("Recipe Discovery via Chat", () => {
  test("recipe card widget renders in chat", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Tell me about Beef Bourguignon");
    await input.press("Enter");

    // Mock conversation includes a recipe-card block for Boeuf Bourguignon
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("3h 30 min")).toBeVisible();
    await expect(page.getByText("6 servings")).toBeVisible();
    await expect(page.getByText("French")).toBeVisible();
  });

  test("recipe card shows action buttons", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Tell me about Beef Bourguignon");
    await input.press("Enter");

    await expect(page.getByText("Start Cooking")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("View Full Recipe")).toBeVisible();
  });

  test("recipe carousel renders multiple cards", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Tell me about Beef Bourguignon");
    await input.press("Enter");

    // Mock conversation includes a recipe-carousel with Pommes Puree, French Onion Soup, etc.
    await expect(page.getByText("Pommes Puree")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("French Onion Soup")).toBeVisible();
    await expect(page.getByText("Tarte Tatin")).toBeVisible();
  });

  test("tips widget renders cooking tips", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Tell me about Beef Bourguignon");
    await input.press("Enter");

    // Mock conversation includes tips about drying beef, good wine, small batches
    await expect(page.getByText("Dry the beef")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Use good wine")).toBeVisible();
    await expect(page.getByText("Brown in small batches")).toBeVisible();
  });
});
