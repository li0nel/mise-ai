import { getAI, getGenerativeModel, GoogleAIBackend } from "@firebase/ai";
import type { GenerativeModel, Content } from "@firebase/ai";
import { getApps } from "firebase/app";
import type { ChatMessage, Block } from "@/types/chat";
import { buildSystemPrompt } from "./systemPrompt";
import { getMockResponse } from "./mockResponses";
import { recipeTools, executeToolCall } from "./recipeTools";

/** Context passed to the LLM for each request */
export interface LLMContext {
  systemPrompt: string;
  recentMessages: ChatMessage[];
  currentRecipe?: string;
}

/** Chunk types yielded by the streaming generator */
export type StreamChunk =
  | { type: "text"; content: string }
  | { type: "blocks"; blocks: Block[] }
  | { type: "toolCall"; name: string; args: Record<string, unknown> }
  | { type: "error"; error: string }
  | { type: "done" };

let _model: GenerativeModel | null = null;

/** Initialize (or return cached) Gemini model via Firebase AI SDK */
export function initGeminiChat(): GenerativeModel | null {
  if (_model) return _model;

  const apps = getApps();
  if (apps.length === 0) {
    console.warn(
      "[mise] No Firebase app initialized — cannot create Gemini model",
    );
    return null;
  }

  const app = apps[0];
  if (!app) {
    console.warn("[mise] Firebase app is undefined");
    return null;
  }

  try {
    const ai = getAI(app, { backend: new GoogleAIBackend() });
    _model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });
    return _model;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[mise] Failed to initialize Gemini model:", message);
    return null;
  }
}

/** Convert ChatMessage history to Firebase AI Content format */
function toContents(messages: ChatMessage[]): Content[] {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
}

/** Try to parse blocks from the full response text */
function parseBlocks(text: string): Block[] | null {
  try {
    // Try to parse the entire response as JSON first
    const parsed: unknown = JSON.parse(text);
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      "blocks" in parsed &&
      Array.isArray((parsed as { blocks: unknown }).blocks)
    ) {
      return (parsed as { blocks: Block[] }).blocks;
    }
  } catch {
    // Not valid JSON as-is; try to extract JSON from the text
  }

  // Look for JSON object containing "blocks" in the text
  const jsonMatch = text.match(/\{[\s\S]*"blocks"\s*:\s*\[[\s\S]*\]\s*\}/);
  if (jsonMatch) {
    try {
      const parsed: unknown = JSON.parse(jsonMatch[0]);
      if (
        parsed !== null &&
        typeof parsed === "object" &&
        "blocks" in parsed &&
        Array.isArray((parsed as { blocks: unknown }).blocks)
      ) {
        return (parsed as { blocks: Block[] }).blocks;
      }
    } catch {
      // JSON extraction failed
    }
  }

  return null;
}

/** Extract conversational content from response text */
export function extractContent(text: string): string {
  try {
    const parsed: unknown = JSON.parse(text);
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      "content" in parsed &&
      typeof (parsed as { content: unknown }).content === "string"
    ) {
      return (parsed as { content: string }).content;
    }
  } catch {
    // Not valid JSON — return as-is
  }

  // Try extracting from embedded JSON
  const jsonMatch = text.match(
    /\{[\s\S]*"content"\s*:\s*"[\s\S]*"\s*[\s\S]*\}/,
  );
  if (jsonMatch) {
    try {
      const parsed: unknown = JSON.parse(jsonMatch[0]);
      if (
        parsed !== null &&
        typeof parsed === "object" &&
        "content" in parsed &&
        typeof (parsed as { content: unknown }).content === "string"
      ) {
        return (parsed as { content: string }).content;
      }
    } catch {
      // Extraction failed
    }
  }

  return text;
}

/**
 * Extract the "content" string value from partial/streaming JSON.
 * Uses character-level parsing so it works on incomplete JSON like:
 *   '{"content": "Here is the rec'
 * Returns null if the "content" key hasn't appeared yet.
 */
