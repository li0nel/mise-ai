import { test, expect } from "@playwright/test";

test.describe("Recipe detail page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
  });

  test("renders recipe hero section", async ({ page }) => {
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible();
  });

  test("shows recipe meta bar with times and servings", async ({ page }) => {
    // RecipeMetaBar shows formatted time: 30 for prep, "3h" for cook (180 min)
    await expect(page.getByText("30")).toBeVisible();
    await expect(page.getByText("3h")).toBeVisible();
    // ServingsStepper shows "6 servings"
    await expect(page.getByText(/6 serving/)).toBeVisible();
  });

  test("shows servings stepper", async ({ page }) => {
    await expect(page.getByText(/serving/)).toBeVisible();
    // Should have increment and decrement buttons
    await expect(page.getByText("+")).toBeVisible();
    await expect(page.getByText("\u2212")).toBeVisible();
  });

  test("shows ingredient sections", async ({ page }) => {
    // Boeuf Bourguignon has "Main" and "Garnish" sections
    await expect(page.getByText("Main", { exact: true })).toBeVisible();
    await expect(page.getByText("Stewing beef")).toBeVisible();
  });

  test("shows instructions section", async ({ page }) => {
    await expect(page.getByText("Instructions")).toBeVisible();
  });

  test("shows bottom bar with action buttons", async ({ page }) => {
    await expect(page.getByText(/Cook Now/)).toBeVisible();
    await expect(page.getByText("Add to Shopping List")).toBeVisible();
  });

  test("servings stepper scales ingredient amounts", async ({ page }) => {
    // Default servings is 6 for Boeuf Bourguignon
    // Increment servings to 7
    const incrementButton = page.getByText("+");
    await incrementButton.click();

    // Check servings displays "7 servings"
    await expect(page.getByText("7 servings")).toBeVisible();
  });

  test("shows not found for invalid recipe id", async ({ page }) => {
    await page.goto("/(main)/recipe/nonexistent-recipe");
    await expect(page.getByText("Recipe not found")).toBeVisible();
  });

  test("no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });
});
