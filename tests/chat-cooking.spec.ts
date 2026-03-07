import { test, expect } from "@playwright/test";

test.describe("Cooking Mode Widgets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Let's cook Beef Bourguignon");
    await input.press("Enter");
    // Wait for mock conversation to load
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("cook-step widget shows step number and total", async ({ page }) => {
    // Mock data has cook-step with stepNumber: 1, totalSteps: 5, progressPercent: 20
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible();
    await expect(page.getByText("20%")).toBeVisible();
  });

  test("cook-step widget shows instruction text", async ({ page }) => {
    // Text appears in both cook-step and cook-mode widgets, use .first()
    await expect(
      page.getByText(/Bring a medium pot of water to a boil/).first(),
    ).toBeVisible();
  });

  test("cook-step shows timer pill", async ({ page }) => {
    // Timer pill appears in both cook-step and cook-mode, use .first()
    await expect(page.getByText(/8 min blanch/).first()).toBeVisible();
  });

  test("cook-step shows action buttons", async ({ page }) => {
    await expect(page.getByText("Next Step")).toBeVisible();
    await expect(page.getByText("Show All Steps")).toBeVisible();
  });

  test("cook-mode widget shows all steps", async ({ page }) => {
    // The mock conversation includes cook-mode with 5 steps
    await expect(page.getByText("Blanch the lardons")).toBeVisible();
    await expect(page.getByText("Render the lardons")).toBeVisible();
    await expect(page.getByText("Brown the beef in batches")).toBeVisible();
    await expect(page.getByText("Deglaze the pot")).toBeVisible();
    await expect(page.getByText("Braise in the oven")).toBeVisible();
  });

  test("cook-mode shows warnings", async ({ page }) => {
    await expect(
      page.getByText(/Crowded pan = steamed beef/).first(),
    ).toBeVisible();
  });

  test("rescue widget shows recovery steps", async ({ page }) => {
    await expect(
      page.getByText("Sauce Recovery — Reduction Finish"),
    ).toBeVisible();
    await expect(
      page.getByText(/Remove beef with a slotted spoon/),
    ).toBeVisible();
    await expect(
      page.getByText(/Rapid boil the sauce uncovered/),
    ).toBeVisible();
  });

  test("timer pill is clickable to start timer", async ({ page }) => {
    const timerPill = page.getByText(/8 min blanch/).first();
    await expect(timerPill).toBeVisible();
    await timerPill.click();
    // After clicking, the timer should show countdown format "X:XX remaining"
    await expect(page.getByText(/\d+:\d+ remaining/)).toBeVisible({ timeout: 3_000 });
  });
});
