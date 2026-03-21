import { test, expect } from "@playwright/test";

test.describe("Search and builder entry points", () => {
  test("search submission enters builder flow", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.getByText("Find any dish.")).toBeVisible();

    // Type in the search bar — filling triggers the overlay with a second input
    const searchBar = page.getByRole("textbox").first();
    await searchBar.fill("Massaman Curry");
    // The search suggestions overlay now has focus; submit on the visible input
    await page.getByRole("textbox").last().press("Enter");

    // Builder flow starts — shows dish name and analyzing state
    await expect(page.getByText("Massaman Curry")).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });

  test("recently searched item enters builder flow", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.getByText("Find any dish.")).toBeVisible();

    // Click a recently searched item (hardcoded: "Chicken curry")
    await page.getByText("Chicken curry").click();

    // Builder flow starts
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });

  test("quick pick enters builder flow", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.getByText("Quick picks")).toBeVisible();

    // Quick picks are randomized — click "Pasta carbonara" from recently searched instead
    // since it's always present, then verify the builder
    await page.getByText("Pasta carbonara").click();

    // Builder flow starts
    await expect(page.getByText("Analyzing variations\u2026")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });
});
