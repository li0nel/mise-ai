import { test, expect } from "@playwright/test";

test.describe("Navigation journey", () => {
  test("full cross-screen flow: chat → recipe detail → cart icon → shopping list", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    // Start on chat — verify it loads
    await page.goto("/(main)");
    await expect(page.getByText("Ready to cook?")).toBeVisible();

    // Navigate to an existing recipe detail page (seed recipe)
    await page.goto("/recipe/massaman-curry");
    await expect(page.getByText("Massaman Curry").first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Beef chuck").first()).toBeVisible();

    // Navigate to shopping via cart icon
    await page.getByLabel("Shopping list").click();
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });
    // Mock shopping data has items from Boeuf Bourguignon and Pad Thai
    await expect(page.getByText("Lardons").first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("direct URL navigation: all pages load correctly, invalid recipe shows not found", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    // Chat page
    await page.goto("/(main)");
    await expect(page.getByText("Ready to cook?")).toBeVisible();
    await expect(page.getByPlaceholder("Ask about recipes...")).toBeVisible();

    // Recipe detail page (seed recipe)
    await page.goto("/recipe/massaman-curry");
    await expect(page.getByText("Massaman Curry")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Beef chuck").first()).toBeVisible();

    // Shopping page
    await page.goto("/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // FAILURE MODE: invalid recipe ID → not found
    await page.goto("/recipe/nonexistent-recipe");
    await expect(page.getByText("Recipe not found")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });
});
