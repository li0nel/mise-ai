import { View, Text, Pressable } from "react-native";
import { RECIPES } from "../../data/recipes";
import { ChevronRightIcon } from "../ui/Icons";

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

  if (filtered.length === 0) return null;

  return (
    <View className="mb-1 overflow-hidden rounded-t-xl border border-b-0 border-border bg-bg">
      <Text className="px-4 pb-1.5 pt-2.5 text-[11px] font-bold uppercase tracking-wider text-text-3">
        Recipes — {filtered.length} {filtered.length === 1 ? "match" : "matches"}
      </Text>

      {filtered.map((recipe, index) => {
        const gradient = recipe.heroImage?.gradient ?? "";
        const thumbBg = parseGradientMiddleColor(gradient);

        return (
          <Pressable
            key={recipe.id}
            onPress={() => onSelect(recipe.id)}
            className={`flex-row items-center gap-3 px-4 py-2.5 ${
              index < filtered.length - 1 ? "border-b border-border" : ""
            }`}
          >
            {/* Gradient-colored thumbnail with emoji */}
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
    </View>
  );
}
