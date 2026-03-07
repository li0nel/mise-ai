import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders brand identity", async ({ page }) => {
    await expect(page.getByText("mise.")).toBeVisible();
    await expect(page.getByText("Your AI cooking companion")).toBeVisible();
  });

  test("has email and password fields", async ({ page }) => {
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
  });

  test("has field labels", async ({ page }) => {
    await expect(page.getByText("Email", { exact: true })).toBeVisible();
    await expect(page.getByText("Password", { exact: true })).toBeVisible();
  });

  test("has sign-in button", async ({ page }) => {
    await expect(page.getByText("Sign in")).toBeVisible();
  });

  test("has forgot password link", async ({ page }) => {
    await expect(page.getByText("Forgot password?")).toBeVisible();
  });

  test("has OAuth buttons (disabled)", async ({ page }) => {
    await expect(page.getByText("Continue with Google")).toBeVisible();
    await expect(page.getByText("Continue with Apple")).toBeVisible();
  });

  test("has sign-up footer", async ({ page }) => {
    await expect(page.getByText("Don't have an account?")).toBeVisible();
    await expect(page.getByText("Sign up")).toBeVisible();
  });

  test("has or divider", async ({ page }) => {
    await expect(page.getByText("or", { exact: true })).toBeVisible();
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
