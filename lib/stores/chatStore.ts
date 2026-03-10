import { create } from "zustand";
import type { ChatMessage, Block, FullRecipeBlock } from "../../types";
import { sendMessageToGemini, extractContent } from "../ai/chat";
import type { LLMContext } from "../ai/chat";
import { StreamingBlockParser } from "../ai/streamingBlockParser";
import { SYSTEM_PROMPT } from "../ai/systemPrompt";
import { useRecipeStore } from "./recipeStore";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  searchMode: boolean;
  searchQuery: string;
  sendMessage: (
    text: string,
    extractedRecipe?: FullRecipeBlock["data"],
  ) => void;
  setStreaming: (streaming: boolean) => void;
  toggleSearch: () => void;
  setSearchQuery: (query: string) => void;
  clearMessages: () => void;
}

/** If any recipe-card blocks match a saved recipe, update the store */
function syncRecipeBlocks(blocks: Block[]): void {
  const recipeStore = useRecipeStore.getState();
  for (const block of blocks) {
    if (block.type === "recipe-card") {
      const existing = recipeStore.getRecipeById(block.data.id);
      if (existing) {
        recipeStore.updateRecipe(block.data.id, {
          title: block.data.title,
          emoji: block.data.emoji,
          servings: block.data.servings,
        });
      }
    }
  }
}

/** Run Gemini streaming and update the store as chunks arrive */
async function streamGeminiResponse(
  context: LLMContext,
  userMessage: string,
  assistantId: string,
  set: (
    partial: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>),
  ) => void,
  _get: () => ChatState,
): Promise<void> {
  let accumulatedText = "";
  const parser = new StreamingBlockParser();

  for await (const chunk of sendMessageToGemini(context, userMessage)) {
    switch (chunk.type) {
      case "text": {
        accumulatedText += chunk.content;
        const result = parser.update(chunk.content);

        const updates: Partial<ChatMessage> = {
          toolCallStatus: null,
        };
        if (result.content !== null) {
          updates.content = result.content;
        }
        if (result.blocksDetected && result.blocks.length > 0) {
          updates.streamingBlocks = result.blocks;
        }

        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId ? { ...m, ...updates } : m,
          ),
        }));
        break;
      }
      case "toolCall": {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  toolCallStatus: { name: chunk.name, args: chunk.args },
                }
              : m,
          ),
        }));
        break;
      }
      case "blocks": {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  blocks: chunk.blocks,
                  streamingBlocks: undefined,
                  isStreaming: false,
                }
              : m,
          ),
        }));
        syncRecipeBlocks(chunk.blocks);
        break;
      }
      case "error": {
        const finalContent = accumulatedText
          ? extractContent(accumulatedText)
          : `Sorry, something went wrong: ${chunk.error}`;
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: finalContent,
                  streamingBlocks: undefined,
                  isStreaming: false,
                }
              : m,
          ),
          isStreaming: false,
        }));
        break;
      }
      case "done": {
        if (accumulatedText) {
          const finalContent = extractContent(accumulatedText);
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content: finalContent,
                    streamingBlocks: undefined,
                    isStreaming: false,
                  }
                : m,
            ),
          }));
        }
        set({ isStreaming: false });
        break;
      }
    }
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  searchMode: false,
  searchQuery: "",

  sendMessage: (text: string, extractedRecipe?: FullRecipeBlock["data"]) => {
    const userMessage: ChatMessage = {
      id: `user-${crypto.randomUUID()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const { messages } = get();

    // Add user message and create placeholder assistant message
    const assistantId = `ai-${crypto.randomUUID()}`;
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
    };

    const updatedMessages = [...messages, userMessage];
    set({
      messages: [...updatedMessages, assistantMessage],
      isStreaming: true,
    });

    // Build context from recent messages (exclude the placeholder)
    const context: LLMContext = {
      systemPrompt: SYSTEM_PROMPT,
      recentMessages: updatedMessages.slice(-20),
    };

    // Augment message with extracted recipe data for Pass 2
    const llmMessage = extractedRecipe
      ? `${text}\n\n---\n[EXTRACTED RECIPE FROM URL]\n${JSON.stringify(extractedRecipe)}\n---`
      : text;

    // Fire-and-forget the streaming — it updates the store via set()
    streamGeminiResponse(context, llmMessage, assistantId, set, get).catch(
      () => {
        set({ isStreaming: false });
      },
    );
  },

  setStreaming: (streaming: boolean) => set({ isStreaming: streaming }),

  toggleSearch: () =>
    set((state) => ({
      searchMode: !state.searchMode,
      searchQuery: "",
    })),

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  clearMessages: () => set({ messages: [] }),
}));
