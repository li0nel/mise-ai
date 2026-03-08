import { test, expect } from "@playwright/test";

test.describe("Cooking widgets journey", () => {
  test("cook-step, cook-mode, and rescue widgets render and interact correctly", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/(main)");
    const input = page.getByPlaceholder("Ask about recipes...");
    await input.fill("Let's cook!");
    await input.press("Enter");
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible({
      timeout: 10_000,
    });

    await test.step("cook-step: progress header and instruction", async () => {
      await expect(page.getByText(/Step 1 of 5/)).toBeVisible();
      await expect(page.getByText("20%")).toBeVisible();
      await expect(
        page.getByText(/Bring a medium pot of water to a boil/).first(),
      ).toBeVisible();
    });

    await test.step("cook-step: timer lifecycle — idle → start → decrement → not re-clickable", async () => {
      const timerPill = page.getByText(/8 min blanch/).first();
      await expect(timerPill).toBeVisible();

      await timerPill.click();
      await expect(page.getByText(/8:00 remaining/).first()).toBeVisible({
        timeout: 3_000,
      });

      await page.waitForTimeout(2_000);
      await expect(page.getByText(/7:5\d remaining/).first()).toBeVisible({
        timeout: 3_000,
      });

      // Re-click doesn't restart timer
      const currentText = await page
        .getByText(/\d+:\d+ remaining/)
        .first()
        .textContent();
      await page.getByText(/\d+:\d+ remaining/).first().click();
      await page.waitForTimeout(1_000);
      const laterText = await page
        .getByText(/\d+:\d+ remaining/)
        .first()
        .textContent();
      expect(laterText).not.toBe(currentText);
      expect(laterText).not.toContain("8:00");
    });

    await test.step("cook-step: action buttons send messages", async () => {
      await page.getByText("Next Step").click();
      await expect(page.getByText("Show me the next step")).toBeVisible({
        timeout: 10_000,
      });

      await page.getByText("Show All Steps").click();
      await expect(
        page.getByText("Show me all the steps", { exact: true }),
      ).toBeVisible({ timeout: 10_000 });
    });

    await test.step("cook-mode: header, all steps, instructions, timer pills", async () => {
      const cookModeHeader = page.getByText("Cook Mode", { exact: true });
      await cookModeHeader.scrollIntoViewIfNeeded();
      await expect(cookModeHeader).toBeVisible();
      await expect(page.getByText("5 steps")).toBeVisible();

      await expect(page.getByText("Blanch the lardons")).toBeVisible();
      await expect(page.getByText("Render the lardons")).toBeVisible();
      await expect(page.getByText("Brown the beef in batches")).toBeVisible();
      await expect(page.getByText("Deglaze the pot")).toBeVisible();
      const braiseStep = page.getByText("Braise in the oven");
      await braiseStep.scrollIntoViewIfNeeded();
      await expect(braiseStep).toBeVisible();

      await expect(
        page.getByText(/Add 170g lardons and blanch/).first(),
      ).toBeVisible();

      await expect(page.getByText(/3-4 min render/)).toBeVisible();
      const ovenTimer = page.getByText(/2.5-3 hours in oven/);
      await ovenTimer.scrollIntoViewIfNeeded();
      await expect(ovenTimer).toBeVisible();
    });

    await test.step("cook-mode: warnings and tips", async () => {
      await expect(
        page.getByText(/Crowded pan = steamed beef/).first(),
      ).toBeVisible();

      const tip = page.getByText(/easily pierced with a fork/);
      await tip.scrollIntoViewIfNeeded();
      await expect(tip).toBeVisible();
    });

    await test.step("rescue widget: title, numbered recovery steps, details", async () => {
      await expect(
        page.getByText("Sauce Recovery — Reduction Finish"),
      ).toBeVisible();
      await expect(page.getByText("🍷").first()).toBeVisible();

      await expect(
        page.getByText(/Remove beef with a slotted spoon/),
      ).toBeVisible();
      await expect(
        page.getByText(/Rapid boil the sauce uncovered/),
      ).toBeVisible();
      await expect(
        page.getByText(/Taste and adjust with salt/),
      ).toBeVisible();
      await expect(
        page.getByText(/Finish with cold butter/),
      ).toBeVisible();

      for (let i = 1; i <= 4; i++) {
        await expect(
          page.getByText(String(i), { exact: true }).first(),
        ).toBeVisible();
      }

      await expect(page.getByText(/12-15 minutes/)).toBeVisible();
      await expect(page.getByText(/montee au beurre/i)).toBeVisible();
    });

    expect(errors).toHaveLength(0);
  });
});
