// Mock Firebase modules before importing the module under test
jest.mock("@firebase/ai", () => ({
  getAI: jest.fn(),
  getGenerativeModel: jest.fn(),
  GoogleAIBackend: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
}));

import { extractContent, extractContentStreaming } from "./chat";

describe("extractContent", () => {
  it("extracts content from a valid JSON response with content field", () => {
    const json = JSON.stringify({
      content: "Hello, how can I help?",
      blocks: [],
    });
    expect(extractContent(json)).toBe("Hello, how can I help?");
  });

  it("returns plain text as-is when it is not JSON", () => {
    const plainText = "Just a normal text response";
    expect(extractContent(plainText)).toBe("Just a normal text response");
  });

  it("returns plain text when JSON has no content field", () => {
    const json = JSON.stringify({ blocks: [], other: "data" });
    expect(extractContent(json)).toBe(json);
  });

  it("extracts content when JSON is embedded in surrounding text", () => {
    const text =
      'Here is the response: {"content": "Extracted text", "blocks": []}';
    expect(extractContent(text)).toBe("Extracted text");
  });

  it("handles content field with special characters", () => {
    const json = JSON.stringify({
      content: "Use 2 cups of flour & 1/2 tsp salt — don't over-mix!",
      blocks: [],
    });
    expect(extractContent(json)).toBe(
      "Use 2 cups of flour & 1/2 tsp salt — don't over-mix!",
    );
  });

  it("returns original text for malformed JSON", () => {
    const broken = '{"content": "hello", "blocks": [}';
    // The regex extraction might also fail on this malformed JSON
    expect(extractContent(broken)).toBe(broken);
  });

  it("handles empty content field", () => {
    const json = JSON.stringify({ content: "", blocks: [] });
    expect(extractContent(json)).toBe("");
  });

  it("returns text when content field is not a string", () => {
    const json = JSON.stringify({ content: 42, blocks: [] });
    // content is not a string, so it should return the raw JSON
    expect(extractContent(json)).toBe(json);
  });

  it("handles JSON with newlines in content", () => {
    const json = JSON.stringify({
      content: "Line 1\nLine 2\nLine 3",
      blocks: [],
    });
    expect(extractContent(json)).toBe("Line 1\nLine 2\nLine 3");
  });
});

describe("extractContentStreaming", () => {
  it("returns null when content key not found yet", () => {
    expect(extractContentStreaming('{"con')).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(extractContentStreaming("")).toBeNull();
  });

  it("returns empty string when key found but value just started", () => {
    expect(extractContentStreaming('{"content": "')).toBe("");
  });

  it("extracts partial content from incomplete JSON", () => {
    expect(extractContentStreaming('{"content": "Here is the rec')).toBe(
      "Here is the rec",
    );
  });

  it("extracts complete content when closing quote present", () => {
    expect(extractContentStreaming('{"content": "Hello!", "blocks": []}')).toBe(
      "Hello!",
    );
  });

  it("handles escaped double quotes", () => {
    expect(extractContentStreaming('{"content": "She said \\"hello\\""}')).toBe(
      'She said "hello"',
    );
  });

  it("handles escaped backslashes", () => {
    expect(extractContentStreaming('{"content": "path\\\\to\\\\file"}')).toBe(
      "path\\to\\file",
    );
  });

  it("handles escaped newlines and tabs", () => {
    expect(extractContentStreaming('{"content": "line1\\nline2\\ttab"}')).toBe(
      "line1\nline2\ttab",
    );
  });

  it("handles unicode escapes", () => {
    expect(extractContentStreaming('{"content": "caf\\u00e9"}')).toBe("café");
  });

  it("handles incomplete escape at end of partial data", () => {
    expect(extractContentStreaming('{"content": "hello\\')).toBe("hello");
  });

  it("handles incomplete unicode escape at end", () => {
    expect(extractContentStreaming('{"content": "caf\\u00')).toBe("caf");
  });

  it("handles whitespace around colon", () => {
    expect(extractContentStreaming('{"content"  :  "spaced"}')).toBe("spaced");
  });

  it("handles no whitespace around colon", () => {
    expect(extractContentStreaming('{"content":"compact"}')).toBe("compact");
  });

  it("does not extract from unrelated key", () => {
    expect(extractContentStreaming('{"other": "value"}')).toBeNull();
  });

  it("works with large partial JSON containing blocks", () => {
    const partial =
      '{"content": "Here is **Spicy Chicken**", "blocks": [{"type": "full-recipe", "data": {"id": "spicy-ch';
    expect(extractContentStreaming(partial)).toBe("Here is **Spicy Chicken**");
  });
});
