import { test, expect } from "@playwright/test";

test.describe("URL entry points", () => {
  test("search overlay opens and shows placeholder for URL", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.getByText("Find any dish.")).toBeVisible();

    // Click search bar to open overlay
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();

    // Overlay appears
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });

    // Placeholder in overlay mentions URL
    const overlayInput = page.getByRole("textbox").last();
    await expect(overlayInput).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("URL submission from search overlay starts import", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Type URL in main search bar — triggers overlay
    const searchBar = page.getByRole("textbox").first();
    await searchBar.fill("https://seriouseats.com/pad-thai-recipe");
    // The overlay now has focus; submit on the visible input
    await page.getByRole("textbox").last().press("Enter");

    // Import flow starts
    await expect(page.getByText("Importing recipe\u2026")).toBeVisible({
      timeout: 5_000,
    });
    await expect(
      page.getByText("seriouseats.com", { exact: true }),
    ).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("non-URL text does not start import", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Type non-URL text
    const searchBar = page.getByRole("textbox").first();
    await searchBar.fill("massaman curry");

    // Submit from overlay
    await page.getByRole("textbox").last().press("Enter");

    // Should NOT start import — still on home screen
    await expect(page.getByText("Find any dish.")).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
