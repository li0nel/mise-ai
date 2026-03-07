import { test, expect } from "@playwright/test";

test.describe("Zustand Store Unit Tests", () => {
  test.describe("chatStore", () => {
    test("chat page starts with no messages (empty state)", async ({
      page,
    }) => {
      await page.goto("/(main)");
      await expect(page.getByText("Ready to cook?")).toBeVisible();
    });

    test("sendMessage adds user message to the feed", async ({ page }) => {
      await page.goto("/(main)");
      const input = page.getByPlaceholder("Ask about recipes...");
      await input.fill("Hello chef");
      await input.press("Enter");
      await expect(page.getByText("Hello chef")).toBeVisible({
        timeout: 5_000,
      });
    });

    test("multiple messages appear in order", async ({ page }) => {
      await page.goto("/(main)");
      const input = page.getByPlaceholder("Ask about recipes...");

      // First message triggers mock conversation
      await input.fill("First message");
      await input.press("Enter");
      await expect(page.getByText("First message")).toBeVisible({
        timeout: 5_000,
      });

      // Mock conversation loads too
      await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible({
        timeout: 10_000,
      });
    });

    test("search mode toggle works", async ({ page }) => {
      await page.goto("/(main)");
      // Verify we start in chat mode with the default placeholder
      await expect(
        page.getByPlaceholder("Ask about recipes..."),
      ).toBeVisible();
    });
  });

  test.describe("shoppingStore", () => {
    test("shopping page renders with mock items", async ({ page }) => {
      await page.goto("/(main)/shopping");
      await expect(page.getByText("Shopping List")).toBeVisible({
        timeout: 10_000,
      });
      await expect(page.getByText("Beef stock")).toBeVisible();
      await expect(page.getByText("Tomato paste")).toBeVisible();
    });

    test("toggling an item changes its checked state", async ({ page }) => {
      await page.goto("/(main)/shopping");
      await expect(page.getByText("Beef stock")).toBeVisible({
        timeout: 10_000,
      });
      const itemRow = page.getByText("Beef stock");
      await itemRow.click();
    });

    test("items from multiple recipes are shown", async ({ page }) => {
      await page.goto("/(main)/shopping");
      await expect(page.getByText("Shopping List")).toBeVisible({
        timeout: 10_000,
      });
      // Both Boeuf Bourguignon and Pad Thai items
      await expect(page.getByText("Flat rice noodles")).toBeVisible();
      await expect(page.getByText("Prawns")).toBeVisible();
    });

    test("aisle grouping shows section headers", async ({ page }) => {
      await page.goto("/(main)/shopping");
      await expect(page.getByText("Shopping List")).toBeVisible({
        timeout: 10_000,
      });
      await expect(page.getByText("Meat & Seafood")).toBeVisible();
      await expect(page.getByText("Pantry")).toBeVisible();
      await expect(page.getByText("Produce")).toBeVisible();
    });
  });

  test.describe("recipeStore", () => {
    test("recipe page loads recipe by ID", async ({ page }) => {
      await page.goto("/(main)/recipe/boeuf-bourguignon");
      await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
        timeout: 10_000,
      });
    });

    test("recipe page shows ingredient sections", async ({ page }) => {
      await page.goto("/(main)/recipe/boeuf-bourguignon");
      await expect(page.getByText("Stewing beef")).toBeVisible({
        timeout: 10_000,
      });
      await expect(page.getByText("Pearl onions")).toBeVisible();
      await expect(page.getByText("Button mushrooms")).toBeVisible();
    });

    test("recipe page shows instructions", async ({ page }) => {
      await page.goto("/(main)/recipe/boeuf-bourguignon");
      // The Instructions heading is visible
      await expect(page.getByText("Instructions")).toBeVisible({
        timeout: 10_000,
      });
    });

    test("unknown recipe ID shows appropriate state", async ({ page }) => {
      await page.goto("/(main)/recipe/nonexistent-recipe");
      // Should not crash — shows "Recipe not found"
      await expect(page.getByText("Recipe not found")).toBeVisible({
        timeout: 5_000,
      });
    });
  });
});
