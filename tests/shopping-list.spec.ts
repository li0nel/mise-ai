import { test, expect } from "@playwright/test";

test.describe("Shopping list journey", () => {
  test("shopping page: items from multiple recipes, aisle groups, progress, sort modes, toggle", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // Items from Boeuf Bourguignon
    await expect(page.getByText(/Lardons/)).toBeVisible();
    await expect(page.getByText(/Stewing beef/)).toBeVisible();
    await expect(page.getByText("Beef stock")).toBeVisible();
    await expect(page.getByText("Tomato paste")).toBeVisible();

    // Items from Pad Thai
    await expect(page.getByText("Flat rice noodles")).toBeVisible();
    await expect(page.getByText("Prawns")).toBeVisible();
    await expect(page.getByText("Tamarind paste")).toBeVisible();

    // Aisle group headers
    await expect(page.getByText("Meat & Seafood")).toBeVisible();
    await expect(page.getByText("Pantry")).toBeVisible();
    await expect(page.getByText("Produce")).toBeVisible();

    // Progress bar
    await expect(page.getByText(/of \d+ items/)).toBeVisible();

    // Item amounts
    await expect(page.getByText(/500/)).toBeVisible();

    // Sort mode toggle
    await expect(page.getByText("By Recipe")).toBeVisible();
    await expect(page.getByText("By Aisle")).toBeVisible();

    // Toggle an item
    await page
      .getByText(/Full-bodied red wine/)
      .first()
      .click();

    expect(errors).toHaveLength(0);
  });

  test("clear checked: removes checked items, keeps unchecked, button hides when none left", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // Mock data has pre-checked items — Clear Checked button visible
    await expect(page.getByText(/Clear Checked/)).toBeVisible();

    // Verify both checked and unchecked items exist
    await expect(page.getByText("Stewing beef")).toBeVisible();
    await expect(page.getByText("Beef stock")).toBeVisible();

    // Click Clear Checked
    await page.getByText(/Clear Checked/).click();

    // Checked item gone, unchecked remain
    await expect(page.getByText("Stewing beef")).not.toBeVisible();
    await expect(page.getByText("Beef stock")).toBeVisible();

    // FAILURE MODE: button disappears when no checked items left
    await expect(page.getByText(/Clear Checked/)).not.toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("recipe page → add to shopping overlay → add items → done state persists → items appear in shopping list", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)/recipe/massaman-curry");
    await expect(page.getByText("Massaman Curry")).toBeVisible({
      timeout: 10_000,
    });

    // Add to Shopping List button in bottom bar
    await expect(page.getByText("Add to Shopping List")).toBeVisible();

    // Click → overlay opens with ingredient count
    await page.getByText("Add to Shopping List").click();
    await expect(page.getByText(/20 of 20 ingredients selected/)).toBeVisible({
      timeout: 5_000,
    });

    // Click Add Items button in overlay
    await page.getByText(/Add 20 Items to List/).click();

    // Done state: checkmark feedback, original button gone
    await expect(page.getByText(/\u2713.*Added to shopping list/)).toBeVisible({
      timeout: 3_000,
    });
    await expect(
      page.getByText("Add to Shopping List", { exact: true }),
    ).not.toBeVisible();

    // FAILURE MODE: done state persists (doesn't revert after 3s)
    await page.waitForTimeout(3_000);
    await expect(page.getByText(/Added to shopping list/)).toBeVisible();

    // Navigate to shopping list — items actually appear
    await page.getByLabel("Shopping list").click();
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/Garlic/).first()).toBeVisible();
    await expect(page.getByText(/Fish sauce/).first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
