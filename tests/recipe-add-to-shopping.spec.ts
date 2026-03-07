import { test, expect } from "@playwright/test";

test.describe("Add to Shopping from Recipe", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("recipe page has add to shopping button", async ({ page }) => {
    await expect(
      page.getByText("Add to Shopping List"),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("add to shopping overlay shows ingredients", async ({ page }) => {
    // Click the "Add to Shopping List" button in bottom bar
    await page.getByText("Add to Shopping List").click();

    // Overlay header should be visible (Modal renders "Add to Shopping List" as title)
    // There will be two "Add to Shopping List" texts (button + overlay title)
    // The overlay also shows "ingredients selected"
    await expect(
      page.getByText(/ingredients selected/),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("overlay shows ingredient count", async ({ page }) => {
    await page.getByText("Add to Shopping List").click();

    // Boeuf Bourguignon has 13 ingredients total (7 Main + 6 Garnish)
    await expect(
      page.getByText(/13 of 13 ingredients selected/),
    ).toBeVisible({ timeout: 5_000 });
  });
});
