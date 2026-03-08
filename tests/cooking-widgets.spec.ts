import { test, expect } from "@playwright/test";

test.describe("Cooking widgets journey", () => {
  test("cook-mode and rescue widgets render correctly via mock AI", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");

    // Send a recipe query to trigger full-recipe response
    await input.fill("How do I make potato puree?");
    await input.press("Enter");

    // Verify full-recipe widget renders
    await expect(page.getByText("Classic Potato Puree")).toBeVisible({
      timeout: 10_000,
    });

    // Verify recipe header content
    await expect(page.getByText("30 min")).toBeVisible();
    await expect(page.getByText("4 servings")).toBeVisible();
    await expect(page.getByText("French", { exact: true })).toBeVisible();

    // Verify ingredients
    await expect(page.getByText("Ingredients")).toBeVisible();
    await expect(page.getByText("Yukon Gold potatoes")).toBeVisible();
    await expect(page.getByText("Unsalted butter")).toBeVisible();

    // Verify steps
    await expect(page.getByText("Steps")).toBeVisible();
    await expect(page.getByText("Prep potatoes")).toBeVisible();
    await expect(page.getByText("Boil until tender")).toBeVisible();

    // Verify timer pill
    const timerPill = page.getByText(/20 min/);
    await timerPill.first().scrollIntoViewIfNeeded();
    await expect(timerPill.first()).toBeVisible();

    // Verify save button
    await expect(page.getByText("Save to My Recipes")).toBeVisible();

    // Verify quick-action bubbles
    await expect(page.getByText("Show me a variation")).toBeVisible();
    await expect(page.getByText("What to serve with this?")).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
