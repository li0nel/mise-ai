import { useCallback } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { AppBar } from "../../components/ui/AppBar";
import { ChevronRightIcon } from "../../components/ui/Icons";
import { useRecipeStore } from "../../lib/stores/recipeStore";
import { parseGradientMiddleColor } from "../../lib/gradient";
import type { Recipe } from "../../types";

/** Return a human-readable relative timestamp for when the recipe was saved. */
function formatSavedAgo(createdAt: Date | undefined): string {
  if (!createdAt) return "Saved";
  const now = Date.now();
  const then =
    createdAt instanceof Date
      ? createdAt.getTime()
      : new Date(createdAt).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Saved today";
  if (diffDays < 2) return "Saved yesterday";
  return `Saved ${String(diffDays)} days ago`;
}

/** Build a subtitle string from tags or cuisine + totalTime. */
function buildSubtitle(recipe: Recipe): string {
  const tags = recipe.tags;
  if (tags && tags.length > 0) {
    return tags.map((t) => t.label).join(" \u00B7 ");
  }
  const parts: string[] = [];
  const cuisine = recipe.cuisines[0];
  if (cuisine) parts.push(cuisine);
  const totalTime = recipe.prepTime + recipe.cookTime;
  if (totalTime > 0) parts.push(`${String(totalTime)} min`);
  return parts.join(" \u00B7 ");
}

function RecipeRow({
  recipe,
  onPress,
}: {
  recipe: Recipe;
  onPress: (id: string) => void;
}) {
  const thumbBg = parseGradientMiddleColor(recipe.heroImage?.gradient ?? "");
  const subtitle = buildSubtitle(recipe);
  const savedLabel = formatSavedAgo(recipe.createdAt);

  return (
    <Pressable
      onPress={() => onPress(recipe.id)}
      className="flex-row items-center gap-3 border-b border-border-subtle px-5 py-3"
    >
      {/* Emoji thumbnail */}
      <View
        className="h-[46px] w-[46px] items-center justify-center rounded-lg"
        style={{ backgroundColor: thumbBg }}
      >
        <Text className="text-[22px]">
          {recipe.heroImage?.emoji ?? recipe.emoji}
        </Text>
      </View>

      {/* Text content */}
      <View className="flex-1">
        <Text className="text-sm font-semibold text-text" numberOfLines={1}>
          {recipe.title}
        </Text>
        {subtitle ? (
          <Text className="text-[12px] text-text-2" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <Text className="text-[11px] text-text-3">{savedLabel}</Text>
      </View>

      {/* Chevron */}
      <ChevronRightIcon size={16} color="#C4BDB7" />
    </Pressable>
  );
}

export default function RecipesScreen() {
  const router = useRouter();
  const recipes = useRecipeStore((s) => s.recipes);

  const handlePress = useCallback(
    (id: string) => {
      router.push(`/(main)/recipe/${id}` as never);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Recipe }) => (
      <RecipeRow recipe={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback((item: Recipe) => item.id, []);

  // Empty state
  if (recipes.length === 0) {
    return (
      <View className="flex-1 bg-bg">
        <AppBar />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl">{"\uD83D\uDCD6"}</Text>
          <Text className="mt-4 text-lg font-bold text-text">
            No saved recipes yet
          </Text>
          <Text className="mt-2 text-center text-[13px] text-text-2">
            Search for a dish to get started.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <AppBar />

      {/* Section header */}
      <Text className="px-5 pb-2 pt-4 text-[11px] font-bold uppercase tracking-wider text-text-3">
        MY RECIPES
      </Text>

      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        className="flex-1"
        contentContainerClassName="pb-32"
      />
    </View>
  );
}
