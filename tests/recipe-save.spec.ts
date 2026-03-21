import { test, expect } from "@playwright/test";

test.describe("Recipe save flow", () => {
  test("URL import saves and navigates to recipe detail", async ({
    page,
  }, testInfo) => {
    testInfo.setTimeout(30_000);
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");

    // Open search overlay and paste URL
    const searchBar = page.getByRole("textbox").first();
    await searchBar.click();
    await expect(page.getByText("Cancel")).toBeVisible({ timeout: 5_000 });

    const overlayInput = page.getByRole("textbox").last();
    await overlayInput.fill("https://hot-thai-kitchen.com/massaman-curry/");
    await overlayInput.press("Enter");

    // Wait for import to complete and navigate
    await expect(
      page.getByText("Weeknight Chicken Massaman Curry"),
    ).toBeVisible({ timeout: 15_000 });

    expect(errors).toHaveLength(0);
  });

  test("Seed recipe detail page shows recipe content", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/recipe/massaman-curry");

    // Recipe renders
    await expect(page.getByText("Massaman Curry").first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Beef chuck").first()).toBeVisible();
    await expect(page.getByText("Coconut milk").first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
