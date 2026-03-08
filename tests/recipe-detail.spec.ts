import { test, expect } from "@playwright/test";

test.describe("Recipe detail journey", () => {
  test("recipe page rendering, servings scaling, and Cook Now navigation", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)/recipe/boeuf-bourguignon");

    await test.step("hero, meta bar, servings stepper, ingredients, instructions, bottom bar", async () => {
      await expect(page.getByText("Boeuf Bourguignon")).toBeVisible();

      await expect(page.getByText("30")).toBeVisible();
      await expect(page.getByText("3h")).toBeVisible();
      await expect(page.getByText(/6 serving/)).toBeVisible();

      await expect(page.getByText("+")).toBeVisible();
      await expect(page.getByText("\u2212")).toBeVisible();

      await expect(page.getByText("Main", { exact: true })).toBeVisible();
      await expect(page.getByText("Stewing beef")).toBeVisible();
      await expect(
        page.getByText("Lardons", { exact: true }),
      ).toBeVisible();
      await expect(page.getByText("Pearl onions")).toBeVisible();
      await expect(page.getByText("Button mushrooms")).toBeVisible();

      await expect(page.getByText("Instructions")).toBeVisible();

      await expect(page.getByText(/Cook Now/)).toBeVisible();
      await expect(page.getByText("Add to Shopping List")).toBeVisible();
    });

    await test.step("servings stepper scales amounts", async () => {
      await page.getByText("+").click();
      await expect(page.getByText("7 servings")).toBeVisible();
    });

    await test.step("Cook Now navigates to chat with cook message", async () => {
      await page.getByText(/Cook Now/).click();
      await expect(
        page.getByText("Cook Boeuf Bourguignon now"),
      ).toBeVisible({ timeout: 10_000 });
    });

    expect(errors).toHaveLength(0);
  });

  test("invalid recipe ID shows not found", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)/recipe/nonexistent-recipe");
    await expect(page.getByText("Recipe not found")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });
});
