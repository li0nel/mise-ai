import { test, expect } from "@playwright/test";

test.describe("User journeys", () => {
  test("Paste URL → import → recipe detail", async ({ page }, testInfo) => {
    testInfo.setTimeout(30_000);
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    // Navigate to main
    await page.goto("/");
    await expect(page.getByText("Find any dish.")).toBeVisible();

    // Open search and paste URL
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });

    const overlayInput = page.getByRole("textbox").last();
    await overlayInput.fill("https://hot-thai-kitchen.com/massaman-curry/");
    await overlayInput.press("Enter");

    // Import loading screen
    await expect(page.getByText("Importing recipe\u2026")).toBeVisible({
      timeout: 5_000,
    });

    // Progress events stream
    await expect(page.getByText(/Fetching from/)).toBeVisible({
      timeout: 5_000,
    });

    // Auto-navigates to recipe detail
    await expect(
      page.getByText("Weeknight Chicken Massaman Curry"),
    ).toBeVisible({ timeout: 15_000 });

    expect(errors).toHaveLength(0);
  });

  test("Search overlay shows saved recipes and cancel works", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Open search overlay
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });

    // Empty state message
    await expect(
      page.getByText(/Paste a URL to import or search/),
    ).toBeVisible();

    // Cancel returns to home
    await page.getByText("Cancel").click();
    await expect(page.getByText("Find any dish.")).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("Import loading screen shows domain and progress", async ({
    page,
  }, testInfo) => {
    testInfo.setTimeout(30_000);
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Open search overlay and submit URL
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });

    const overlayInput = page.getByRole("textbox").last();
    await overlayInput.fill("https://seriouseats.com/massaman-curry-recipe");
    await overlayInput.press("Enter");

    // Loading screen appears with domain
    await expect(page.getByText("Importing recipe\u2026")).toBeVisible({
      timeout: 5_000,
    });
    await expect(
      page.getByText("seriouseats.com", { exact: true }),
    ).toBeVisible();

    // Progress messages update
    await expect(page.getByText(/Enriching/)).toBeVisible({
      timeout: 15_000,
    });

    expect(errors).toHaveLength(0);
  });
});
