import { useCallback, useState, useEffect } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AppBar } from "../../components/ui/AppBar";
import { ChatEmptyState } from "../../components/chat/ChatEmptyState";
import { ChatFeed } from "../../components/chat/ChatFeed";
import { ChatInputBar } from "../../components/chat/ChatInputBar";
import { SearchSuggestions } from "../../components/chat/SearchSuggestions";
import { UrlPreview } from "../../components/chat/UrlPreview";
import { AnalysisTrace } from "../../components/recipe/AnalysisTrace";
import { useChatStore } from "../../lib/stores/chatStore";
import { useUrlPreviewStore } from "../../lib/stores/urlPreviewStore";

export default function MainIndex() {
  const router = useRouter();
  const messages = useChatStore((state) => state.messages);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);

  const urlPreviewStatus = useUrlPreviewStore((s) => s.status);
  const urlPreviewUrl = useUrlPreviewStore((s) => s.detectedUrl);
  const urlPreviewData = useUrlPreviewStore((s) => s.recipeData);
  const urlPreviewMessage = useUrlPreviewStore((s) => s.message);
  const urlPreviewClear = useUrlPreviewStore((s) => s.clear);

  // Track analysis state for recipe builder flow
  const [analysisState, setAnalysisState] = useState<{
    dishName: string;
    isComplete: boolean;
  } | null>(null);

  // Full-screen search active state
  const [searchActive, setSearchActive] = useState(false);

  // Detect when AI starts responding (analysis done)
  useEffect(() => {
    if (!analysisState || analysisState.isComplete) return;
    const lastMsg = messages[messages.length - 1];
    if (
      lastMsg?.role === "assistant" &&
      lastMsg.content.length > 0 &&
      !lastMsg.isStreaming
    ) {
      setAnalysisState((prev) => (prev ? { ...prev, isComplete: true } : null));
    }
  }, [messages, analysisState]);

  const handleSend = useCallback(
    (text: string) => {
      const recipeData = useUrlPreviewStore.getState().recipeData;
      sendMessage(text, recipeData ?? undefined);
      urlPreviewClear();
    },
    [sendMessage, urlPreviewClear],
  );

  const handleSearchTextChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
    },
    [setSearchQuery],
  );

  // Navigate to a saved recipe
  const handleRecipeSelect = useCallback(
    (recipeId: string) => {
      setSearchActive(false);
      setSearchQuery("");
      router.push(`/recipe/${recipeId}` as never);
    },
    [router, setSearchQuery],
  );

  // Start recipe builder flow with a dish name
  const handleDishSearch = useCallback(
    (dishName: string) => {
      setSearchActive(false);
      setAnalysisState({ dishName, isComplete: false });
      sendMessage(dishName);
      setSearchQuery("");
    },
    [sendMessage, setSearchQuery],
  );

  // Open full-screen search
  const handleSearchFocus = useCallback(() => {
    setSearchActive(true);
  }, []);

  // Close full-screen search
  const handleSearchCancel = useCallback(() => {
    setSearchActive(false);
    setSearchQuery("");
  }, [setSearchQuery]);

  const hasMessages = messages.length > 0;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AppBar />

      {!hasMessages ? (
        <ChatEmptyState
          searchQuery={searchQuery}
          onSearchChange={(text) => {
            setSearchQuery(text);
            if (!searchActive && text.length > 0) setSearchActive(true);
          }}
          onSearchSubmit={handleDishSearch}
          onDishSelect={handleDishSearch}
        />
      ) : (
        <View className="flex-1">
          {/* Analysis trace for recipe builder flow */}
          {analysisState ? (
            <AnalysisTrace
              dishName={analysisState.dishName}
              isComplete={analysisState.isComplete}
            />
          ) : null}

          <ChatFeed messages={messages} />
        </View>
      )}

      {/* URL preview */}
      {urlPreviewStatus !== "idle" && urlPreviewUrl ? (
        <UrlPreview
          url={urlPreviewUrl}
          status={urlPreviewStatus}
          recipeTitle={urlPreviewData?.title}
          recipeDescription={urlPreviewData?.description}
          recipeEmoji={urlPreviewData?.emoji}
          message={urlPreviewMessage ?? undefined}
          onDismiss={urlPreviewClear}
        />
      ) : null}

      {/* Chat input bar - only in chat mode */}
      {hasMessages ? (
        <ChatInputBar
          onSend={handleSend}
          onSearchToggle={handleSearchFocus}
          isSearchMode={false}
          searchText={searchQuery}
          onSearchTextChange={handleSearchTextChange}
          isSendDisabled={urlPreviewStatus === "loading"}
        />
      ) : null}

      {/* Full-screen search overlay */}
      {searchActive ? (
        <SearchSuggestions
          searchText={searchQuery}
          onSearchChange={handleSearchTextChange}
          onRecipeSelect={handleRecipeSelect}
          onDishSelect={handleDishSearch}
          onCancel={handleSearchCancel}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}
