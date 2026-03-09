import type { BlockType, StreamingBlock } from "../../types";
import { extractContentStreaming } from "./chat";

/** Result from each parser update */
export interface StreamingParseResult {
  content: string | null;
  blocks: StreamingBlock[];
  blocksDetected: boolean;
}

/** Valid block type strings for validation */
const VALID_BLOCK_TYPES: ReadonlySet<string> = new Set<string>([
  "recipe-card",
  "recipe-carousel",
  "ingredients",
  "cook-mode",
  "full-recipe",
  "quick-action",
  "tips",
  "rescue",
]);

/**
 * Incrementally parses streaming JSON from Gemini to extract
 * partial block data for skeleton rendering.
 *
 * Strategy:
 * 1. Reuse extractContentStreaming() for the content field
 * 2. Detect "blocks": [ to know when blocks array begins
 * 3. Track each block by scanning for "type": "<block-type>"
 * 4. Use brace-depth tracking to find block boundaries
 * 5. Attempt JSON.parse on partial block data for progressive fill-in
 */
export class StreamingBlockParser {
  private accumulated = "";

  update(chunk: string): StreamingParseResult {
    this.accumulated += chunk;
    return this.parse();
  }

  reset(): void {
    this.accumulated = "";
  }

  private parse(): StreamingParseResult {
    const content = extractContentStreaming(this.accumulated);

    // Find the blocks array start
    const blocksMatch = /["']blocks["']\s*:\s*\[/.exec(this.accumulated);
    if (!blocksMatch) {
      return { content, blocks: [], blocksDetected: false };
    }

    const blocksStart = blocksMatch.index + blocksMatch[0].length;
    const blocks = this.extractBlocks(blocksStart);

    return { content, blocks, blocksDetected: true };
  }

  /** Scan from blocksStart to find individual block objects */
  private extractBlocks(blocksStart: number): StreamingBlock[] {
    const blocks: StreamingBlock[] = [];
    const text = this.accumulated;
    let i = blocksStart;

    while (i < text.length) {
      // Skip whitespace and commas
      while (i < text.length && /[\s,]/.test(text[i] ?? "")) i++;

      // Check for array end
      if (text[i] === "]") break;

      // Expect a block object opening brace
      if (text[i] !== "{") break;

      const blockStart = i;
      // Track brace depth to find block boundary
      let depth = 0;
      let blockEnd = -1;

      for (let j = blockStart; j < text.length; j++) {
        const ch = text[j];
        if (ch === '"') {
          // Skip string contents
          j++;
          while (j < text.length && text[j] !== '"') {
            if (text[j] === "\\") j++; // skip escaped char
            j++;
          }
        } else if (ch === "{") {
          depth++;
        } else if (ch === "}") {
          depth--;
          if (depth === 0) {
            blockEnd = j + 1;
            break;
          }
        }
      }

      const blockText =
        blockEnd > 0
          ? text.slice(blockStart, blockEnd)
          : text.slice(blockStart);
      const complete = blockEnd > 0;

      // Extract block type
      const typeMatch = /["']type["']\s*:\s*["']([a-z-]+)["']/.exec(blockText);
      if (!typeMatch) {
        // Type not yet streamed — skip this block for now
        break;
      }

      const blockType = typeMatch[1];
      if (!blockType || !VALID_BLOCK_TYPES.has(blockType)) break;

      // Try to extract partial data
      const data = this.extractPartialData(blockText);

      blocks.push({
        type: blockType as BlockType,
        data,
        complete,
      });

      if (blockEnd > 0) {
        i = blockEnd;
      } else {
        // Incomplete block — no more blocks to find
        break;
      }
    }

    return blocks;
  }

  /**
   * Extract partial data from a block substring.
   * Finds "data": { ... and attempts JSON.parse on progressively
   * larger substrings until one succeeds.
   */
  private extractPartialData(
    blockText: string,
  ): Record<string, unknown> | null {
    const dataMatch = /["']data["']\s*:\s*\{/.exec(blockText);
    if (!dataMatch) return null;

    const dataObjStart = dataMatch.index + dataMatch[0].length - 1; // include opening {

    // If block is complete, try parsing the full data object
    // Find matching closing brace for the data object
    let depth = 0;
    let dataEnd = -1;
    for (let j = dataObjStart; j < blockText.length; j++) {
      const ch = blockText[j];
      if (ch === '"') {
        j++;
        while (j < blockText.length && blockText[j] !== '"') {
          if (blockText[j] === "\\") j++;
          j++;
        }
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0) {
          dataEnd = j + 1;
          break;
        }
      }
    }

    if (dataEnd > 0) {
      // Complete data object — parse it
      try {
        const parsed: unknown = JSON.parse(
          blockText.slice(dataObjStart, dataEnd),
        );
        if (parsed !== null && typeof parsed === "object") {
          return parsed as Record<string, unknown>;
        }
      } catch {
        // Fall through to progressive parsing
      }
    }

    // Progressive parsing: try closing the JSON at successively earlier points
    // by finding the last complete key-value pair
    return this.progressiveParse(blockText.slice(dataObjStart));
  }

  /**
   * Try to parse a partial JSON object by finding valid truncation points.
   * Scans backward from the end, trying to close arrays/objects and parse.
   */
  private progressiveParse(partial: string): Record<string, unknown> | null {
    // Try adding closing braces/brackets at various truncation points
    // Look for the last comma or complete value
    for (let end = partial.length; end > 1; end--) {
      const ch = partial[end - 1];
      // Try truncating at commas, closing braces/brackets, or after values
      if (ch === "," || ch === "}" || ch === "]" || ch === '"') {
        const slice =
          ch === "," ? partial.slice(0, end - 1) : partial.slice(0, end);
        const closed = this.closeJson(slice);
        if (closed) {
          try {
            const parsed: unknown = JSON.parse(closed);
            if (parsed !== null && typeof parsed === "object") {
              return parsed as Record<string, unknown>;
            }
          } catch {
            // Try next truncation point
          }
        }
      }
    }

    return null;
  }

  /** Add closing brackets/braces to make a partial JSON string valid */
  private closeJson(partial: string): string | null {
    // Count unclosed braces and brackets (outside strings)
    let braces = 0;
    let brackets = 0;
    let inString = false;

    for (let i = 0; i < partial.length; i++) {
      const ch = partial[i];
      if (inString) {
        if (ch === "\\") {
          i++; // skip escaped char
        } else if (ch === '"') {
          inString = false;
        }
      } else {
        if (ch === '"') inString = true;
        else if (ch === "{") braces++;
        else if (ch === "}") braces--;
        else if (ch === "[") brackets++;
        else if (ch === "]") brackets--;
      }
    }

    if (inString || braces < 0 || brackets < 0) return null;

    let result = partial;
    // Close brackets first (innermost), then braces
    for (let b = 0; b < brackets; b++) result += "]";
    for (let b = 0; b < braces; b++) result += "}";

    return result;
  }
}
