// Mock Firebase modules to prevent ESM import errors
jest.mock("@firebase/ai", () => ({
  getAI: jest.fn(),
  getGenerativeModel: jest.fn(),
  GoogleAIBackend: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  getApps: jest.fn(() => []),
}));

import { StreamingBlockParser } from "./streamingBlockParser";

describe("StreamingBlockParser", () => {
  let parser: StreamingBlockParser;

  beforeEach(() => {
    parser = new StreamingBlockParser();
  });

  it("extracts content before blocks appear", () => {
    const result = parser.update('{"content": "Hello there');
    expect(result.content).toBe("Hello there");
    expect(result.blocksDetected).toBe(false);
    expect(result.blocks).toEqual([]);
  });

  it("returns null content when content key not yet visible", () => {
    const result = parser.update('{"con');
    expect(result.content).toBeNull();
  });

  it("detects a block type from partial streaming", () => {
    parser.update('{"content": "Hi", "blocks": [{"type": "full-recipe"');
    const result = parser.update(', "data": {');

    expect(result.blocksDetected).toBe(true);
    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0]?.type).toBe("full-recipe");
    expect(result.blocks[0]?.complete).toBe(false);
  });

  it("extracts partial data fields as they stream in", () => {
    parser.update(
      '{"content": "Here", "blocks": [{"type": "full-recipe", "data": {"title": "Pasta"',
    );
    const result = parser.update(', "emoji": "🍝"');

    expect(result.blocks).toHaveLength(1);
    const data = result.blocks[0]?.data;
    expect(data).not.toBeNull();
    expect(data?.title).toBe("Pasta");
    expect(data?.emoji).toBe("🍝");
  });

  it("marks block as complete when closing brace found", () => {
    const json =
      '{"content": "Hi", "blocks": [{"type": "quick-action", "data": {"label": "Go", "icon": "🔄", "actionType": "chat"}}]}';
    const result = parser.update(json);

    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0]?.complete).toBe(true);
    expect(result.blocks[0]?.data?.label).toBe("Go");
  });

  it("handles multiple blocks", () => {
    const json =
      '{"content": "Hi", "blocks": [' +
      '{"type": "quick-action", "data": {"label": "A", "actionType": "chat"}}, ' +
      '{"type": "quick-action", "data": {"label": "B", "actionType": "chat"}}' +
      "]}";
    const result = parser.update(json);

    expect(result.blocks).toHaveLength(2);
    expect(result.blocks[0]?.data?.label).toBe("A");
    expect(result.blocks[1]?.data?.label).toBe("B");
  });

  it("handles incremental updates across multiple chunks", () => {
    parser.update('{"content": "Recipe time", ');
    const r1 = parser.update('"blocks": [{"type": "full-recipe"');
    expect(r1.blocksDetected).toBe(true);
    expect(r1.blocks).toHaveLength(1);
    expect(r1.blocks[0]?.type).toBe("full-recipe");

    const r2 = parser.update(', "data": {"title": "Soup", "emoji": "🍜"');
    expect(r2.blocks[0]?.data?.title).toBe("Soup");

    const r3 = parser.update(', "time": "30 min", "servings": 4}}]}');
    expect(r3.blocks[0]?.complete).toBe(true);
    expect(r3.blocks[0]?.data?.servings).toBe(4);
  });

  it("returns no blocks when blocks array not started", () => {
    const result = parser.update('{"content": "Just text"}');
    expect(result.blocksDetected).toBe(false);
    expect(result.blocks).toEqual([]);
  });

  it("ignores invalid block types", () => {
    const result = parser.update(
      '{"content": "Hi", "blocks": [{"type": "invalid-type", "data": {}}]}',
    );
    expect(result.blocks).toEqual([]);
  });

  it("resets accumulated state", () => {
    parser.update('{"content": "Old data", "blocks": [');
    parser.reset();
    const result = parser.update('{"content": "Fresh"');
    expect(result.content).toBe("Fresh");
    expect(result.blocksDetected).toBe(false);
  });

  it("handles empty blocks array", () => {
    const result = parser.update('{"content": "Hi", "blocks": []}');
    expect(result.blocksDetected).toBe(true);
    expect(result.blocks).toEqual([]);
  });

  it("handles block with data containing nested objects", () => {
    const json = JSON.stringify({
      content: "Recipe",
      blocks: [
        {
          type: "full-recipe",
          data: {
            title: "Pasta",
            ingredients: {
              items: [{ name: "Flour", amount: "200", unit: "g" }],
            },
          },
        },
      ],
    });
    const result = parser.update(json);
    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0]?.complete).toBe(true);
    const data = result.blocks[0]?.data;
    expect(data?.title).toBe("Pasta");
    const ingredients = data?.ingredients as { items: unknown[] };
    expect(ingredients.items).toHaveLength(1);
  });
});
