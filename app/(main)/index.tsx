import { useCallback } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AppBar } from "../../components/ui/AppBar";
import { ChatEmptyState } from "../../components/chat/ChatEmptyState";
import { ChatFeed } from "../../components/chat/ChatFeed";
import { ChatInputBar } from "../../components/chat/ChatInputBar";
import { SearchSuggestions } from "../../components/chat/SearchSuggestions";
import { UrlPreview } from "../../components/chat/UrlPreview";
import { useChatStore } from "../../lib/stores/chatStore";
import { useUrlPreviewStore } from "../../lib/stores/urlPreviewStore";

export default function MainIndex() {
  const router = useRouter();
  const messages = useChatStore((state) => state.messages);
  const searchMode = useChatStore((state) => state.searchMode);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const toggleSearch = useChatStore((state) => state.toggleSearch);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);

  const urlPreviewStatus = useUrlPreviewStore((s) => s.status);
  const urlPreviewUrl = useUrlPreviewStore((s) => s.detectedUrl);
  const urlPreviewData = useUrlPreviewStore((s) => s.recipeData);
  const urlPreviewMessage = useUrlPreviewStore((s) => s.message);
  const urlPreviewClear = useUrlPreviewStore((s) => s.clear);

  const handleSend = useCallback(
    (text: string) => {
      const recipeData = useUrlPreviewStore.getState().recipeData;
      sendMessage(text, recipeData ?? undefined);
      urlPreviewClear();
    },
    [sendMessage, urlPreviewClear],
  );

  const handleSearchToggle = useCallback(() => {
    toggleSearch();
  }, [toggleSearch]);

  const handleSearchTextChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
    },
    [setSearchQuery],
  );

  const handleRecipeSelect = useCallback(
    (recipeId: string) => {
      toggleSearch();
      router.push(`/recipe/${recipeId}` as never);
    },
    [router, toggleSearch],
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

      {!searchMode && urlPreviewStatus !== "idle" && urlPreviewUrl && (
        <UrlPreview
          url={urlPreviewUrl}
          status={urlPreviewStatus}
          recipeTitle={urlPreviewData?.title}
          recipeDescription={urlPreviewData?.description}
          recipeEmoji={urlPreviewData?.emoji}
          message={urlPreviewMessage ?? undefined}
          onDismiss={urlPreviewClear}
        />
      )}

      <ChatInputBar
        onSend={handleSend}
        onSearchToggle={handleSearchToggle}
        isSearchMode={searchMode}
        searchText={searchQuery}
        onSearchTextChange={handleSearchTextChange}
        isSendDisabled={urlPreviewStatus === "loading"}
      />
    </KeyboardAvoidingView>
  );
}
