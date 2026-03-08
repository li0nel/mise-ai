import { test, expect } from "@playwright/test";

test.describe("Navigation journey", () => {
  test("full cross-screen flow: chat → View Full Recipe → recipe detail → cart icon → shopping list", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    // Start on chat — send message to trigger mock conversation
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Show me Beef Bourguignon");
    await input.press("Enter");

    // Wait for recipe card with View Full Recipe
    await expect(page.getByText("View Full Recipe")).toBeVisible({
      timeout: 10_000,
    });

    // Navigate to recipe detail via View Full Recipe button
    await page.getByText("View Full Recipe").click();
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Stewing beef")).toBeVisible();

    // Navigate to shopping via cart icon
    await page.getByLabel("Shopping list").click();
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Stewing beef")).toBeVisible();

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
    await expect(
      page.getByPlaceholder("Ask about recipes..."),
    ).toBeVisible();

    // Recipe detail page
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Stewing beef")).toBeVisible();

    // Shopping page
    await page.goto("/(main)/shopping");
    await expect(page.getByText("Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    // FAILURE MODE: invalid recipe ID → not found
    await page.goto("/(main)/recipe/nonexistent-recipe");
    await expect(page.getByText("Recipe not found")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });
});
