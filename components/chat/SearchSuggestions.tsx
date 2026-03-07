import { View, Text, Pressable } from "react-native";
import { RECIPES } from "../../data/recipes";

interface SearchSuggestionsProps {
  searchText: string;
  onSelect: (recipeId: string) => void;
}

export function SearchSuggestions({ searchText, onSelect }: SearchSuggestionsProps) {
  const query = searchText.trim().toLowerCase();

  if (query.length === 0) return null;

  const filtered = RECIPES.filter((recipe) =>
    recipe.title.toLowerCase().includes(query)
  );

  if (filtered.length === 0) return null;

  return (
    <View className="mx-4 mb-1 overflow-hidden rounded-t-xl border border-b-0 border-border bg-bg-surface">
      <Text className="px-4 pb-1.5 pt-2.5 text-[11px] font-bold uppercase tracking-wider text-text-3">
        Recipes — {filtered.length} {filtered.length === 1 ? "match" : "matches"}
      </Text>

      {filtered.map((recipe, index) => (
        <Pressable
          key={recipe.id}
          onPress={() => onSelect(recipe.id)}
          className={`flex-row items-center gap-3 px-4 py-2.5 ${
            index < filtered.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <View className="h-[46px] w-[46px] items-center justify-center rounded-lg bg-bg-elevated">
            <Text className="text-[22px]">{recipe.emoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-text">
              {recipe.title}
            </Text>
            <Text className="mt-0.5 text-xs text-text-2">
              {recipe.cuisines[0]} · {recipe.prepTime + recipe.cookTime} min ·
              Serves {recipe.servings}
            </Text>
          </View>
          <Text className="text-text-4">{"\u203A"}</Text>
        </Pressable>
      ))}
    </View>
  );
}
