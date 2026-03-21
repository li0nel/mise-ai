import { getAI, getGenerativeModel, GoogleAIBackend } from "@firebase/ai";
import type { ChatSession } from "@firebase/ai";
import { getApps } from "firebase/app";
import type { Block } from "@/types/chat";
import { buildBuilderSystemPrompt } from "./systemPrompt";

export interface BuilderMessage {
  role: "user" | "assistant";
  content: string;
  questionTitle: string | null;
  questionHint: string | null;
  blocks: Block[];
}

/**
 * Parse a Gemini JSON response into content, questionTitle, questionHint, and blocks.
 *
 * 1. Try JSON.parse(text) directly.
 * 2. Try regex extraction for embedded JSON.
 * 3. Fallback: return text as content with null fields and empty blocks.
 */
export function parseBuilderResponse(text: string): {
  content: string;
  questionTitle: string | null;
  questionHint: string | null;
  blocks: Block[];
} {
  const fallback = {
    content: text,
    questionTitle: null,
    questionHint: null,
    blocks: [],
  };

  function extractFields(parsed: unknown): {
    content: string;
    questionTitle: string | null;
    questionHint: string | null;
    blocks: Block[];
  } | null {
    if (parsed === null || typeof parsed !== "object") return null;

    const rec = parsed as Record<string, unknown>;

    const content = typeof rec.content === "string" ? rec.content : text;
    const questionTitle =
      typeof rec.questionTitle === "string" ? rec.questionTitle : null;
    const questionHint =
      typeof rec.questionHint === "string" ? rec.questionHint : null;
    const blocks = Array.isArray(rec.blocks) ? (rec.blocks as Block[]) : [];

    return { content, questionTitle, questionHint, blocks };
  }

  // 1. Try direct JSON.parse
  try {
    const parsed: unknown = JSON.parse(text);
    const result = extractFields(parsed);
    if (result) return result;
  } catch {
    // Not valid JSON — try regex extraction
  }

  // 2. Try regex extraction for embedded JSON
  const jsonMatch = text.match(/\{[\s\S]*"blocks"\s*:\s*\[[\s\S]*\]\s*\}/);
  if (jsonMatch?.[0]) {
    try {
      const parsed: unknown = JSON.parse(jsonMatch[0]);
      const result = extractFields(parsed);
      if (result) return result;
    } catch {
      // extraction failed
    }
  }

  // 3. Fallback
  return fallback;
}

/**
 * Manages a multi-turn Gemini chat session for the recipe builder wizard.
 * Each call to sendReply() sends the user's choice and returns Gemini's
 * next response (verdict, question, or final recipe).
 */
export class BuilderChat {
  private chat: ChatSession | null = null;
  private systemPrompt: string;

  constructor(dishName: string, recipeContext: string) {
    this.systemPrompt = buildBuilderSystemPrompt(dishName, recipeContext);
  }

  private initChat(): ChatSession | null {
    if (this.chat) return this.chat;

    const apps = getApps();
    const app = apps[0];
    if (!app) {
      console.warn("[mise] No Firebase app — cannot start builder chat");
      return null;
    }

    try {
      const ai = getAI(app, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });
      this.chat = model.startChat({
        systemInstruction: {
          role: "system",
          parts: [{ text: this.systemPrompt }],
        },
      });
      return this.chat;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[mise] Failed to init builder chat:", message);
      return null;
    }
  }

  /**
   * Send a message to Gemini and parse the response.
   * For the first call, send the dish name to kick off the wizard.
   * For subsequent calls, send the user's quick-action selection.
   */
  async sendReply(userMessage: string): Promise<BuilderMessage> {
    const chat = this.initChat();
    if (!chat) {
      return {
        role: "assistant",
        content:
          "Could not connect to Gemini. Check your Firebase configuration.",
        questionTitle: null,
        questionHint: null,
        blocks: [],
      };
    }

    try {
      const result = await chat.sendMessage(userMessage);
      const fullText = result.response.text() ?? "";

      const { content, questionTitle, questionHint, blocks } =
        parseBuilderResponse(fullText);

      return {
        role: "assistant",
        content,
        questionTitle,
        questionHint,
        blocks,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[mise] Builder chat error:", message);
      return {
        role: "assistant",
        content: `Something went wrong: ${message}`,
        questionTitle: null,
        questionHint: null,
        blocks: [],
      };
    }
  }
}
