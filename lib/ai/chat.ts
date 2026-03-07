import { getAI, getGenerativeModel, GoogleAIBackend } from "@firebase/ai";
import type { GenerativeModel, Content } from "@firebase/ai";
import { getApps } from "firebase/app";
import type { ChatMessage, Block } from "@/types/chat";
import { buildSystemPrompt } from "./systemPrompt";

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
  | { type: "error"; error: string }
  | { type: "done" };

let _model: GenerativeModel | null = null;

/** Initialize (or return cached) Gemini model via Firebase AI SDK */
export function initGeminiChat(): GenerativeModel | null {
  if (_model) return _model;

  const apps = getApps();
  if (apps.length === 0) {
    console.warn("[mise] No Firebase app initialized — cannot create Gemini model");
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
  const jsonMatch = text.match(/\{[\s\S]*"content"\s*:\s*"[\s\S]*"\s*[\s\S]*\}/);
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
 * Send a message to Gemini and yield streaming chunks.
 * Yields text chunks as they arrive, then blocks (if any) at the end.
 */
export async function* sendMessageToGemini(
  context: LLMContext,
  userMessage: string,
): AsyncGenerator<StreamChunk> {
  const model = initGeminiChat();
  if (!model) {
    yield { type: "error", error: "Gemini model not initialized. Check Firebase configuration." };
    yield { type: "done" };
    return;
  }

  try {
    const systemPrompt = context.currentRecipe
      ? buildSystemPrompt({ currentRecipe: context.currentRecipe })
      : context.systemPrompt;

    const chat = model.startChat({
      history: toContents(context.recentMessages),
      systemInstruction: systemPrompt,
    });

    const result = await chat.sendMessageStream(userMessage);
    let fullText = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        yield { type: "text", content: chunkText };
      }
    }

    // After streaming completes, try to extract blocks from the full response
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
