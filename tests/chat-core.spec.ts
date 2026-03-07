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
    // The chat input should be present
    const input = page.getByPlaceholder(/recipe|cook|ask|message/i);
    await expect(input).toBeVisible();
  });

  test("shows app bar", async ({ page }) => {
    // The app bar with brand name should be visible
    await expect(page.getByText("mise.")).toBeVisible();
  });

  test("sending a message loads conversation", async ({ page }) => {
    // Find the input and type a message
    const input = page.locator('input[type="text"], textarea').first();
    await input.fill("What can I make with chicken?");

    // Submit (press Enter or click send button)
    await input.press("Enter");

    // The empty state should disappear and messages should appear
    await expect(page.getByText("Ready to cook?")).not.toBeVisible({
      timeout: 5000,
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
