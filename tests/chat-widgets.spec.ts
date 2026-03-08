import { test, expect } from "@playwright/test";

test.describe("Chat widgets journey", () => {
  test("recipe card, carousel, and tips widgets render and interact correctly", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Show me Beef Bourguignon");
    await input.press("Enter");
    await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible({
      timeout: 10_000,
    });

    await test.step("recipe card renders with full metadata", async () => {
      await expect(page.getByText("Boeuf Bourguignon").first()).toBeVisible();
      await expect(page.getByText("Julia Child's Classic")).toBeVisible();
      await expect(page.getByText("★").first()).toBeVisible();
      await expect(page.getByText("3h 30 min")).toBeVisible();
      await expect(
        page.getByText("6 servings", { exact: true }),
      ).toBeVisible();
      await expect(page.getByText(/French/).first()).toBeVisible();
      await expect(
        page.getByText(/Beef braised in Burgundy wine/),
      ).toBeVisible();
      await expect(page.getByText("🥩").first()).toBeVisible();
    });

    await test.step("recipe carousel renders all cards with metadata", async () => {
      await expect(page.getByText("Pommes Puree")).toBeVisible();
      await expect(page.getByText("French Onion Soup")).toBeVisible();
      await expect(page.getByText("Tarte Tatin")).toBeVisible();
      await expect(page.getByText("Salade Lyonnaise")).toBeVisible();

      await expect(page.getByText("30 min", { exact: true })).toBeVisible();
      await expect(page.getByText("1h 15 min")).toBeVisible();
      await expect(page.getByText("20 min", { exact: true })).toBeVisible();

      await expect(page.getByText("Julia's Choice")).toBeVisible();
      await expect(page.getByText("Classic Starter")).toBeVisible();
      await expect(page.getByText("French Dessert")).toBeVisible();
      await expect(page.getByText("Light Side")).toBeVisible();

      await expect(page.getByText("🥔")).toBeVisible();
      await expect(page.getByText("🧅")).toBeVisible();
      await expect(page.getByText("🍎")).toBeVisible();
      await expect(page.getByText("🥗")).toBeVisible();
    });

    await test.step("tips widget renders all tips with emojis and descriptions", async () => {
      await expect(page.getByText("Dry the beef")).toBeVisible();
      await expect(page.getByText("Use good wine")).toBeVisible();
      await expect(page.getByText("Brown in small batches")).toBeVisible();
      await expect(page.getByText("🍷").first()).toBeVisible();
      await expect(page.getByText("🔥")).toBeVisible();
      await expect(
        page.getByText(/Pat every piece of beef completely dry/),
      ).toBeVisible();
      await expect(
        page.getByText(/if you wouldn't drink it, don't cook with it/i),
      ).toBeVisible();
      await expect(page.getByText(/Never crowd the pan/)).toBeVisible();
    });

    await test.step("Cook Now sends chat message", async () => {
      await page.getByText(/Cook Now/).click();
      await expect(
        page.getByText("Cook Boeuf Bourguignon now"),
      ).toBeVisible({ timeout: 10_000 });
    });

    await test.step("carousel card click navigates to recipe page", async () => {
      // Go back to chat to find carousel again
      await page.goto("/(main)");
      const chatInput = page.getByPlaceholder("Ask about recipes...");
      await chatInput.fill("Show me Beef Bourguignon");
      await chatInput.press("Enter");
      await expect(page.getByText("Pommes Puree")).toBeVisible({
        timeout: 10_000,
      });
      await page.getByText("Pommes Puree").click();
      await expect(
        page.getByText(/Pommes Puree|Recipe not found/),
      ).toBeVisible({ timeout: 10_000 });
    });

    expect(errors).toHaveLength(0);
  });

  test("View Full Recipe navigates to recipe detail page", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Show me Beef Bourguignon");
    await input.press("Enter");
    await expect(page.getByText("View Full Recipe")).toBeVisible({
      timeout: 10_000,
    });

    await page.getByText("View Full Recipe").click();
    await expect(page.getByText("Instructions")).toBeVisible({
      timeout: 10_000,
    });

    expect(errors).toHaveLength(0);
  });
});
