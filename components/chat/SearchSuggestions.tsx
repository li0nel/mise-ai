import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { useRecipeStore } from "../../lib/stores/recipeStore";
import { ChevronRightIcon, SearchIcon } from "../ui/Icons";
import { isRecipeUrl } from "../../lib/recipeImport";

const MAX_SAVED_RESULTS = 5;

/** Return a human-readable relative timestamp. */
function formatSavedAgo(createdAt: Date | undefined): string {
  if (!createdAt) return "Saved";
  const now = Date.now();
  const then =
    createdAt instanceof Date
      ? createdAt.getTime()
      : new Date(createdAt as unknown as string).getTime();
  const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Saved today";
  if (diffDays < 2) return "Saved yesterday";
  return `Saved ${String(diffDays)} days ago`;
}

interface SearchSuggestionsProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onRecipeSelect: (recipeId: string) => void;
  onUrlSubmit: (url: string) => void;
  onCancel: () => void;
}

export function SearchSuggestions({
  searchText,
  onSearchChange,
  onRecipeSelect,
  onUrlSubmit,
  onCancel,
}: SearchSuggestionsProps) {
  const recipes = useRecipeStore((s) => s.recipes);
  const query = searchText.trim().toLowerCase();

  // Saved recipes matching query
  const savedMatches =
    query.length > 0
      ? recipes
          .filter((r) => r.title.toLowerCase().includes(query))
          .slice(0, MAX_SAVED_RESULTS)
      : [];

  return (
    <View className="absolute inset-0 z-10 bg-bg">
      {/* Search bar — brand border, brand-light glow */}
      <View className="flex-row items-center gap-2.5 px-4 pt-2.5 pb-2">
        <View
          className="h-[42px] flex-1 flex-row items-center gap-2.5 rounded-xl border-[1.5px] border-brand bg-bg-surface px-3.5"
          style={
            Platform.OS === "web"
              ? ({
                  boxShadow: "0 0 0 3px #FCE9E2",
                } as Record<string, unknown>)
              : undefined
          }
        >
          <SearchIcon size={16} color="#C8481C" />
          <TextInput
            className="flex-1 text-[15px] font-medium text-text"
            placeholder="Paste a recipe URL or search saved\u2026"
            placeholderTextColor="#A8A09A"
            value={searchText}
            onChangeText={onSearchChange}
            onSubmitEditing={() => {
              const trimmed = searchText.trim();
              if (trimmed && isRecipeUrl(trimmed)) onUrlSubmit(trimmed);
            }}
            returnKeyType="go"
            autoFocus
            style={{ outlineStyle: "none" } as Record<string, unknown>}
          />
        </View>
        <Pressable onPress={onCancel} className="py-2">
          <Text className="text-sm font-medium text-brand">Cancel</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled"
      >
        {query.length === 0 ? (
          <View className="items-center px-4 py-12">
            <Text className="text-sm text-text-3">
              Paste a URL to import or search your saved recipes
            </Text>
          </View>
        ) : savedMatches.length === 0 ? (
          <View className="items-center px-4 py-12">
            <SearchIcon size={28} color="#C4BCB5" />
            <Text className="mt-2 text-sm font-medium text-text-3">
              No saved recipes found
            </Text>
            <Text className="mt-1 text-xs text-text-3">
              Try a different search term or paste a URL
            </Text>
          </View>
        ) : (
          /* YOUR RECIPES */
          <View>
            <Text className="px-4 pb-1.5 pt-3.5 text-[11px] font-bold uppercase tracking-wider text-brand">
              Your Recipes
            </Text>
            {savedMatches.map((recipe, index) => (
              <Pressable
                key={recipe.id}
                onPress={() => onRecipeSelect(recipe.id)}
                className={`flex-row items-start gap-3 px-4 py-3 ${
                  index < savedMatches.length - 1
                    ? "border-b border-border-subtle"
                    : ""
                }`}
              >
                <View className="mt-0.5 h-[34px] w-[34px] items-center justify-center rounded-lg bg-bg-elevated">
                  <Text className="text-base">{"\uD83D\uDD16"}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-medium text-text">
                    {recipe.title}
                  </Text>
                  <Text className="mt-0.5 text-xs text-text-3">
                    {formatSavedAgo(recipe.createdAt)}
                  </Text>
                </View>
                <View className="mt-2">
                  <ChevronRightIcon size={16} color="#C4BCB5" />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
