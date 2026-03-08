import { test, expect } from "@playwright/test";

test.describe("Ingredients widget journey", () => {
  test("rendering, checkbox toggles, Add All → done state persists → items in shopping list", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("What ingredients do I need?");
    await input.press("Enter");
    await expect(page.getByText("Add All to Shopping List")).toBeVisible({
      timeout: 10_000,
    });

    await test.step("header, items, amounts, sections render", async () => {
      await expect(page.getByText(/Ingredients/).first()).toBeVisible();
      await expect(page.getByText(/13 items/)).toBeVisible();

      await expect(page.getByText(/Lardons/).first()).toBeVisible();
      await expect(page.getByText(/Stewing beef/).first()).toBeVisible();
      await expect(
        page.getByText(/Full-bodied red wine/).first(),
      ).toBeVisible();

      await expect(page.getByText(/170\s*g/).first()).toBeVisible();
      await expect(page.getByText(/1\.3\s*kg/).first()).toBeVisible();

      await expect(
        page.getByText(/Chuck, brisket or beef cheek/),
      ).toBeVisible();

      await expect(
        page.getByText("Main", { exact: true }).first(),
      ).toBeVisible();
      await expect(
        page.getByText("Garnish", { exact: true }),
      ).toBeVisible();
    });

    await test.step("checkbox toggles off and back on", async () => {
      const lardonsRow = page.getByText(/Lardons/).first();
      await lardonsRow.click();
      const checkbox = page.getByRole("checkbox").first();
      await expect(checkbox).toBeVisible();

      await lardonsRow.click();
      await expect(lardonsRow).toBeVisible();

      const beef = page.getByText(/Stewing beef/).first();
      await beef.click();
      await page.waitForTimeout(200);
    });

    await test.step("Add All → done state with checkmark → persists after 3s", async () => {
      await page.getByText("Add All to Shopping List").click();

      await expect(
        page.getByText(/✓.*Added to shopping list/),
      ).toBeVisible({ timeout: 3_000 });
      await expect(
        page.getByText("Add All to Shopping List"),
      ).not.toBeVisible();

      await page.waitForTimeout(3_000);
      await expect(
        page.getByText(/Added to shopping list/),
      ).toBeVisible();
    });

    await test.step("items appear in shopping list after adding", async () => {
      await page.goto("/(main)/shopping");
      await expect(page.getByText("Shopping List")).toBeVisible({
        timeout: 10_000,
      });
      await expect(page.getByText(/Lardons/).first()).toBeVisible();
      await expect(page.getByText(/Tomato paste/).first()).toBeVisible();
    });

    expect(errors).toHaveLength(0);
  });
});
