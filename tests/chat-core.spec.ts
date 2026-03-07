import { test, expect } from "@playwright/test";

test.describe("Chat screen", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to main chat (bypasses root auth redirect)
    await page.goto("/(main)");
  });

  test("shows empty state when no messages", async ({ page }) => {
    await expect(page.getByText("Ready to cook?")).toBeVisible();
    await expect(
      page.getByText(/Ask me anything about recipes/),
    ).toBeVisible();
  });

  test("has chat input bar", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await expect(input).toBeVisible();
  });

  test("shows app bar", async ({ page }) => {
    await expect(page.getByText("mise.")).toBeVisible();
  });

  test("sending a message loads conversation", async ({ page }) => {
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("What can I make with chicken?");
    await input.press("Enter");

    // Mock fallback loads MOCK_CHAT_MESSAGES when Gemini is not available
    // The empty state should disappear once messages are in the feed
    await expect(page.getByText("Ready to cook?")).not.toBeVisible({
      timeout: 10_000,
    });
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
