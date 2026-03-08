import { SYSTEM_PROMPT, buildSystemPrompt } from "./systemPrompt";

describe("SYSTEM_PROMPT", () => {
  it("includes the Mise assistant identity", () => {
    expect(SYSTEM_PROMPT).toContain("You are Mise");
    expect(SYSTEM_PROMPT).toContain("mise en place");
  });

  it("documents all block types", () => {
    const blockTypes = [
      "recipe-card",
      "recipe-carousel",
      "ingredients",
      "cook-step",
      "cook-mode",
      "tips",
      "rescue",
    ];
    for (const blockType of blockTypes) {
      expect(SYSTEM_PROMPT).toContain(blockType);
    }
  });

  it("requires JSON response format", () => {
    expect(SYSTEM_PROMPT).toContain('"content"');
    expect(SYSTEM_PROMPT).toContain('"blocks"');
    expect(SYSTEM_PROMPT).toContain("valid JSON");
  });
});

describe("buildSystemPrompt", () => {
  it("returns base system prompt when no context is provided", () => {
    expect(buildSystemPrompt()).toBe(SYSTEM_PROMPT);
  });

  it("returns base system prompt when context is empty", () => {
    expect(buildSystemPrompt({})).toBe(SYSTEM_PROMPT);
  });

  it("appends current recipe context when provided", () => {
    const result = buildSystemPrompt({ currentRecipe: "Boeuf Bourguignon" });
    expect(result).toContain(SYSTEM_PROMPT);
    expect(result).toContain("Boeuf Bourguignon");
    expect(result).toContain("Current Context");
  });

  it("does not append context when currentRecipe is undefined", () => {
    const result = buildSystemPrompt({ currentRecipe: undefined });
    expect(result).toBe(SYSTEM_PROMPT);
  });

  it("does not append context when currentRecipe is empty string", () => {
    const result = buildSystemPrompt({ currentRecipe: "" });
    expect(result).toBe(SYSTEM_PROMPT);
  });
});
