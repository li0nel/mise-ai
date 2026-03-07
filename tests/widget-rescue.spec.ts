import { test, expect } from "@playwright/test";

test.describe("RescueWidget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("The sauce seems thin");
    await input.press("Enter");
    await expect(
      page.getByText("Sauce Recovery — Reduction Finish"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("renders rescue title with icon", async ({ page }) => {
    await expect(
      page.getByText("Sauce Recovery — Reduction Finish"),
    ).toBeVisible();
    await expect(page.getByText("🍷").first()).toBeVisible();
  });

  test("shows all 4 recovery steps", async ({ page }) => {
    await expect(
      page.getByText(/Remove beef with a slotted spoon/),
    ).toBeVisible();
    await expect(
      page.getByText(/Rapid boil the sauce uncovered/),
    ).toBeVisible();
    await expect(
      page.getByText(/Taste and adjust with salt/),
    ).toBeVisible();
    await expect(
      page.getByText(/Finish with cold butter/),
    ).toBeVisible();
  });

  test("recovery steps are numbered 1 through 4", async ({ page }) => {
    // Each step has a numbered circle
    for (let i = 1; i <= 4; i++) {
      await expect(
        page.getByText(String(i), { exact: true }).first(),
      ).toBeVisible();
    }
  });

  test("step 2 mentions reduction time", async ({ page }) => {
    await expect(
      page.getByText(/12-15 minutes/),
    ).toBeVisible();
  });

  test("step 4 mentions montee au beurre technique", async ({ page }) => {
    await expect(
      page.getByText(/montee au beurre/i),
    ).toBeVisible();
  });
});
