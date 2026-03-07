import { test, expect } from "@playwright/test";

test.describe("Recipe Import Detection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
  });

  test("detects URL in chat input", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("https://www.example.com/recipes/chicken-tikka");
    await expect(input).toHaveValue(
      "https://www.example.com/recipes/chicken-tikka",
    );
  });

  test("sends URL as a regular message", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("https://www.example.com/recipes/pasta-carbonara");
    await input.press("Enter");

    // URL should appear as user message text (mock fallback loads full conversation)
    await expect(
      page.getByText("https://www.example.com/recipes/pasta-carbonara"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("sends recipe text as message", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("I want to cook pasta carbonara with eggs and pancetta");
    await input.press("Enter");

    await expect(
      page.getByText(
        "I want to cook pasta carbonara with eggs and pancetta",
      ),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("empty input does not send", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await expect(input).toHaveValue("");
    await input.press("Enter");

    // Should still show empty state
    await expect(page.getByText("Ready to cook?")).toBeVisible();
  });
});
