import { getAI, getGenerativeModel, GoogleAIBackend } from "@firebase/ai";
import type { ChatSession } from "@firebase/ai";
import { getApps } from "firebase/app";
import type { Block } from "@/types/chat";
import { buildBuilderSystemPrompt } from "./systemPrompt";
import {
  MOCK_VERDICT,
  MOCK_QUESTIONS,
  MOCK_WRAPUP,
  createMockRecipe,
} from "../mocks/massamanCurryMock";

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
  private mockRound = 0;

  constructor(dishName: string, recipeContext: string) {
    this.systemPrompt = buildBuilderSystemPrompt(dishName, recipeContext);
  }

  private buildQuickActionBlocks(options: { label: string }[]): Block[] {
    return options.map((opt) => ({
      type: "quick-action" as const,
      data: {
        label: opt.label,
        actionType: "chat" as const,
        chatMessage: opt.label,
      },
    }));
  }

  private async getMockResponse(): Promise<BuilderMessage> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const round = this.mockRound;
    this.mockRound += 1;

    if (round === 0) {
      const q = MOCK_QUESTIONS[0];
      if (!q) throw new Error(`Mock data missing question ${String(0)}`);
      return {
        role: "assistant",
        content: MOCK_VERDICT,
        questionTitle: "Which protein?",
        questionHint: "Choose one",
        blocks: this.buildQuickActionBlocks(q.options),
      };
    }

    if (round === 1) {
      const q = MOCK_QUESTIONS[1];
      if (!q) throw new Error(`Mock data missing question ${String(1)}`);
      return {
        role: "assistant",
        content: q.aiText,
        questionTitle: "Cooking approach?",
        questionHint: "Pick your style",
        blocks: this.buildQuickActionBlocks(q.options),
      };
    }

    if (round === 2) {
      const q = MOCK_QUESTIONS[2];
      if (!q) throw new Error(`Mock data missing question ${String(2)}`);
      return {
        role: "assistant",
        content: q.aiText,
        questionTitle: "Curry paste?",
        questionHint: "Choose one",
        blocks: this.buildQuickActionBlocks(q.options),
      };
    }

    if (round === 3) {
      const q = MOCK_QUESTIONS[3];
      if (!q) throw new Error(`Mock data missing question ${String(3)}`);
      return {
        role: "assistant",
        content: q.aiText,
        questionTitle: "Spice level?",
        questionHint: "Choose one",
        blocks: this.buildQuickActionBlocks(q.options),
      };
    }

    // Round 4+: final recipe
    const mockId = "mock-builder-" + Date.now().toString(36);
    const recipe = createMockRecipe(mockId);
    const fullRecipeBlock: Block = {
      type: "full-recipe",
      data: {
        id: recipe.id,
        title: recipe.title,
        emoji: recipe.emoji,
        time: `${String(recipe.prepTime + recipe.cookTime)} min`,
        servings: recipe.servings,
        cuisine: recipe.cuisines[0] ?? "International",
        description: recipe.aiBlurb ?? "",
        image: recipe.heroImage,
        ingredients: {
          sections: recipe.ingredientSections.map((s) => ({
            name: s.name ?? "Ingredients",
          })),
          items: recipe.ingredientSections.flatMap((s) =>
            s.ingredients.map((ing) => ({
              amount: ing.amount,
              unit: ing.unit,
              name: ing.name,
              notes: ing.notes,
            })),
          ),
        },
        steps: recipe.instructions.map((inst) => ({
          stepNumber: inst.stepNumber,
          title: inst.title ?? `Step ${String(inst.stepNumber)}`,
          text: inst.text,
          timerPill: inst.timers?.[0]?.duration,
          tips: inst.tips?.[0],
          warnings: inst.warnings,
        })),
        tags: recipe.tags,
        aiBlurb: recipe.aiBlurb,
        sources: recipe.sources,
      },
    };

    return {
      role: "assistant",
      content: MOCK_WRAPUP,
      questionTitle: null,
      questionHint: null,
      blocks: [fullRecipeBlock],
    };
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
    if (process.env.EXPO_PUBLIC_MOCK_AI === "true") {
      return this.getMockResponse();
    }

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
