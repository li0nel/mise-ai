import { test, expect } from "@playwright/test";

test.describe("Add to Shopping from Recipe", () => {
  test("recipe page has add to shopping button", async ({ page }) => {
    await page.goto("/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
    // The RecipeBottomBar or overlay trigger should have an add button
    await expect(
      page.getByText(/Add.*Shopping/i),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("add to shopping overlay shows ingredients", async ({ page }) => {
    await page.goto("/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });

    // Click the add to shopping button
    const addButton = page.getByText(/Add.*Shopping/i).first();
    await addButton.click();

    // Overlay should show ingredient checkboxes
    await expect(
      page.getByText("Add to Shopping List"),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("overlay shows all ingredients selected by default", async ({
    page,
  }) => {
    await page.goto("/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });

    const addButton = page.getByText(/Add.*Shopping/i).first();
    await addButton.click();

    // Should show ingredient count in the overlay
    await expect(
      page.getByText(/ingredients selected/),
    ).toBeVisible({ timeout: 5_000 });
  });
});
