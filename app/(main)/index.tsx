import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AppBar } from "../../components/ui/AppBar";
import { ChatEmptyState } from "../../components/chat/ChatEmptyState";
import { SearchSuggestions } from "../../components/chat/SearchSuggestions";
import { RecipeBuilderFlow } from "../../components/recipe/RecipeBuilderFlow";

export default function MainIndex() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [builderDish, setBuilderDish] = useState<string | null>(null);

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

  // Start recipe builder flow with a dish name
  const handleDishSearch = useCallback((dishName: string) => {
    setSearchActive(false);
    setBuilderDish(dishName);
    setSearchQuery("");
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

  // Recipe builder callbacks
  const handleViewRecipe = useCallback(
    (recipeId: string) => {
      setBuilderDish(null);
      router.push(`/recipe/${recipeId}` as never);
    },
    [router],
  );

  const handleBuilderBack = useCallback(() => {
    setBuilderDish(null);
  }, []);

  // Builder mode — full-screen wizard, no AppBar or tab bar
  if (builderDish) {
    return (
      <RecipeBuilderFlow
        dishName={builderDish}
        onViewRecipe={handleViewRecipe}
        onBack={handleBuilderBack}
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
        onSearchSubmit={handleDishSearch}
        onDishSelect={handleDishSearch}
        onSearchFocus={handleSearchFocus}
      />

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
