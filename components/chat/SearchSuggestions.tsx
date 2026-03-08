import { View, Text, Pressable } from "react-native";
import { RECIPES } from "../../data/recipes";
import { ChevronRightIcon, SearchIcon } from "../ui/Icons";

const MAX_RESULTS = 8;

interface SearchSuggestionsProps {
  searchText: string;
  onSelect: (recipeId: string) => void;
}

/**
 * Parse a CSS linear-gradient string and return the middle hex color
 * for use as a solid thumbnail background.
 */
function parseGradientMiddleColor(gradient: string): string {
  const hexMatches = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (!hexMatches || hexMatches.length === 0) return "#888888";
  const midIndex = Math.floor(hexMatches.length / 2);
  return hexMatches[midIndex] ?? "#888888";
}

export function SearchSuggestions({ searchText, onSelect }: SearchSuggestionsProps) {
  const query = searchText.trim().toLowerCase();

  if (query.length === 0) return null;

  const filtered = RECIPES.filter((recipe) =>
    recipe.title.toLowerCase().includes(query)
  );

  const totalMatches = filtered.length;
  const visible = filtered.slice(0, MAX_RESULTS);

  return (
    <View className="mb-1 overflow-hidden rounded-t-xl border border-b-0 border-border bg-bg">
      {totalMatches === 0 ? (
        <View className="items-center px-4 py-6">
          <SearchIcon size={28} color="#C4BCB5" />
          <Text className="mt-2 text-sm font-medium text-text-3">
            No recipes found
          </Text>
          <Text className="mt-1 text-xs text-text-3">
            Try a different search term
          </Text>
        </View>
      ) : (
        <>
          <Text className="px-4 pb-1.5 pt-2.5 text-[11px] font-bold uppercase tracking-wider text-text-3">
            Recipes — {totalMatches} {totalMatches === 1 ? "match" : "matches"}
          </Text>

          {visible.map((recipe, index) => {
            const gradient = recipe.heroImage?.gradient ?? "";
            const thumbBg = parseGradientMiddleColor(gradient);

            return (
              <Pressable
                key={recipe.id}
                onPress={() => onSelect(recipe.id)}
                className={`flex-row items-center gap-3 px-4 py-2.5 ${
                  index < visible.length - 1 ? "border-b border-border" : ""
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
                    {recipe.cuisines[0]} · {recipe.prepTime + recipe.cookTime} min · Serves {recipe.servings}
                  </Text>
                </View>
                <ChevronRightIcon size={16} color="#C4BDB7" />
              </Pressable>
            );
          })}

          {totalMatches > MAX_RESULTS && (
            <Text className="border-t border-border px-4 py-2 text-center text-xs text-text-3">
              +{totalMatches - MAX_RESULTS} more {totalMatches - MAX_RESULTS === 1 ? "result" : "results"}
            </Text>
          )}
        </>
      )}
    </View>
  );
}
