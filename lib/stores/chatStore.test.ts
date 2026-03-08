// Mock Firebase modules that chat.ts imports
jest.mock("@firebase/ai", () => ({
  getAI: jest.fn(),
  getGenerativeModel: jest.fn(),
  GoogleAIBackend: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  getApps: jest.fn(() => []),
}));

// Create a mock async iterable that doesn't use async generator syntax
// (async generators in jest.mock factories reference out-of-scope babel helpers)
function mockAsyncIterable() {
  const chunks = [
    { type: "text" as const, content: "Mocked response" },
    { type: "done" as const },
  ];
  let index = 0;
  return {
    [Symbol.asyncIterator]() {
      return {
        next() {
          if (index < chunks.length) {
            return Promise.resolve({ value: chunks[index++], done: false });
          }
          return Promise.resolve({ value: undefined, done: true as const });
        },
      };
    },
  };
}

// Mock the AI chat module — sendMessageToGemini must return an async iterable
jest.mock("../ai/chat", () => ({
  sendMessageToGemini: jest.fn(() => mockAsyncIterable()),
  extractContent: jest.fn((text: string) => text),
  extractContentStreaming: jest.fn((text: string) => text),
  initGeminiChat: jest.fn(() => null),
}));

// Mock the system prompt
jest.mock("../ai/systemPrompt", () => ({
  SYSTEM_PROMPT: "Test system prompt",
}));

import { useChatStore } from "./chatStore";

describe("chatStore", () => {
  beforeEach(() => {
    useChatStore.setState({
      messages: [],
      isStreaming: false,
      searchMode: false,
      searchQuery: "",
    });
  });

  describe("initial state", () => {
    it("starts with empty messages after reset", () => {
      expect(useChatStore.getState().messages).toEqual([]);
    });

    it("starts not streaming", () => {
      expect(useChatStore.getState().isStreaming).toBe(false);
    });

    it("starts with search mode off", () => {
      expect(useChatStore.getState().searchMode).toBe(false);
    });

    it("starts with empty search query", () => {
      expect(useChatStore.getState().searchQuery).toBe("");
    });
  });

  describe("sendMessage", () => {
    it("adds user message and creates placeholder assistant message", () => {
      useChatStore.getState().sendMessage("Hello");

      const { messages, isStreaming } = useChatStore.getState();
      // All messages go through streaming — no mock seeding
      expect(messages).toHaveLength(2);
      expect(messages[0]?.role).toBe("user");
      expect(messages[0]?.content).toBe("Hello");
      expect(messages[1]?.role).toBe("assistant");
      expect(messages[1]?.content).toBe("");
      expect(isStreaming).toBe(true);
    });

    it("streams all messages through Gemini (no mock seeding)", () => {
      useChatStore.getState().sendMessage("First message");

      const { messages, isStreaming } = useChatStore.getState();
      expect(messages).toHaveLength(2);
      expect(messages[0]?.role).toBe("user");
      expect(messages[1]?.role).toBe("assistant");
      expect(isStreaming).toBe(true);
    });

    it("creates user message with unique ID prefixed with user-", () => {
      useChatStore.getState().sendMessage("Test");

      const { messages } = useChatStore.getState();
      const userMsg = messages.find((m) => m.content === "Test");
      expect(userMsg?.id).toMatch(/^user-/);
    });
  });

  describe("setStreaming", () => {
    it("sets streaming to true", () => {
      useChatStore.getState().setStreaming(true);
      expect(useChatStore.getState().isStreaming).toBe(true);
    });

    it("sets streaming to false", () => {
      useChatStore.setState({ isStreaming: true });
      useChatStore.getState().setStreaming(false);
      expect(useChatStore.getState().isStreaming).toBe(false);
    });
  });

  describe("toggleSearch", () => {
    it("toggles search mode on", () => {
      useChatStore.getState().toggleSearch();
      expect(useChatStore.getState().searchMode).toBe(true);
    });

    it("toggles search mode off", () => {
      useChatStore.setState({ searchMode: true, searchQuery: "pasta" });
      useChatStore.getState().toggleSearch();
      expect(useChatStore.getState().searchMode).toBe(false);
    });

    it("clears search query when toggling", () => {
      useChatStore.setState({ searchMode: true, searchQuery: "pasta" });
      useChatStore.getState().toggleSearch();
      expect(useChatStore.getState().searchQuery).toBe("");
    });
  });

  describe("setSearchQuery", () => {
    it("sets the search query", () => {
      useChatStore.getState().setSearchQuery("chicken recipes");
      expect(useChatStore.getState().searchQuery).toBe("chicken recipes");
    });

    it("clears the search query with empty string", () => {
      useChatStore.setState({ searchQuery: "something" });
      useChatStore.getState().setSearchQuery("");
      expect(useChatStore.getState().searchQuery).toBe("");
    });
  });

  describe("clearMessages", () => {
    it("removes all messages", () => {
      useChatStore.setState({
        messages: [
          { id: "msg-1", role: "user", content: "Hello", timestamp: 1000 },
          {
            id: "msg-2",
            role: "assistant",
            content: "Hi there!",
            timestamp: 1001,
          },
        ],
      });

      useChatStore.getState().clearMessages();

      expect(useChatStore.getState().messages).toEqual([]);
    });
  });
});
