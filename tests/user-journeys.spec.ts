import { test, expect } from "@playwright/test";

test.describe("User journeys", () => {
  test("Freeform recipe generation + save", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    // Navigate to main
    await page.goto("/(main)");
    await expect(page.getByText("Ready to cook?")).toBeVisible();

    // Send recipe query
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("How do I make potato puree?");
    await input.press("Enter");

    // Verify full-recipe widget renders
    await expect(page.getByText("Classic Potato Puree")).toBeVisible({
      timeout: 10_000,
    });

    // Verify all sections present
    await expect(page.getByText("Ingredients")).toBeVisible();
    await expect(page.getByText("Yukon Gold potatoes")).toBeVisible();
    await expect(page.getByText("Steps")).toBeVisible();
    await expect(page.getByText("Prep potatoes")).toBeVisible();
    await expect(page.getByText("Boil until tender")).toBeVisible();

    // Click save button
    const saveButton = page.getByText("Save to My Recipes");
    await saveButton.scrollIntoViewIfNeeded();
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Verify feedback
    await expect(page.getByText(/Saved to My Recipes/)).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });

  test("URL import journey", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");

    // Send URL
    await input.fill("https://www.example.com/recipes/chicken-tikka");
    await input.press("Enter");

    // Verify conversational response about URL
    await expect(page.getByText(/recipe URL/).first()).toBeVisible({
      timeout: 10_000,
    });

    // Send follow-up to trigger recipe generation
    await input.fill("How do I make potato puree?");
    await input.press("Enter");

    // Verify full-recipe block appears
    await expect(page.getByText("Classic Potato Puree")).toBeVisible({
      timeout: 10_000,
    });

    expect(errors).toHaveLength(0);
  });

  test("Quick action + refinement", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");

    // Send recipe query
    await input.fill("How do I make potato puree?");
    await input.press("Enter");

    // Verify full-recipe renders
    await expect(page.getByText("Classic Potato Puree")).toBeVisible({
      timeout: 10_000,
    });

    // Verify quick-action pills render with labels + arrows
    const variationAction = page.getByText("Show me a variation");
    await variationAction.scrollIntoViewIfNeeded();
    await expect(variationAction).toBeVisible();
    await expect(page.getByText("What to serve with this?")).toBeVisible();

    // Arrows visible
    const arrows = page.getByText("\u2192");
    await expect(arrows.first()).toBeVisible();

    // Click a chat-type quick-action — verify message injected into chat
    await variationAction.click();
    await expect(
      page.getByText("Show me a different variation of this recipe"),
    ).toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });
});
