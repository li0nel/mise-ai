import { test, expect } from "@playwright/test";

test.describe("Recipe detail journey", () => {
  test("recipe page rendering, servings scaling, and Cook Now navigation", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)/recipe/massaman-curry");

    await test.step("hero, meta bar, servings stepper, ingredients, instructions, bottom bar", async () => {
      await expect(page.getByText("Massaman Curry")).toBeVisible();

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

      await expect(page.getByText(/Cook Now/)).toBeVisible();
      await expect(page.getByText("Add to Shopping List")).toBeVisible();
    });

    await test.step("servings stepper scales amounts", async () => {
      await page.getByText("+").click();
      await expect(page.getByText("5 servings")).toBeVisible();
    });

    await test.step("Cook Now navigates to chat with cook message", async () => {
      await page.getByText(/Cook Now/).click();
      await expect(page.getByText("Cook Massaman Curry now")).toBeVisible({
        timeout: 10_000,
      });
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
