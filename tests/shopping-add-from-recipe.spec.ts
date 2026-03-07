import { test, expect } from "@playwright/test";

test.describe("Shopping — Add from Recipe", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("shopping page shows items grouped by aisle", async ({ page }) => {
    // Default sort is "aisle" — should show aisle group headers
    await expect(page.getByText("Meat & Seafood")).toBeVisible();
    await expect(page.getByText("Produce")).toBeVisible();
  });

  test("shopping items show amount and unit", async ({ page }) => {
    await expect(page.getByText("Beef stock")).toBeVisible();
    // Beef stock amount is "500 ml"
    await expect(page.getByText(/500/)).toBeVisible();
  });

  test("shopping items can be toggled", async ({ page }) => {
    // Click on an item to toggle it
    const item = page.getByText("Beef stock");
    await expect(item).toBeVisible();
    await item.click();
  });

  test("shopping page has recipe sort mode", async ({ page }) => {
    // The sort toggle has "By Recipe" and "By Aisle" buttons
    await expect(page.getByText("By Recipe")).toBeVisible();
    await expect(page.getByText("By Aisle")).toBeVisible();
  });

  test("shopping shows Pad Thai items from mock data", async ({ page }) => {
    await expect(page.getByText("Flat rice noodles")).toBeVisible();
    await expect(page.getByText("Prawns")).toBeVisible();
    await expect(page.getByText("Tamarind paste")).toBeVisible();
  });
});
