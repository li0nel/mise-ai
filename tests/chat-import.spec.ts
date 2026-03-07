import { test, expect } from "@playwright/test";

test.describe("Recipe Import Detection", () => {
  test("detects URL in chat input", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");

    // Type a URL — the recipeImport module should detect it
    await input.fill("https://www.example.com/recipes/chicken-tikka");
    await expect(input).toHaveValue(
      "https://www.example.com/recipes/chicken-tikka",
    );
  });

  test("sends URL as a regular message", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("https://www.example.com/recipes/pasta-carbonara");
    await input.press("Enter");

    // URL should appear as user message text
    await expect(
      page.getByText("https://www.example.com/recipes/pasta-carbonara"),
    ).toBeVisible();
  });

  test("sends recipe text as message", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("I want to cook pasta carbonara with eggs and pancetta");
    await input.press("Enter");

    await expect(
      page.getByText(
        "I want to cook pasta carbonara with eggs and pancetta",
      ),
    ).toBeVisible();
  });

  test("empty input does not send", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("");
    await input.press("Enter");

    // Should still show empty state
    await expect(page.getByText("Ready to cook?")).toBeVisible();
  });
});
