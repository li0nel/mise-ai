import { test, expect } from "@playwright/test";

test.describe("Chat Messages", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/(main)");
  });

  test("shows empty state when no messages", async ({ page }) => {
    await expect(page.getByText("Ready to cook?")).toBeVisible();
    await expect(
      page.getByText("Ask me anything about recipes, ingredients, or techniques"),
    ).toBeVisible();
  });

  test("sends a message and shows user bubble", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Hello mise");
    await input.press("Enter");
    // Mock fallback prepends user message then mock messages
    await expect(page.getByText("Hello mise")).toBeVisible({ timeout: 5_000 });
  });

  test("first message loads mock conversation with AI messages", async ({
    page,
  }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Tell me about Beef Bourguignon");
    await input.press("Enter");

    // Mock fallback loads MOCK_CHAT_MESSAGES which contain "Boeuf Bourguignon"
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("user messages appear after mock AI messages", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("First message");
    await input.press("Enter");

    // After mock loads, verify both user message and AI content present
    await expect(page.getByText("First message")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible();
  });

  test("input clears after sending a message", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Test message");
    await input.press("Enter");
    await expect(input).toHaveValue("");
  });
});
