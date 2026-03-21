import { test, expect } from "@playwright/test";

test.describe("Recipe detail content", () => {
  test("recipe page renders ingredients, steps, and metadata", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    // Navigate directly to the seed recipe
    await page.goto("/recipe/massaman-curry");

    await expect(page.getByText("Massaman Curry").first()).toBeVisible({
      timeout: 10_000,
    });

    // Verify recipe metadata
    await expect(page.getByText(/4 serving/).first()).toBeVisible();

    // Verify ingredients section
    await expect(page.getByText("Beef chuck").first()).toBeVisible();
    await expect(page.getByText("Coconut milk").first()).toBeVisible();
    await expect(page.getByText("Baby potatoes").first()).toBeVisible();
    await expect(page.getByText("Roasted peanuts").first()).toBeVisible();

    // Verify instructions section
    await expect(page.getByText("Instructions")).toBeVisible();

    // Unsaved recipe shows Save Recipe button (not Cook Now / Add to Shopping)
    await expect(page.getByText("Save Recipe")).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
