import { test, expect } from "@playwright/test";

test.describe("Cook Now flow", () => {
  test("recipe page Cook Now button is visible", async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText(/Cook Now/)).toBeVisible({ timeout: 10_000 });
  });

  test("clicking Cook Now navigates to chat", async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText(/Cook Now/)).toBeVisible({ timeout: 10_000 });

    await page.getByText(/Cook Now/).click();

    // Should navigate to chat and show the cook message
    await expect(
      page.getByText("Cook Boeuf Bourguignon now"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("Cook Now sends message containing recipe name", async ({ page }) => {
    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText(/Cook Now/)).toBeVisible({ timeout: 10_000 });

    await page.getByText(/Cook Now/).click();

    // The user message should appear in chat
    await expect(
      page.getByText("Cook Boeuf Bourguignon now"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("chat recipe card Start Cooking button is visible", async ({
    page,
  }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Show me Beef Bourguignon");
    await input.press("Enter");

    await expect(page.getByText("Start Cooking")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("clicking Start Cooking in chat sends a cook message", async ({
    page,
  }) => {
    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Show me Beef Bourguignon");
    await input.press("Enter");

    await expect(page.getByText("Start Cooking")).toBeVisible({
      timeout: 10_000,
    });

    await page.getByText("Start Cooking").click();

    // Should send the cook message into chat
    await expect(
      page.getByText("Cook Boeuf Bourguignon now"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("no console errors after cook now actions", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/(main)/recipe/boeuf-bourguignon");
    await expect(page.getByText(/Cook Now/)).toBeVisible({ timeout: 10_000 });

    await page.getByText(/Cook Now/).click();
    await expect(
      page.getByText("Cook Boeuf Bourguignon now"),
    ).toBeVisible({ timeout: 10_000 });

    expect(errors).toHaveLength(0);
  });
});
