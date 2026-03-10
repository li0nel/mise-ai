import { test, expect } from "@playwright/test";

test.describe("Recipe save flow", () => {
  test("Save recipe from chat shows confirmation", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("make me a potato puree");
    await input.press("Enter");

    // Wait for the full-recipe widget to render
    await expect(page.getByText("Classic Potato Puree")).toBeVisible({
      timeout: 10_000,
    });

    // Click save button
    await page.getByText("Save to My Recipes").click();

    // Assert confirmation text appears
    await expect(page.getByText(/Saved to My Recipes/)).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });

  test("Tool call indicator appears for recipe queries", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("show me my saved recipes");
    await input.press("Enter");

    // Assert tool call indicator appears with recipe-related text
    await expect(page.getByText(/recipes/i).first()).toBeVisible({
      timeout: 10_000,
    });

    // Wait for AI response to complete
    await expect(page.getByText(/saved recipes/i).first()).toBeVisible({
      timeout: 10_000,
    });

    expect(errors).toHaveLength(0);
  });
});
