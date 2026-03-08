import { parseDurationToSeconds, formatRemaining } from "./duration";

describe("parseDurationToSeconds", () => {
  it("parses minutes", () => {
    expect(parseDurationToSeconds("5 min")).toBe(300);
    expect(parseDurationToSeconds("2 minutes")).toBe(120);
    expect(parseDurationToSeconds("1 mins")).toBe(60);
  });

  it("parses hours", () => {
    expect(parseDurationToSeconds("1 hr")).toBe(3600);
    expect(parseDurationToSeconds("1.5 hrs")).toBe(5400);
    expect(parseDurationToSeconds("2 hours")).toBe(7200);
  });

  it("parses bare numbers as minutes", () => {
    expect(parseDurationToSeconds("5")).toBe(300);
  });

  it("returns 0 for unparseable input", () => {
    expect(parseDurationToSeconds("")).toBe(0);
    expect(parseDurationToSeconds("soon")).toBe(0);
  });
});

describe("formatRemaining", () => {
  it("formats seconds into m:ss remaining", () => {
    expect(formatRemaining(300)).toBe("5:00 remaining");
    expect(formatRemaining(65)).toBe("1:05 remaining");
    expect(formatRemaining(0)).toBe("0:00 remaining");
  });
});
