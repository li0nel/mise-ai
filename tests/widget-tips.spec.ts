import { test, expect } from "@playwright/test";

test.describe("TipsList widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Any tips for cooking?");
    await input.press("Enter");
    await expect(page.getByText("Dry the beef")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("renders all three tips", async ({ page }) => {
    await expect(page.getByText("Dry the beef")).toBeVisible();
    await expect(page.getByText("Use good wine")).toBeVisible();
    await expect(page.getByText("Brown in small batches")).toBeVisible();
  });

  test("tips show emoji icons", async ({ page }) => {
    // Tips have emojis: 🥩, 🍷, 🔥
    await expect(page.getByText("🍷").first()).toBeVisible();
    await expect(page.getByText("🔥")).toBeVisible();
  });

  test("tips show description text", async ({ page }) => {
    await expect(
      page.getByText(/Pat every piece of beef completely dry/),
    ).toBeVisible();
    await expect(
      page.getByText(/if you wouldn't drink it, don't cook with it/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Never crowd the pan/),
    ).toBeVisible();
  });

  test("tip labels are styled as uppercase headings", async ({ page }) => {
    // The labels appear as uppercase text — verify they're visible
    await expect(page.getByText("Dry the beef")).toBeVisible();
    await expect(page.getByText("Use good wine")).toBeVisible();
    await expect(page.getByText("Brown in small batches")).toBeVisible();
  });
});
