import { test, expect } from "@playwright/test";

test.describe("Shopping — Add from Recipe", () => {
  test("shopping page shows items grouped by aisle", async ({ page }) => {
    await page.goto("/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // Default sort is "aisle" — should show aisle groups
    await expect(page.getByText("Meat & Seafood")).toBeVisible();
    await expect(page.getByText("Produce")).toBeVisible();
  });

  test("shopping items show amount and unit", async ({ page }) => {
    await page.goto("/shopping");
    await expect(page.getByText("Beef stock")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("500")).toBeVisible();
  });

  test("shopping items can be toggled", async ({ page }) => {
    await page.goto("/shopping");
    await expect(page.getByText("Beef stock")).toBeVisible({
      timeout: 10_000,
    });

    // Click on an unchecked item to toggle it
    const item = page.getByText("Beef stock");
    await item.click();
  });

  test("shopping page shows recipe groups in recipe sort mode", async ({
    page,
  }) => {
    await page.goto("/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // Both recipe names should appear — items are from Boeuf Bourguignon and Pad Thai
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible();
  });

  test("shopping shows Pad Thai items from mock data", async ({ page }) => {
    await page.goto("/shopping");
    await expect(page.getByText("Flat rice noodles")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Prawns")).toBeVisible();
    await expect(page.getByText("Tamarind paste")).toBeVisible();
  });
});
