import { parseRichText } from "./richText";

describe("parseRichText", () => {
  it("returns a single text segment for plain text", () => {
    expect(parseRichText("Heat oil in a pan.")).toEqual([
      { type: "text", content: "Heat oil in a pan." },
    ]);
  });

  it("parses <b> tags", () => {
    expect(parseRichText("<b>Make the curry paste:</b> First step.")).toEqual([
      { type: "bold", content: "Make the curry paste:" },
      { type: "text", content: " First step." },
    ]);
  });

  it("parses <ingr> tags", () => {
    expect(
      parseRichText("Add <ingr>coriander seeds</ingr> to the pan."),
    ).toEqual([
      { type: "text", content: "Add " },
      { type: "ingredient", content: "coriander seeds" },
      { type: "text", content: " to the pan." },
    ]);
  });

  it("parses <timer> tags with duration attribute", () => {
    expect(
      parseRichText('Toast for <timer duration="2 min">2 min</timer>.'),
    ).toEqual([
      { type: "text", content: "Toast for " },
      { type: "timer", content: "2 min", duration: "2 min" },
      { type: "text", content: "." },
    ]);
  });

  it("uses inner text as duration when attribute is missing", () => {
    expect(parseRichText("Wait <timer>5 min</timer>.")).toEqual([
      { type: "text", content: "Wait " },
      { type: "timer", content: "5 min", duration: "5 min" },
      { type: "text", content: "." },
    ]);
  });

  it("parses mixed content with multiple tags", () => {
    const input =
      '<b>Make the curry paste:</b> Toast <ingr>coriander seeds</ingr> for <timer duration="2 min">2 min</timer> until fragrant.';
    expect(parseRichText(input)).toEqual([
      { type: "bold", content: "Make the curry paste:" },
      { type: "text", content: " Toast " },
      { type: "ingredient", content: "coriander seeds" },
      { type: "text", content: " for " },
      { type: "timer", content: "2 min", duration: "2 min" },
      { type: "text", content: " until fragrant." },
    ]);
  });

  it("passes through unrecognized tags as literal text", () => {
    expect(parseRichText("Use <em>fresh</em> herbs.")).toEqual([
      { type: "text", content: "Use <em>fresh</em> herbs." },
    ]);
  });

  it("passes through malformed tags as literal text", () => {
    expect(parseRichText("Add <ingr>salt and wait.")).toEqual([
      { type: "text", content: "Add <ingr>salt and wait." },
    ]);
  });

  it("handles empty string", () => {
    expect(parseRichText("")).toEqual([{ type: "text", content: "" }]);
  });

  it("handles multiple ingredients in one string", () => {
    expect(
      parseRichText("Add <ingr>garlic</ingr> and <ingr>ginger</ingr>."),
    ).toEqual([
      { type: "text", content: "Add " },
      { type: "ingredient", content: "garlic" },
      { type: "text", content: " and " },
      { type: "ingredient", content: "ginger" },
      { type: "text", content: "." },
    ]);
  });
});
