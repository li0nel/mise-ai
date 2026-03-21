import { test, expect } from "@playwright/test";

test.describe("Ingredients on recipe detail", () => {
  test("recipe ingredients render with amounts and notes", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/recipe/massaman-curry");

    // Wait for ingredients section
    await expect(page.getByText("Curry Paste", { exact: true })).toBeVisible({
      timeout: 10_000,
    });

    await test.step("ingredient items render", async () => {
      await expect(page.getByText("Beef chuck").first()).toBeVisible();
      await expect(page.getByText("Coconut milk").first()).toBeVisible();
      await expect(page.getByText("Baby potatoes").first()).toBeVisible();
      await expect(page.getByText("Roasted peanuts").first()).toBeVisible();
    });

    await test.step("curry paste section ingredients render", async () => {
      await expect(page.getByText("Dried chillies").first()).toBeVisible();
      await expect(page.getByText("Lemongrass").first()).toBeVisible();
      await expect(page.getByText("Galangal").first()).toBeVisible();
    });

    expect(errors).toHaveLength(0);
  });
});
