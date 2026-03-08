import type { RichTextSegment } from "../types/richText";

const TAG_PATTERN = /<(b|ingr|timer)(\s[^>]*)?>(.+?)<\/\1>/g;
const DURATION_ATTR = /duration="([^"]+)"/;

/**
 * Parse lightweight markup tags in recipe text into typed segments.
 *
 * Supported tags:
 *   <b>bold text</b>
 *   <ingr>ingredient name</ingr>
 *   <timer duration="5 min">5 min</timer>
 *
 * Plain text (no tags) returns a single text segment — full backward compat.
 * Unrecognized or malformed tags pass through as literal text.
 */
export function parseRichText(input: string): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  let lastIndex = 0;

  for (const match of input.matchAll(TAG_PATTERN)) {
    const matchIndex = match.index;

    // Text before this tag
    if (matchIndex > lastIndex) {
      segments.push({
        type: "text",
        content: input.slice(lastIndex, matchIndex),
      });
    }

    const tag = match[1] as "b" | "ingr" | "timer";
    const attrs = match[2] ?? "";
    const inner = match[3] ?? "";

    switch (tag) {
      case "b":
        segments.push({ type: "bold", content: inner });
        break;
      case "ingr":
        segments.push({ type: "ingredient", content: inner });
        break;
      case "timer": {
        const durMatch = attrs.match(DURATION_ATTR);
        const duration = durMatch?.[1] ?? inner;
        segments.push({ type: "timer", content: inner, duration });
        break;
      }
    }

    lastIndex = matchIndex + match[0].length;
  }

  // Trailing text
  if (lastIndex < input.length) {
    segments.push({ type: "text", content: input.slice(lastIndex) });
  }

  // If nothing was parsed (no tags found), return single text segment
  if (segments.length === 0) {
    return [{ type: "text", content: input }];
  }

  return segments;
}
