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
import { searchDishes } from "../../lib/search/dishCatalogue";

const MAX_SAVED_RESULTS = 5;
const MAX_DISCOVER_RESULTS = 10;

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
  onDishSelect: (dishName: string) => void;
  onCancel: () => void;
}

export function SearchSuggestions({
  searchText,
  onSearchChange,
  onRecipeSelect,
  onDishSelect,
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

  // Discover dishes from catalogue
  const discoverMatches =
    query.length > 0 ? searchDishes(query, MAX_DISCOVER_RESULTS) : [];

  const hasResults = savedMatches.length > 0 || discoverMatches.length > 0;

  return (
    <View className="absolute inset-0 z-10 bg-bg">
      {/* Search bar — matches State 2: rounded-md, brand border, brand-light glow */}
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
            placeholder="Search a recipe or paste a URL\u2026"
            placeholderTextColor="#A8A09A"
            value={searchText}
            onChangeText={onSearchChange}
            onSubmitEditing={() => {
              if (searchText.trim()) onDishSelect(searchText.trim());
            }}
            returnKeyType="search"
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
              Type to search recipes and dishes
            </Text>
          </View>
        ) : !hasResults ? (
          <View className="items-center px-4 py-12">
            <SearchIcon size={28} color="#C4BCB5" />
            <Text className="mt-2 text-sm font-medium text-text-3">
              No results found
            </Text>
            <Text className="mt-1 text-xs text-text-3">
              Try a different search term
            </Text>
          </View>
        ) : (
          <>
            {/* YOUR RECIPES — matches State 2: 🔖 icon, "Saved X days ago", chevron */}
            {savedMatches.length > 0 ? (
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
            ) : null}

            {/* DISCOVER — matches State 2: first item highlighted, others with category badge */}
            {discoverMatches.length > 0 ? (
              <View>
                <Text className="px-4 pb-1.5 pt-3.5 text-[11px] font-bold uppercase tracking-wider text-brand">
                  Discover
                </Text>
                {discoverMatches.map((dish, index) => {
                  const isFirst = index === 0;
                  return (
                    <Pressable
                      key={dish.name}
                      onPress={() => onDishSelect(dish.name)}
                      className={`flex-row items-start gap-3 px-4 py-3 ${
                        isFirst ? "bg-brand-50" : ""
                      } ${
                        index < discoverMatches.length - 1
                          ? "border-b border-border-subtle"
                          : ""
                      }`}
                    >
                      <View
                        className={`mt-0.5 h-[34px] w-[34px] items-center justify-center rounded-lg ${
                          isFirst ? "bg-brand-light" : "bg-bg-elevated"
                        }`}
                      >
                        <Text className={isFirst ? "text-lg" : "text-base"}>
                          {dish.emoji}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`text-[15px] text-text ${isFirst ? "font-bold" : "font-medium"}`}
                        >
                          {dish.name}
                        </Text>
                        <Text className="mt-0.5 text-xs text-text-3">
                          {dish.cuisine}
                        </Text>
                      </View>
                      {isFirst ? (
                        <View className="mt-1.5 rounded-full bg-brand-light px-2 py-0.5">
                          <Text className="text-[11px] font-semibold text-brand">
                            47 variations
                          </Text>
                        </View>
                      ) : (
                        <View className="mt-1.5 rounded-full bg-bg-elevated px-2 py-0.5">
                          <Text className="text-[11px] font-semibold text-text-2">
                            {dish.cuisine}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
