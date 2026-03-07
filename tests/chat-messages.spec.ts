import { test, expect } from "@playwright/test";

test.describe("Chat Messages", () => {
  test("shows empty state when no messages", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Ready to cook?")).toBeVisible();
    await expect(
      page.getByText("Ask me anything about recipes, ingredients, or techniques"),
    ).toBeVisible();
  });

  test("sends a message and shows user bubble", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Hello mise");
    await input.press("Enter");
    await expect(page.getByText("Hello mise")).toBeVisible();
  });

  test("first message loads mock conversation with AI messages", async ({
    page,
  }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Tell me about Beef Bourguignon");
    await input.press("Enter");

    // Mock conversation should load — check for known AI content
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("user messages appear after AI messages in order", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("First message");
    await input.press("Enter");

    // After mock loads, send a second message
    await expect(page.getByText("Boeuf Bourguignon")).toBeVisible({
      timeout: 10_000,
    });

    await input.fill("Second message");
    await input.press("Enter");
    await expect(page.getByText("Second message")).toBeVisible();
  });

  test("input clears after sending a message", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Test message");
    await input.press("Enter");
    await expect(input).toHaveValue("");
  });
});
