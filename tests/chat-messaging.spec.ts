import { test, expect } from "@playwright/test";

test.describe("Chat messaging journey", () => {
  test("empty state → empty submit blocked → send message → AI responds → input clears", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");

    // Empty state visible
    await expect(page.getByText("Ready to cook?")).toBeVisible();
    await expect(page.getByText(/Ask me anything about recipes/)).toBeVisible();

    // App bar branding
    await expect(page.getByText("mise.")).toBeVisible();

    // Chat input present with placeholder
    const input = page.getByPlaceholder("Ask about recipes...");
    await expect(input).toBeVisible();

    // FAILURE MODE: empty input doesn't send
    await input.press("Enter");
    await expect(page.getByText("Ready to cook?")).toBeVisible();

    // Input accepts text
    await input.fill("Hello mise");
    await expect(input).toHaveValue("Hello mise");

    // Send message
    await input.press("Enter");

    // Input clears after send
    await expect(input).toHaveValue("");

    // User bubble appears
    await expect(page.getByText("Hello mise")).toBeVisible({
      timeout: 5_000,
    });

    // AI responds via streaming (mock AI greeting)
    await expect(page.getByText(/Welcome to Mise/).first()).toBeVisible({
      timeout: 10_000,
    });

    // Empty state gone
    await expect(page.getByText("Ready to cook?")).not.toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("URL and recipe text can be sent as messages", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");

    // Send a URL
    await input.fill("https://www.example.com/recipes/chicken-tikka");
    await input.press("Enter");
    await expect(
      page.getByText("https://www.example.com/recipes/chicken-tikka"),
    ).toBeVisible({ timeout: 10_000 });

    // AI responds about URL
    await expect(page.getByText(/recipe URL/).first()).toBeVisible({
      timeout: 10_000,
    });

    // Send recipe text
    await input.fill("I want to cook pasta carbonara with eggs and pancetta");
    await input.press("Enter");
    await expect(
      page.getByText("I want to cook pasta carbonara with eggs and pancetta"),
    ).toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });
});
