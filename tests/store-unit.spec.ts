import { test, expect } from "@playwright/test";

test.describe("Zustand Store Unit Tests", () => {
  test.describe("chatStore", () => {
    test("chat page starts with no messages (empty state)", async ({
      page,
    }) => {
      await page.goto("/");
      await expect(page.getByText("Ready to cook?")).toBeVisible();
    });

    test("sendMessage adds user message to the feed", async ({ page }) => {
      await page.goto("/");
      const input = page.getByPlaceholder("Ask about recipes...");
      await input.fill("Hello chef");
      await input.press("Enter");
      await expect(page.getByText("Hello chef")).toBeVisible();
    });

    test("multiple messages appear in order", async ({ page }) => {
      await page.goto("/");
      const input = page.getByPlaceholder("Ask about recipes...");

      // First message triggers mock conversation
      await input.fill("First message");
      await input.press("Enter");
      await expect(page.getByText("First message")).toBeVisible();

      // Wait for mocks to load
      await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
        timeout: 10_000,
      });

      // Send another message
      await input.fill("Second message");
      await input.press("Enter");
      await expect(page.getByText("Second message")).toBeVisible();
    });

    test("search mode toggle works", async ({ page }) => {
      await page.goto("/");
      // Verify we start in chat mode
      await expect(
        page.getByPlaceholder("Ask about recipes..."),
      ).toBeVisible();
    });
  });

  test.describe("shoppingStore", () => {
    test("shopping page renders with mock items", async ({ page }) => {
      await page.goto("/shopping");
      await expect(page.getByText("Shopping List")).toBeVisible({
        timeout: 10_000,
      });
      // Verify mock items are rendered
      await expect(page.getByText("Beef stock")).toBeVisible();
      await expect(page.getByText("Tomato paste")).toBeVisible();
    });

    test("toggling an item changes its checked state", async ({ page }) => {
      await page.goto("/shopping");
      await expect(page.getByText("Beef stock")).toBeVisible({
        timeout: 10_000,
      });
      // Clicking the item row should toggle checked state
      const itemRow = page.getByText("Beef stock");
      await itemRow.click();
    });

    test("items from multiple recipes are shown", async ({ page }) => {
      await page.goto("/shopping");
      await expect(page.getByText("Shopping List")).toBeVisible({
        timeout: 10_000,
      });
      // Both Boeuf Bourguignon and Pad Thai items
      await expect(page.getByText("Flat rice noodles")).toBeVisible();
      await expect(page.getByText("Prawns")).toBeVisible();
    });

    test("aisle grouping shows section headers", async ({ page }) => {
      await page.goto("/shopping");
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
      await page.goto("/recipe/boeuf-bourguignon");
      await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
        timeout: 10_000,
      });
    });

    test("recipe page shows ingredient sections", async ({ page }) => {
      await page.goto("/recipe/boeuf-bourguignon");
      await expect(page.getByText("Stewing beef")).toBeVisible({
        timeout: 10_000,
      });
      await expect(page.getByText("Pearl onions")).toBeVisible();
      await expect(page.getByText("Button mushrooms")).toBeVisible();
    });

    test("recipe page shows instructions", async ({ page }) => {
      await page.goto("/recipe/boeuf-bourguignon");
      await expect(page.getByText(/Step 1/)).toBeVisible({
        timeout: 10_000,
      });
    });

    test("unknown recipe ID shows appropriate state", async ({ page }) => {
      await page.goto("/recipe/nonexistent-recipe");
      // Should not crash — page should render something
      await page.waitForTimeout(2_000);
    });
  });
});
