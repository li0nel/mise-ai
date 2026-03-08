import { test, expect } from "@playwright/test";

test.describe("Chat widgets journey", () => {
  test("full-recipe widget renders with header, ingredients, steps, and quick-actions", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("How do I make potato puree?");
    await input.press("Enter");
    await expect(page.getByText("Classic Potato Puree")).toBeVisible({
      timeout: 10_000,
    });

    await test.step("full-recipe renders with complete metadata", async () => {
      await expect(page.getByText("Classic Potato Puree")).toBeVisible();
      await expect(page.getByText("🥔").first()).toBeVisible();
      await expect(page.getByText("4 servings")).toBeVisible();
      await expect(page.getByText("French", { exact: true })).toBeVisible();
      await expect(
        page.getByText(/Silky smooth mashed potatoes/),
      ).toBeVisible();
    });

    await test.step("ingredients section renders all items", async () => {
      await expect(page.getByText("Ingredients")).toBeVisible();
      await expect(page.getByText("Yukon Gold potatoes")).toBeVisible();
      await expect(page.getByText("Unsalted butter")).toBeVisible();
      await expect(page.getByText("Heavy cream")).toBeVisible();
      await expect(
        page.getByText("Salt and white pepper", { exact: true }),
      ).toBeVisible();
    });

    await test.step("steps section renders all steps with details", async () => {
      await expect(page.getByText("Steps")).toBeVisible();
      await expect(page.getByText("Prep potatoes")).toBeVisible();
      await expect(page.getByText("Boil until tender")).toBeVisible();
      await expect(page.getByText("Drain and dry")).toBeVisible();
      await expect(page.getByText("Rice and enrich")).toBeVisible();
    });

    await test.step("quick-action bubbles render with arrows", async () => {
      const variation = page.getByText("Show me a variation");
      await variation.scrollIntoViewIfNeeded();
      await expect(variation).toBeVisible();
      await expect(page.getByText("What to serve with this?")).toBeVisible();
      await expect(page.getByText("\u2192").first()).toBeVisible();
    });

    await test.step("quick-action click sends chat message", async () => {
      await page.getByText("Show me a variation").click();
      await expect(
        page.getByText("Show me a different variation of this recipe"),
      ).toBeVisible({ timeout: 10_000 });
    });

    expect(errors).toHaveLength(0);
  });

  test("Save to My Recipes shows feedback", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("How do I make potato puree?");
    await input.press("Enter");
    await expect(page.getByText("Save to My Recipes")).toBeVisible({
      timeout: 10_000,
    });

    await page.getByText("Save to My Recipes").click();
    await expect(page.getByText(/Saved to My Recipes/)).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });
});
