import { test, expect } from "@playwright/test";

test.describe("CookStep widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Let's cook!");
    await input.press("Enter");
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("shows step progress header with step number and percentage", async ({
    page,
  }) => {
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible();
    await expect(page.getByText("20%")).toBeVisible();
  });

  test("shows instruction text", async ({ page }) => {
    await expect(
      page.getByText(/Bring a medium pot of water to a boil/).first(),
    ).toBeVisible();
  });

  test("shows timer pill in idle state", async ({ page }) => {
    await expect(page.getByText(/8 min blanch/).first()).toBeVisible();
  });

  test("timer pill starts countdown on click", async ({ page }) => {
    // Click the timer pill in the cook-step widget (first one)
    const timerPill = page.getByText(/8 min blanch/).first();
    await timerPill.click();

    // Should switch to countdown format
    await expect(page.getByText(/\d+:\d+ remaining/).first()).toBeVisible({
      timeout: 3_000,
    });
  });

  test("timer countdown decrements over time", async ({ page }) => {
    const timerPill = page.getByText(/8 min blanch/).first();
    await timerPill.click();

    // Should show "8:00 remaining" initially
    await expect(page.getByText(/8:00 remaining/).first()).toBeVisible({
      timeout: 3_000,
    });

    // Wait 2 seconds and verify time has decreased
    await page.waitForTimeout(2_000);
    // Should no longer show 8:00 — it should be 7:58 or 7:57
    await expect(page.getByText(/7:5\d remaining/).first()).toBeVisible({
      timeout: 3_000,
    });
  });

  test("shows Next Step action button", async ({ page }) => {
    await expect(page.getByText("Next Step")).toBeVisible();
  });

  test("shows Show All Steps action button", async ({ page }) => {
    await expect(page.getByText("Show All Steps")).toBeVisible();
  });
});
