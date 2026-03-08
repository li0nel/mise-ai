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
  initGeminiChat: jest.fn(() => null),
}));

// Mock the system prompt
jest.mock("../ai/systemPrompt", () => ({
  SYSTEM_PROMPT: "Test system prompt",
}));

// Mock the mock data
jest.mock("../../data/mockChat", () => ({
  MOCK_CHAT_MESSAGES: [
    {
      id: "mock-001",
      role: "assistant",
      content: "Welcome to Mise!",
      timestamp: 1000,
    },
  ],
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

  describe("sendMessage - first message", () => {
    it("seeds mock chat messages on first message", () => {
      useChatStore.getState().sendMessage("Hello");

      const { messages } = useChatStore.getState();
      // First message should be the user's message, followed by mock messages
      expect(messages.length).toBeGreaterThanOrEqual(2);
      expect(messages[0]?.role).toBe("user");
      expect(messages[0]?.content).toBe("Hello");
      // Second message is from mocks
      expect(messages[1]?.id).toBe("mock-001");
    });

    it("does not set streaming on first message (demo seed path)", () => {
      useChatStore.getState().sendMessage("Hello");
      // The first-message path returns early without streaming
      expect(useChatStore.getState().isStreaming).toBe(false);
    });
  });

  describe("sendMessage - subsequent messages", () => {
    it("adds user message and creates placeholder assistant message", () => {
      // Set up existing messages so it's not the first message
      useChatStore.setState({
        messages: [
          { id: "existing-1", role: "user", content: "Previous", timestamp: 1000 },
          { id: "existing-2", role: "assistant", content: "Reply", timestamp: 1001 },
        ],
      });

      useChatStore.getState().sendMessage("New question");

      const { messages, isStreaming } = useChatStore.getState();
      // Should have: 2 existing + 1 user + 1 assistant placeholder = 4
      expect(messages).toHaveLength(4);
      expect(messages[2]?.role).toBe("user");
      expect(messages[2]?.content).toBe("New question");
      expect(messages[3]?.role).toBe("assistant");
      expect(messages[3]?.content).toBe("");
      expect(isStreaming).toBe(true);
    });

    it("creates user message with unique ID prefixed with user-", () => {
      useChatStore.setState({
        messages: [
          { id: "existing", role: "user", content: "Existing", timestamp: 1000 },
        ],
      });

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
          { id: "msg-2", role: "assistant", content: "Hi there!", timestamp: 1001 },
        ],
      });

      useChatStore.getState().clearMessages();

      expect(useChatStore.getState().messages).toEqual([]);
    });
  });
});
