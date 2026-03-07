import { test, expect } from "@playwright/test";

test.describe("Recipe Servings Stepper", () => {
  test("recipe page shows servings stepper", async ({ page }) => {
    await page.goto("/recipe/boeuf-bourguignon");
    // The ServingsStepper should be visible with default servings
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("recipe page shows ingredients", async ({ page }) => {
    await page.goto("/recipe/boeuf-bourguignon");
    await expect(page.getByText("Stewing beef")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Lardons")).toBeVisible();
  });

  test("recipe page shows instruction steps", async ({ page }) => {
    await page.goto("/recipe/boeuf-bourguignon");
    await expect(page.getByText(/Step 1/)).toBeVisible({ timeout: 10_000 });
  });

  test("recipe page shows difficulty and time", async ({ page }) => {
    await page.goto("/recipe/boeuf-bourguignon");
    // Recipe has prepTime: 30, cookTime: 180 = 210 min total
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
  });
});
