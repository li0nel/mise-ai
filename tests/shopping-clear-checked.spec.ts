import { test, expect } from "@playwright/test";

test.describe("Shopping list Clear Checked", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("Clear Checked button appears when items are checked", async ({
    page,
  }) => {
    // Mock data has pre-checked items, so button should be visible
    await expect(page.getByText(/Clear Checked/)).toBeVisible();
  });

  test("Clear Checked button not visible when no items checked", async ({
    page,
  }) => {
    // Clear all checked items first
    await page.getByText(/Clear Checked/).click();

    // Now no items are checked, so button should disappear
    await expect(page.getByText(/Clear Checked/)).not.toBeVisible();
  });

  test("clicking Clear Checked removes checked items", async ({ page }) => {
    // Stewing beef is checked in mock data
    await expect(page.getByText("Stewing beef")).toBeVisible();

    // Click clear checked
    await page.getByText(/Clear Checked/).click();

    // Stewing beef (was checked) should be gone
    await expect(page.getByText("Stewing beef")).not.toBeVisible();
  });

  test("unchecked items remain after clearing", async ({ page }) => {
    // Beef stock is unchecked in mock data
    await expect(page.getByText("Beef stock")).toBeVisible();

    // Click clear checked
    await page.getByText(/Clear Checked/).click();

    // Checked item should be gone
    await expect(page.getByText("Stewing beef")).not.toBeVisible();
    // Unchecked item should remain
    await expect(page.getByText("Beef stock")).toBeVisible();
  });

  test("no console errors during clear operations", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Clear checked items
    await page.getByText(/Clear Checked/).click();

    expect(errors).toHaveLength(0);
  });
});
