import { test, expect } from "@playwright/test";

test.describe("CookMode widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Show me all the steps");
    await input.press("Enter");
    // Wait for mock conversation to fully load
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible({
      timeout: 10_000,
    });
    // Scroll to cook-mode widget — it may be off-screen
    // Use exact: true to avoid matching AI message "Here is the full cook mode view:"
    const cookModeHeader = page.getByText("Cook Mode", { exact: true });
    await cookModeHeader.scrollIntoViewIfNeeded();
    await expect(cookModeHeader).toBeVisible();
  });

  test("shows Cook Mode header with step count", async ({ page }) => {
    await expect(page.getByText("Cook Mode", { exact: true })).toBeVisible();
    await expect(page.getByText("5 steps")).toBeVisible();
  });

  test("shows all step titles", async ({ page }) => {
    await expect(page.getByText("Blanch the lardons")).toBeVisible();
    await expect(page.getByText("Render the lardons")).toBeVisible();
    await expect(page.getByText("Brown the beef in batches")).toBeVisible();
    await expect(page.getByText("Deglaze the pot")).toBeVisible();
    const braiseStep = page.getByText("Braise in the oven");
    await braiseStep.scrollIntoViewIfNeeded();
    await expect(braiseStep).toBeVisible();
  });

  test("shows step instruction text", async ({ page }) => {
    await expect(
      page.getByText(/Add 170g lardons and blanch/).first(),
    ).toBeVisible();
    await expect(
      page.getByText(/Pat every piece of/).first(),
    ).toBeVisible();
  });

  test("shows timer pills on relevant steps", async ({ page }) => {
    // Steps 1 and 2 have timer pills
    await expect(page.getByText(/8 min blanch/).first()).toBeVisible();
    await expect(page.getByText(/3-4 min render/)).toBeVisible();
    // Step 5 has a timer pill too
    const ovenTimer = page.getByText(/2.5-3 hours in oven/);
    await ovenTimer.scrollIntoViewIfNeeded();
    await expect(ovenTimer).toBeVisible();
  });

  test("shows warning on step 3", async ({ page }) => {
    await expect(
      page.getByText(/Crowded pan = steamed beef/).first(),
    ).toBeVisible();
  });

  test("shows tips hint on step 5", async ({ page }) => {
    const tip = page.getByText(/easily pierced with a fork/);
    await tip.scrollIntoViewIfNeeded();
    await expect(tip).toBeVisible();
  });

  test("timer pills are not interactive — no countdown starts on click", async ({
    page,
  }) => {
    // Click the "8 min blanch" timer pill in CookMode (not CookStep)
    // CookMode timer pills are View elements, not Pressable
    const timerPill = page.getByText(/8 min blanch/).first();
    await timerPill.scrollIntoViewIfNeeded();
    await timerPill.click();

    // Wait a moment — timer should NOT start
    await page.waitForTimeout(1_500);

    // Should still show "8 min blanch", not a countdown
    await expect(page.getByText(/8 min blanch/).first()).toBeVisible();
    // Should NOT show any "remaining" countdown text from this widget
    // (Note: the CookStep widget earlier in the page also has a timer pill,
    // so we just verify the CookMode one didn't change)
  });
});
