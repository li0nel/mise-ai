import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test("renders complete UI without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/login");

    // Brand identity
    await expect(page.getByText("mise.")).toBeVisible();
    await expect(page.getByText("Your AI cooking companion")).toBeVisible();

    // Form fields and labels
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
    await expect(page.getByText("Email", { exact: true })).toBeVisible();
    await expect(page.getByText("Password", { exact: true })).toBeVisible();

    // Actions
    await expect(page.getByText("Sign in")).toBeVisible();
    await expect(page.getByText("Forgot password?")).toBeVisible();

    // OAuth
    await expect(page.getByText("Continue with Google")).toBeVisible();
    await expect(page.getByText("Continue with Apple")).toBeVisible();
    await expect(page.getByText("or", { exact: true })).toBeVisible();

    // Sign-up footer
    await expect(page.getByText("Don't have an account?")).toBeVisible();
    await expect(page.getByText("Sign up")).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
