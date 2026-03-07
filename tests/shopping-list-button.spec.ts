import { test, expect } from "@playwright/test";

test.describe("Shopping list button navigation", () => {
  test("recipe page cart icon navigates to shopping", async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });

    // Click the shopping list button (cart icon)
    await page.getByLabel("Shopping list").click();
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("recipe page cart icon is clickable", async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });

    const cartButton = page.getByLabel("Shopping list");
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toBeEnabled();
  });

  test("shopping page loads from recipe navigation", async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });

    await page.getByLabel("Shopping list").click();
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // Should show shopping items
    await expect(page.getByText("Stewing beef")).toBeVisible();
  });

  test("no console errors on shopping navigation", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });

    await page.getByLabel("Shopping list").click();
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    expect(errors).toHaveLength(0);
  });
});
