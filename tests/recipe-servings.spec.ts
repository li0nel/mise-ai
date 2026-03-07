import { test, expect } from "@playwright/test";

test.describe("Recipe Servings Stepper", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("recipe page shows servings stepper", async ({ page }) => {
    await expect(page.getByText(/6 serving/)).toBeVisible();
    await expect(page.getByText("+")).toBeVisible();
    await expect(page.getByText("\u2212")).toBeVisible();
  });

  test("recipe page shows ingredients", async ({ page }) => {
    await expect(page.getByText("Stewing beef")).toBeVisible();
    await expect(page.getByText("Lardons", { exact: true })).toBeVisible();
  });

  test("recipe page shows instruction steps", async ({ page }) => {
    // InstructionStep renders step number in a circle (just the number)
    // and the "Instructions" heading is visible
    await expect(page.getByText("Instructions")).toBeVisible();
  });

  test("recipe page shows difficulty and time", async ({ page }) => {
    // RecipeMetaBar shows: "30" (prep), "3h" (cook), "6" (serves), stars (level)
    await expect(page.getByText("30")).toBeVisible();
    await expect(page.getByText("3h")).toBeVisible();
  });
});
