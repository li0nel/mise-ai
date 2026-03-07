import { test, expect } from "@playwright/test";

test.describe("Cross-Screen Flows", () => {
  test("chat → recipe: can navigate from chat to recipe detail", async ({
    page,
  }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Show me Beef Bourguignon");
    await input.press("Enter");

    // Wait for mock conversation with recipe card
    await expect(page.getByText("View Full Recipe")).toBeVisible({
      timeout: 10_000,
    });

    // Click View Full Recipe — should navigate to recipe detail
    await page.getByText("View Full Recipe").click();
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("recipe detail page loads directly", async ({ page }) => {
    await page.goto("/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Stewing beef")).toBeVisible();
  });

  test("shopping page loads directly", async ({ page }) => {
    await page.goto("/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("chat page shows empty state initially", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Ready to cook?")).toBeVisible();
  });

  test("can navigate between main pages", async ({ page }) => {
    // Start on chat
    await page.goto("/");
    await expect(page.getByText("Ready to cook?")).toBeVisible();

    // Navigate to shopping
    await page.goto("/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // Navigate to a recipe
    await page.goto("/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });

    // Navigate back to chat
    await page.goto("/");
    // Chat should still work
    await expect(
      page.getByPlaceholder("Ask about recipes..."),
    ).toBeVisible();
  });
});
