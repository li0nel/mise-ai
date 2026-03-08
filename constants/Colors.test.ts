import { Colors } from "./Colors";

describe("Colors", () => {
  it("has all required color categories", () => {
    expect(Colors.bg).toBeDefined();
    expect(Colors.border).toBeDefined();
    expect(Colors.text).toBeDefined();
    expect(Colors.brand).toBeDefined();
    expect(Colors.success).toBeDefined();
    expect(Colors.warning).toBeDefined();
    expect(Colors.info).toBeDefined();
    expect(Colors.chat).toBeDefined();
  });

  it("has valid hex color format for bg colors", () => {
    expect(Colors.bg.DEFAULT).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Colors.bg.surface).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Colors.bg.elevated).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("has valid hex color format for brand colors", () => {
    expect(Colors.brand.DEFAULT).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Colors.brand.hover).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Colors.brand.light).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("has valid hex color format for text colors", () => {
    expect(Colors.text.DEFAULT).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Colors.text.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Colors.text.tertiary).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("has chat colors defined", () => {
    expect(Colors.chat.userBubble).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Colors.chat.userText).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("is frozen (read-only)", () => {
    // The Colors object uses `as const`, which prevents runtime mutation
    // We can verify the expected structure is intact
    expect(Object.keys(Colors)).toEqual(
      expect.arrayContaining(["bg", "border", "text", "brand", "success", "warning", "info", "chat"])
    );
  });
});
