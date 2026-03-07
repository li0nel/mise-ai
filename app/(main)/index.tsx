import { useCallback } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AppBar } from "../../components/ui/AppBar";
import { ChatEmptyState } from "../../components/chat/ChatEmptyState";
import { ChatFeed } from "../../components/chat/ChatFeed";
import { ChatInputBar } from "../../components/chat/ChatInputBar";
import { SearchSuggestions } from "../../components/chat/SearchSuggestions";
import { useChatStore } from "../../lib/stores/chatStore";

export default function MainIndex() {
  const router = useRouter();
  const messages = useChatStore((state) => state.messages);
  const searchMode = useChatStore((state) => state.searchMode);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const toggleSearch = useChatStore((state) => state.toggleSearch);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleSearchToggle = useCallback(() => {
    toggleSearch();
  }, [toggleSearch]);

  const handleSearchTextChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
    },
    [setSearchQuery]
  );

  const handleRecipeSelect = useCallback(
    (recipeId: string) => {
      toggleSearch();
      router.push(`/recipe/${recipeId}` as never);
    },
    [router, toggleSearch]
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

      {searchMode && searchQuery.trim().length > 0 && (
        <SearchSuggestions
          searchText={searchQuery}
          onSelect={handleRecipeSelect}
        />
      )}

      <ChatInputBar
        onSend={handleSend}
        onSearchToggle={handleSearchToggle}
        isSearchMode={searchMode}
        searchText={searchQuery}
        onSearchTextChange={handleSearchTextChange}
      />
    </KeyboardAvoidingView>
  );
}
