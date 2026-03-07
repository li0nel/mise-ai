import { test, expect } from "@playwright/test";

test.describe("Recipe page — Add to Shopping List full flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("full flow: button → overlay → add → button becomes done text", async ({
    page,
  }) => {
    // 1. Bottom bar shows "Add to Shopping List" as a button
    await expect(page.getByText("Add to Shopping List")).toBeVisible();

    // 2. Click the button — overlay opens
    await page.getByText("Add to Shopping List").click();
    await expect(
      page.getByText(/13 of 13 ingredients selected/),
    ).toBeVisible({ timeout: 5_000 });

    // 3. Click "Add 13 Items to List" in the overlay
    await page.getByText(/Add 13 Items to List/).click();

    // 4. Overlay closes, bottom bar button is now non-interactive done text
    await expect(
      page.getByText(/Added to shopping list/),
    ).toBeVisible({ timeout: 3_000 });

    // 5. Original button text should be gone
    await expect(
      page.getByText("Add to Shopping List", { exact: true }),
    ).not.toBeVisible();
  });

  test("done state shows checkmark", async ({ page }) => {
    await page.getByText("Add to Shopping List").click();
    await expect(page.getByText(/ingredients selected/)).toBeVisible({
      timeout: 5_000,
    });
    await page.getByText(/Add 13 Items to List/).click();

    // Should show "✓ Added to shopping list"
    await expect(
      page.getByText(/✓.*Added to shopping list/),
    ).toBeVisible({ timeout: 3_000 });
  });

  test("done state persists — does not revert", async ({ page }) => {
    await page.getByText("Add to Shopping List").click();
    await expect(page.getByText(/ingredients selected/)).toBeVisible({
      timeout: 5_000,
    });
    await page.getByText(/Add 13 Items to List/).click();

    await expect(
      page.getByText(/Added to shopping list/),
    ).toBeVisible({ timeout: 3_000 });

    // Wait 3 seconds — state should persist
    await page.waitForTimeout(3_000);
    await expect(
      page.getByText(/Added to shopping list/),
    ).toBeVisible();
  });

  test("items actually appear in shopping list after adding", async ({
    page,
  }) => {
    await page.getByText("Add to Shopping List").click();
    await expect(page.getByText(/ingredients selected/)).toBeVisible({
      timeout: 5_000,
    });
    await page.getByText(/Add 13 Items to List/).click();

    // Navigate to shopping list
    await page.getByLabel("Shopping list").click();
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // Recipe ingredients should appear in the shopping list
    await expect(page.getByText(/Garlic/).first()).toBeVisible();
    await expect(page.getByText(/Tomato paste/).first()).toBeVisible();
  });

  test("no console errors during add flow", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.getByText("Add to Shopping List").click();
    await expect(page.getByText(/ingredients selected/)).toBeVisible({
      timeout: 5_000,
    });
    await page.getByText(/Add 13 Items to List/).click();
    await expect(
      page.getByText(/Added to shopping list/),
    ).toBeVisible({ timeout: 3_000 });

    expect(errors).toHaveLength(0);
  });
});