export function extractContentStreaming(partialJson: string): string | null {
  const keyPattern = /"content"\s*:\s*"/;
  const match = keyPattern.exec(partialJson);
  if (!match) return null;

  const valueStart = match.index + match[0].length;
  let result = "";

  for (let i = valueStart; i < partialJson.length; i++) {
    const ch = partialJson[i];
    if (ch === "\\") {
      const next = partialJson[i + 1];
      if (next === undefined) break; // incomplete escape at end
      switch (next) {
        case '"':
          result += '"';
          break;
        case "\\":
          result += "\\";
          break;
        case "n":
          result += "\n";
          break;
        case "t":
          result += "\t";
          break;
        case "r":
          result += "\r";
          break;
        case "/":
          result += "/";
          break;
        case "b":
          result += "\b";
          break;
        case "f":
          result += "\f";
          break;
        case "u": {
          const hex = partialJson.substring(i + 2, i + 6);
          if (hex.length < 4) return result; // incomplete unicode escape
          const codePoint = parseInt(hex, 16);
          if (!isNaN(codePoint)) {
            result += String.fromCharCode(codePoint);
            i += 4; // skip 4 hex digits (loop increments past 'u')
          }
          break;
        }
        default:
          result += next;
      }
      i++; // skip the escaped character
    } else if (ch === '"') {
      return result; // closing quote — value complete
    } else {
      result += ch;
    }
  }

  return result; // partial — no closing quote yet
}

/** Maximum number of tool call rounds to prevent infinite loops */
const MAX_TOOL_ROUNDS = 5;

/**
 * Send a message to Gemini and yield streaming chunks.
 * Yields text chunks as they arrive, then blocks (if any) at the end.
 * Handles function calling: if the model returns functionCall parts,
 * executes the tool, sends the result back, and continues.
 */
export async function* sendMessageToGemini(
  context: LLMContext,
  userMessage: string,
): AsyncGenerator<StreamChunk> {
  // Mock AI mode for E2E testing — deterministic responses
  if (process.env.EXPO_PUBLIC_MOCK_AI === "true") {
    yield* getMockResponse(userMessage);
    return;
  }

  const model = initGeminiChat();
  if (!model) {
    yield {
      type: "error",
      error: "Gemini model not initialized. Check Firebase configuration.",
    };
    yield { type: "done" };
    return;
  }

  try {
    const systemPrompt = context.currentRecipe
      ? buildSystemPrompt({ currentRecipe: context.currentRecipe })
      : context.systemPrompt;

    const chat = model.startChat({
      history: toContents(context.recentMessages),
      systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
      tools: recipeTools,
    });

    // First round: stream the initial response
    const result = await chat.sendMessageStream(userMessage);
    let fullText = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        yield { type: "text", content: chunkText };
      }
    }

    // Check for function calls in the response
    const response = await result.response;
    let functionCalls = response.functionCalls();

    // Function calling loop
    let rounds = 0;
    while (
      functionCalls &&
      functionCalls.length > 0 &&
      rounds < MAX_TOOL_ROUNDS
    ) {
      rounds++;

      // Process each function call
      const functionResponses: {
        name: string;
        response: Record<string, unknown>;
      }[] = [];
      for (const fc of functionCalls) {
        yield {
          type: "toolCall",
          name: fc.name,
          args: (fc.args ?? {}) as Record<string, unknown>,
        };
        const toolResult = executeToolCall(
          fc.name,
          (fc.args ?? {}) as Record<string, unknown>,
        );
        functionResponses.push({ name: fc.name, response: toolResult });
      }

      // Send function responses back to the model
      const followUp = await chat.sendMessageStream(
        functionResponses.map((fr) => ({
          functionResponse: {
            name: fr.name,
            response: fr.response,
          },
        })),
      );

      // Stream the follow-up response
      for await (const chunk of followUp.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          fullText += chunkText;
          yield { type: "text", content: chunkText };
        }
      }

      // Check if there are more function calls
      const followUpResponse = await followUp.response;
      functionCalls = followUpResponse.functionCalls();
    }

    // After all rounds complete, try to extract blocks from the full response
    const blocks = parseBlocks(fullText);
    if (blocks && blocks.length > 0) {
      yield { type: "blocks", blocks };
    }

    yield { type: "done" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    yield { type: "error", error: message };
    yield { type: "done" };
  }
}
