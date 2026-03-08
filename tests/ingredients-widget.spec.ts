import { test, expect } from "@playwright/test";

test.describe("Ingredients widget journey", () => {
  test("full-recipe ingredients render with amounts and notes", async ({
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

    // Wait for full-recipe with ingredients
    await expect(page.getByText("Ingredients")).toBeVisible({
      timeout: 10_000,
    });

    await test.step("ingredient items render with amounts", async () => {
      await expect(page.getByText("Yukon Gold potatoes")).toBeVisible();
      await expect(page.getByText("Unsalted butter")).toBeVisible();
      await expect(page.getByText("Heavy cream")).toBeVisible();
      await expect(
        page.getByText("Salt and white pepper", { exact: true }),
      ).toBeVisible();
    });

    await test.step("ingredient notes render", async () => {
      await expect(page.getByText("cold, cubed")).toBeVisible();
      await expect(page.getByText("warmed")).toBeVisible();
    });

    await test.step("save button works", async () => {
      const saveButton = page.getByText("Save to My Recipes");
      await saveButton.scrollIntoViewIfNeeded();
      await expect(saveButton).toBeVisible();
      await saveButton.click();
      await expect(page.getByText(/Saved to My Recipes/)).toBeVisible({
        timeout: 3_000,
      });
    });

    expect(errors).toHaveLength(0);
  });
});
