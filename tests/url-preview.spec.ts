import { test, expect } from "@playwright/test";

test.describe("URL preview extraction", () => {
  test("recipe URL shows preview card with title and emoji", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");

    const input = page.getByPlaceholder("Ask about recipes...");
    await expect(input).toBeVisible();

    // Type a recipe URL that maps to the Massaman mock
    await input.fill("https://hot-thai-kitchen.com/massaman-curry/");

    // Loading state
    await expect(page.getByText("Extracting recipe…")).toBeVisible({
      timeout: 5_000,
    });

    // Success state — title + emoji
    await expect(page.getByText("Massaman Curry")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("🍛")).toBeVisible();

    // Truncated URL shown
    await expect(
      page.getByText("hot-thai-kitchen.com/massaman-curry/"),
    ).toBeVisible();

    // Send the message
    await input.press("Enter");
    await expect(input).toHaveValue("");

    // User bubble with URL appears
    await expect(
      page.getByText("https://hot-thai-kitchen.com/massaman-curry/"),
    ).toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("non-recipe URL shows failure state", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");

    const input = page.getByPlaceholder("Ask about recipes...");
    await expect(input).toBeVisible();

    // Type a non-recipe URL
    await input.fill("https://www.example.com/about");

    // Loading state
    await expect(page.getByText("Extracting recipe…")).toBeVisible({
      timeout: 5_000,
    });

    // Failure state
    await expect(page.getByText("Not a recipe page")).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByText("This page does not contain a recipe."),
    ).toBeVisible();

    // User can dismiss
    await page.getByLabel("Dismiss preview").click();
    await expect(page.getByText("Not a recipe page")).not.toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("preview can be dismissed after success", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");

    const input = page.getByPlaceholder("Ask about recipes...");
    await expect(input).toBeVisible();

    // Type a recipe URL
    await input.fill("https://hot-thai-kitchen.com/massaman-curry/");

    // Wait for success
    await expect(page.getByText("Massaman Curry")).toBeVisible({
      timeout: 10_000,
    });

    // Dismiss
    await page.getByLabel("Dismiss preview").click();

    // Preview gone
    await expect(page.getByText("Massaman Curry")).not.toBeVisible();
    await expect(page.getByText("Extracting recipe…")).not.toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
