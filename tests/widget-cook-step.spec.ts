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

  test("Next Step button sends chat message", async ({ page }) => {
    await page.getByText("Next Step").click();

    // Should inject "Show me the next step" into chat
    await expect(
      page.getByText("Show me the next step"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("Show All Steps button sends chat message", async ({ page }) => {
    await page.getByText("Show All Steps").click();

    // Should inject "Show me all the steps" into chat
    await expect(
      page.getByText("Show me all the steps", { exact: true }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("timer pill is not re-clickable when running", async ({ page }) => {
    const timerPill = page.getByText(/8 min blanch/).first();
    await timerPill.click();

    // Wait for countdown to start
    await expect(page.getByText(/\d+:\d+ remaining/).first()).toBeVisible({
      timeout: 3_000,
    });

    // Record the current time
    const firstText = await page.getByText(/\d+:\d+ remaining/).first().textContent();

    // Wait 1 second
    await page.waitForTimeout(1_000);

    // Click the timer again — should not restart
    await page.getByText(/\d+:\d+ remaining/).first().click();

    // Wait another second
    await page.waitForTimeout(1_000);

    // Should still be counting down (not reset to 8:00)
    const laterText = await page.getByText(/\d+:\d+ remaining/).first().textContent();
    expect(laterText).not.toBe(firstText);
    // Verify it didn't reset — the remaining time should still be less than the original
    expect(laterText).not.toContain("8:00");
  });

  test("no console errors after button clicks", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Re-navigate to capture all errors
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Let's cook!");
    await input.press("Enter");
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible({
      timeout: 10_000,
    });

    await page.getByText("Next Step").click();
    await page.waitForTimeout(500);
    await page.getByText("Show All Steps").click();
    await page.waitForTimeout(500);

    expect(errors).toHaveLength(0);
  });
});
