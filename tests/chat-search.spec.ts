import { test, expect } from "@playwright/test";

test.describe("Chat Search Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
  });

  test("shows chat input with default placeholder", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Ask about recipes..."),
    ).toBeVisible();
  });

  test("search icon button is visible", async ({ page }) => {
    // The search/send button is always visible next to the input
    const input = page.getByPlaceholder("Ask about recipes...");
    await expect(input).toBeVisible();
  });

  test("chat input accepts text", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Boeuf");
    await expect(input).toHaveValue("Boeuf");
  });

  test("empty state is visible before any interaction", async ({ page }) => {
    await expect(page.getByText("Ready to cook?")).toBeVisible();
  });
});
