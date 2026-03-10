import { View, Text } from "react-native";
import { useRecipeStore } from "../../lib/stores/recipeStore";

interface ToolCallIndicatorProps {
  name: string;
  args: Record<string, unknown>;
}

/** Human-readable description of a tool call */
function getDescription(name: string, args: Record<string, unknown>): string {
  switch (name) {
    case "searchMyRecipes": {
      const query = typeof args.query === "string" ? args.query : "";
      return query
        ? `Searching your ${query} recipes...`
        : "Searching your recipes...";
    }
    case "getMyRecipe": {
      const recipeId = typeof args.recipeId === "string" ? args.recipeId : "";
      const recipe = recipeId
        ? useRecipeStore.getState().getRecipeById(recipeId)
        : undefined;
      return recipe
        ? `Retrieving your ${recipe.title} recipe...`
        : "Retrieving your recipe...";
    }
    case "listMyRecipes":
      return "Looking through your recipes...";
    default:
      return "Working...";
  }
}

export function ToolCallIndicator({ name, args }: ToolCallIndicatorProps) {
  const description = getDescription(name, args);

  return (
    <View className="flex-row items-center gap-2 py-2">
      {/* Three pulsing dots */}
      <View className="flex-row items-center gap-1">
        <View className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
        <View className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand opacity-70" />
        <View className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand opacity-40" />
      </View>
      <Text className="text-xs text-text-2">{description}</Text>
    </View>
  );
}
