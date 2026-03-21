import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AppBar } from "../../components/ui/AppBar";
import { ChatEmptyState } from "../../components/chat/ChatEmptyState";
import { SearchSuggestions } from "../../components/chat/SearchSuggestions";
import { URLImportFlow } from "../../components/recipe/URLImportFlow";
import { isRecipeUrl } from "../../lib/recipeImport";

export default function MainIndex() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [importUrl, setImportUrl] = useState<string | null>(null);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // Navigate to a saved recipe
  const handleRecipeSelect = useCallback(
    (recipeId: string) => {
      setSearchActive(false);
      setSearchQuery("");
      router.push(`/recipe/${recipeId}` as never);
    },
    [router],
  );

  // Handle URL submission — only triggers for URLs
  const handleUrlSubmit = useCallback((text: string) => {
    if (isRecipeUrl(text)) {
      setSearchActive(false);
      setSearchQuery("");
      setImportUrl(text);
    }
  }, []);

  // Open full-screen search
  const handleSearchFocus = useCallback(() => {
    setSearchActive(true);
  }, []);

  // Close full-screen search
  const handleSearchCancel = useCallback(() => {
    setSearchActive(false);
    setSearchQuery("");
  }, []);

  // URL import callbacks
  const handleImportComplete = useCallback(
    (recipeId: string) => {
      setImportUrl(null);
      router.push(`/recipe/${recipeId}` as never);
    },
    [router],
  );

  const handleImportBack = useCallback(() => {
    setImportUrl(null);
  }, []);

  const handleImportError = useCallback((message: string) => {
    console.error("[mise] Import error:", message);
    setImportUrl(null);
  }, []);

  // URL import mode — full-screen loading, no AppBar or tab bar
  if (importUrl) {
    return (
      <URLImportFlow
        url={importUrl}
        onComplete={handleImportComplete}
        onBack={handleImportBack}
        onError={handleImportError}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AppBar />

      <ChatEmptyState
        searchQuery={searchQuery}
        onSearchChange={(text) => {
          setSearchQuery(text);
          if (!searchActive && text.length > 0) setSearchActive(true);
        }}
        onSearchSubmit={handleUrlSubmit}
        onSearchFocus={handleSearchFocus}
      />

      {/* Full-screen search overlay */}
      {searchActive ? (
        <SearchSuggestions
          searchText={searchQuery}
          onSearchChange={handleSearchTextChange}
          onRecipeSelect={handleRecipeSelect}
          onUrlSubmit={handleUrlSubmit}
          onCancel={handleSearchCancel}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}
