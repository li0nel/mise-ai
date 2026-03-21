import { test, expect } from "@playwright/test";

test.describe("Recipe detail journey", () => {
  test("recipe page rendering and servings scaling", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/recipe/massaman-curry");

    await test.step("hero, meta bar, servings stepper, ingredients, instructions", async () => {
      await expect(page.getByText("Massaman Curry").first()).toBeVisible({
        timeout: 10_000,
      });

      await expect(page.getByText("20").first()).toBeVisible();
      await expect(page.getByText("1h 40").first()).toBeVisible();
      await expect(page.getByText(/4 serving/)).toBeVisible();

      await expect(page.getByText("+")).toBeVisible();
      await expect(page.getByText("\u2212")).toBeVisible();

      await expect(
        page.getByText("Curry Paste", { exact: true }),
      ).toBeVisible();
      await expect(page.getByText("Beef chuck").first()).toBeVisible();
      await expect(page.getByText("Coconut milk").first()).toBeVisible();
      await expect(page.getByText("Baby potatoes").first()).toBeVisible();
      await expect(page.getByText("Roasted peanuts").first()).toBeVisible();

      await expect(page.getByText("Instructions")).toBeVisible();

      // Unsaved recipe shows Save Recipe
      await expect(page.getByText("Save Recipe")).toBeVisible();
    });

    await test.step("servings stepper scales amounts", async () => {
      await page.getByText("+").click();
      await expect(page.getByText("5 servings")).toBeVisible();
    });

    await test.step("Save Recipe saves and reveals Cook Now buttons", async () => {
      await page.getByText("Save Recipe").click();

      // After saving, Cook Now and Add to Shopping List appear
      await expect(page.getByText(/Cook Now/)).toBeVisible({
        timeout: 5_000,
      });
      await expect(page.getByText("Add to Shopping List")).toBeVisible();
    });

    expect(errors).toHaveLength(0);
  });

  test("invalid recipe ID shows not found", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/recipe/nonexistent-recipe");
    await expect(page.getByText("Recipe not found")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });
});
