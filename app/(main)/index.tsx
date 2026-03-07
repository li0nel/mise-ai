import { useState, useCallback } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AppBar } from "../../components/ui/AppBar";
import { ChatEmptyState } from "../../components/chat/ChatEmptyState";
import { ChatFeed } from "../../components/chat/ChatFeed";
import { ChatInputBar } from "../../components/chat/ChatInputBar";
import { SearchSuggestions } from "../../components/chat/SearchSuggestions";
import { MOCK_CHAT_MESSAGES } from "../../data/mockChat";
import type { ChatMessage } from "../../types";

export default function MainIndex() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSend = useCallback(
    (text: string) => {
      if (messages.length === 0) {
        // First message: add user message then load mock conversation
        const userMessage: ChatMessage = {
          id: `user-${Date.now()}`,
          role: "user",
          content: text,
          timestamp: Date.now(),
        };
        setMessages([userMessage, ...MOCK_CHAT_MESSAGES]);
      } else {
        const userMessage: ChatMessage = {
          id: `user-${Date.now()}`,
          role: "user",
          content: text,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMessage]);
      }
    },
    [messages.length]
  );

  const handleSearchToggle = useCallback(() => {
    setIsSearchMode((prev) => !prev);
    setSearchText("");
  }, []);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleRecipeSelect = useCallback(
    (recipeId: string) => {
      setIsSearchMode(false);
      setSearchText("");
      router.push(`/recipe/${recipeId}` as never);
    },
    [router]
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AppBar />

      {messages.length === 0 ? (
        <ChatEmptyState />
      ) : (
        <ChatFeed messages={messages} />
      )}

      {isSearchMode && searchText.trim().length > 0 && (
        <SearchSuggestions
          searchText={searchText}
          onSelect={handleRecipeSelect}
        />
      )}

      <ChatInputBar
        onSend={handleSend}
        onSearchToggle={handleSearchToggle}
        isSearchMode={isSearchMode}
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
      />
    </KeyboardAvoidingView>
  );
}
