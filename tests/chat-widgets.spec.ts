import { test, expect } from "@playwright/test";

test.describe("URL import loading UI", () => {
  test("import shows loading screen with progress indicators", async ({
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

    // Loading UI elements
    await expect(page.getByText("Importing recipe\u2026")).toBeVisible({
      timeout: 5_000,
    });
    await expect(
      page.getByText("hot-thai-kitchen.com", { exact: true }),
    ).toBeVisible();

    // Progress messages update
    await expect(page.getByText(/Fetching from/)).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByText(/Found 10 similar/)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/Enriching/)).toBeVisible({
      timeout: 10_000,
    });

    // Auto-navigates to recipe detail
    await expect(
      page.getByText("Weeknight Chicken Massaman Curry"),
    ).toBeVisible({ timeout: 15_000 });

    expect(errors).toHaveLength(0);
  });
});
