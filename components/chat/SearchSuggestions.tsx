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
import { parseGradientMiddleColor } from "../../lib/gradient";
import { searchDishes } from "../../lib/search/dishCatalogue";

const MAX_SAVED_RESULTS = 5;
const MAX_DISCOVER_RESULTS = 10;

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
      {/* Search bar with cancel */}
      <View className="flex-row items-center gap-3 px-4 pt-3 pb-2">
        <View
          className="h-12 flex-1 flex-row items-center gap-3 rounded-2xl border border-brand px-4"
          style={
            Platform.OS === "web"
              ? ({ boxShadow: "0 0 0 3px #FCE9E2" } as Record<string, unknown>)
              : undefined
          }
        >
          <SearchIcon size={18} color="#C8481C" />
          <TextInput
            className="flex-1 text-sm text-text"
            placeholder="Search a recipe or paste a URL..."
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
            {/* YOUR RECIPES section */}
            {savedMatches.length > 0 ? (
              <View className="mt-2">
                <Text className="px-4 pb-1.5 pt-2.5 text-[11px] font-bold uppercase tracking-wider text-text-3">
                  Your Recipes
                </Text>
                {savedMatches.map((recipe, index) => {
                  const gradient = recipe.heroImage?.gradient ?? "";
                  const thumbBg = parseGradientMiddleColor(gradient);
                  return (
                    <Pressable
                      key={recipe.id}
                      onPress={() => onRecipeSelect(recipe.id)}
                      className={`flex-row items-center gap-3 px-4 py-3 ${
                        index < savedMatches.length - 1
                          ? "border-b border-border-subtle"
                          : ""
                      }`}
                    >
                      <View
                        className="h-[46px] w-[46px] items-center justify-center rounded-lg"
                        style={{ backgroundColor: thumbBg }}
                      >
                        <Text className="text-[22px]">{recipe.emoji}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-text">
                          {recipe.title}
                        </Text>
                        <Text className="mt-0.5 text-xs text-text-2">
                          {recipe.cuisines[0]} &middot;{" "}
                          {recipe.prepTime + recipe.cookTime} min
                        </Text>
                      </View>
                      <Text className="text-xs text-text-3">
                        {"\uD83D\uDD16"} Saved
                      </Text>
                      <ChevronRightIcon size={16} color="#C4BDB7" />
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            {/* DISCOVER section */}
            {discoverMatches.length > 0 ? (
              <View className="mt-2">
                <Text className="px-4 pb-1.5 pt-2.5 text-[11px] font-bold uppercase tracking-wider text-text-3">
                  Discover
                </Text>
                {discoverMatches.map((dish, index) => {
                  const isFirst = index === 0;
                  return (
                    <Pressable
                      key={dish.name}
                      onPress={() => onDishSelect(dish.name)}
                      className={`flex-row items-center gap-3 px-4 py-3 ${
                        isFirst ? "bg-brand-50" : ""
                      } ${
                        index < discoverMatches.length - 1
                          ? "border-b border-border-subtle"
                          : ""
                      }`}
                    >
                      <View className="h-[46px] w-[46px] items-center justify-center rounded-lg bg-bg-elevated">
                        <Text className="text-[22px]">{dish.emoji}</Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`text-sm text-text ${isFirst ? "font-bold" : "font-semibold"}`}
                        >
                          {dish.name}
                        </Text>
                        <Text className="mt-0.5 text-xs text-text-2">
                          {dish.cuisine}
                        </Text>
                      </View>
                      {isFirst ? (
                        <View className="rounded-full bg-brand-light px-2 py-0.5">
                          <Text className="text-[11px] font-semibold text-brand">
                            47 variations
                          </Text>
                        </View>
                      ) : (
                        <View className="rounded-full bg-bg-elevated px-2 py-0.5">
                          <Text className="text-[11px] text-text-2">
                            {dish.cuisine}
                          </Text>
                        </View>
                      )}
                      <ChevronRightIcon size={16} color="#C4BDB7" />
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
