import { test, expect } from "@playwright/test";

test.describe("URL import flow", () => {
  test("paste URL → loading screen → progress messages → recipe detail", async ({
    page,
  }, testInfo) => {
    testInfo.setTimeout(30_000);
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Open search overlay by clicking search bar
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });

    // Paste a URL
    const overlayInput = page.getByRole("textbox").last();
    await overlayInput.fill("https://hot-thai-kitchen.com/massaman-curry/");
    await overlayInput.press("Enter");

    // Loading screen appears
    await expect(page.getByText("Importing recipe\u2026")).toBeVisible({
      timeout: 5_000,
    });
    await expect(
      page.getByText("hot-thai-kitchen.com", { exact: true }),
    ).toBeVisible();

    // Progress messages appear
    await expect(page.getByText(/Fetching from/)).toBeVisible({
      timeout: 5_000,
    });

    // Recipe imported and navigated to detail page
    await expect(
      page.getByText("Weeknight Chicken Massaman Curry"),
    ).toBeVisible({ timeout: 15_000 });

    expect(errors).toHaveLength(0);
  });

  test("back button aborts import and returns to home", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Open search overlay
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });

    // Paste a URL
    const overlayInput = page.getByRole("textbox").last();
    await overlayInput.fill("https://hot-thai-kitchen.com/massaman-curry/");
    await overlayInput.press("Enter");

    // Wait for import to start
    await expect(page.getByText("Importing recipe\u2026")).toBeVisible({
      timeout: 5_000,
    });

    // Click back
    await page.locator("[aria-label='Back'], [role='button']").first().click();

    // Back on home screen
    await expect(page.getByText("Find any dish.")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });
});
