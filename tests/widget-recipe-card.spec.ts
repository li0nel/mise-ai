import { test, expect } from "@playwright/test";

test.describe("RecipeCard widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Show me Beef Bourguignon");
    await input.press("Enter");
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("renders recipe title and subtitle", async ({ page }) => {
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible();
    await expect(page.getByText("Julia Child's Classic")).toBeVisible();
  });

  test("renders star rating", async ({ page }) => {
    // Rating is 3 out of 5 stars — should have star characters
    const stars = page.getByText("★").first();
    await expect(stars).toBeVisible();
  });

  test("renders meta row with time, servings, and cuisine", async ({
    page,
  }) => {
    await expect(page.getByText("3h 30 min")).toBeVisible();
    await expect(
      page.getByText("6 servings", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText(/French/).first()).toBeVisible();
  });

  test("renders description text", async ({ page }) => {
    await expect(
      page.getByText(/Beef braised in Burgundy wine/),
    ).toBeVisible();
  });

  test("renders hero emoji", async ({ page }) => {
    await expect(page.getByText("🥩").first()).toBeVisible();
  });

  test("Start Cooking button sends chat message", async ({ page }) => {
    await page.getByText("Start Cooking").click();

    // Should inject "Cook Boeuf Bourguignon now" into chat
    await expect(
      page.getByText("Cook Boeuf Bourguignon now"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("View Full Recipe navigates to recipe page", async ({ page }) => {
    await page.getByText("View Full Recipe").click();

    // Should navigate to recipe detail page
    await expect(
      page.getByText("Instructions"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("no console errors on recipe card render", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Navigate to a fresh chat and trigger mock conversation
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Show me Beef Bourguignon");
    await input.press("Enter");
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible({
      timeout: 10_000,
    });

    expect(errors).toHaveLength(0);
  });
});
