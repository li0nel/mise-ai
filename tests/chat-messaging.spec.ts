import { test, expect } from "@playwright/test";

test.describe("Home screen and search journey", () => {
  test("empty state shows branding, search bar, and bottom navigation", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Tagline visible
    await expect(page.getByText("Find any dish.")).toBeVisible();
    await expect(page.getByText("Make it yours.")).toBeVisible();

    // App bar branding
    await expect(page.getByText("mise.")).toBeVisible();

    // Search bar present with URL placeholder
    const searchBar = page.getByRole("textbox").first();
    await expect(searchBar).toBeVisible();

    // Bottom navigation tabs
    await expect(page.getByRole("tab", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "My Recipes" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Shopping" })).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("search text triggers search suggestions overlay", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Click the search bar to open suggestions overlay
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();

    // Search suggestions overlay appears with its own input
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });

    // Cancel closes the overlay
    await page.getByText("Cancel").click();
    await expect(page.getByText("Find any dish.")).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
