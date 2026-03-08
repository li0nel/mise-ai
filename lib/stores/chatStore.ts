import { create } from "zustand";
import type { ChatMessage, Block } from "../../types";
import { MOCK_CHAT_MESSAGES } from "../../data/mockChat";
import {
  sendMessageToGemini,
  extractContent,
} from "../ai/chat";
import type { LLMContext } from "../ai/chat";
import { SYSTEM_PROMPT } from "../ai/systemPrompt";
import { useRecipeStore } from "./recipeStore";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  searchMode: boolean;
  searchQuery: string;
  sendMessage: (text: string) => void;
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
  set: (partial: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>)) => void,
  _get: () => ChatState,
): Promise<void> {
  let accumulatedText = "";

  for await (const chunk of sendMessageToGemini(context, userMessage)) {
    switch (chunk.type) {
      case "text": {
        accumulatedText += chunk.content;
        const contentSoFar = extractContent(accumulatedText);
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId ? { ...m, content: contentSoFar } : m,
          ),
        }));
        break;
      }
      case "blocks": {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId ? { ...m, blocks: chunk.blocks } : m,
          ),
        }));
        // Sync recipe-card blocks back to recipeStore if they match a saved recipe
        syncRecipeBlocks(chunk.blocks);
        break;
      }
      case "error": {
        // Also extract content from whatever we accumulated, or show the error
        const finalContent = accumulatedText
          ? extractContent(accumulatedText)
          : `Sorry, something went wrong: ${chunk.error}`;
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId ? { ...m, content: finalContent } : m,
          ),
          isStreaming: false,
        }));
        break;
      }
      case "done": {
        // Final pass: extract clean content from accumulated JSON response
        if (accumulatedText) {
          const finalContent = extractContent(accumulatedText);
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === assistantId ? { ...m, content: finalContent } : m,
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

  sendMessage: (text: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const { messages } = get();

    // First message: seed with mock conversation (demo/tutorial)
    if (messages.length === 0) {
      set({ messages: [userMessage, ...MOCK_CHAT_MESSAGES] });
      return;
    }

    // Add user message and create placeholder assistant message
    const assistantId = `ai-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
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

    // Fire-and-forget the streaming — it updates the store via set()
    void streamGeminiResponse(context, text, assistantId, set, get);
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
