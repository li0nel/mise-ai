import { useCallback } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { AppBar } from "../../components/ui/AppBar";
import { ChevronRightIcon, SearchIcon } from "../../components/ui/Icons";
import { useRecipeStore } from "../../lib/stores/recipeStore";
import type { Recipe } from "../../types";

/** Return a human-readable relative timestamp for when the recipe was saved. */
function formatSavedAgo(createdAt: Date | undefined): string {
  if (!createdAt) return "Saved";
  const now = Date.now();
  const then =
    createdAt instanceof Date
      ? createdAt.getTime()
      : new Date(createdAt as unknown as string).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Saved today";
  if (diffDays < 2) return "Saved yesterday";
  if (diffDays < 7) return `Saved ${String(diffDays)} days ago`;
  return "Saved last week";
}

/** Build a subtitle string from tags or cuisine + totalTime. */
function buildSubtitle(recipe: Recipe): string {
  const tags = recipe.tags;
  if (tags && tags.length > 0) {
    return tags
      .filter((t) => t.tier === "recipe")
      .slice(0, 3)
      .map((t) => t.label)
      .join(" \u00B7 ");
  }
  const parts: string[] = [];
  const cuisine = recipe.cuisines[0];
  if (cuisine) parts.push(cuisine);
  const totalTime = recipe.prepTime + recipe.cookTime;
  if (totalTime > 0) parts.push(`${String(totalTime)} min`);
  return parts.join(" \u00B7 ");
}

function RecipeCard({
  recipe,
  onPress,
}: {
  recipe: Recipe;
  onPress: (id: string) => void;
}) {
  const subtitle = buildSubtitle(recipe);
  const savedLabel = formatSavedAgo(recipe.createdAt);

  return (
    <Pressable
      onPress={() => onPress(recipe.id)}
      className="flex-row items-center gap-3.5 rounded-xl border border-border-subtle bg-bg-surface px-4 py-3.5 shadow-sm"
    >
      {/* Emoji thumbnail */}
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-bg-elevated">
        <Text className="text-[26px] leading-none">
          {recipe.heroImage?.emoji ?? recipe.emoji}
        </Text>
      </View>

      {/* Text content */}
      <View className="flex-1">
        <Text
          className="text-[15px] font-semibold tracking-tight text-text"
          numberOfLines={1}
        >
          {recipe.title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs text-text-3" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <Text className="mt-1 text-[11px] font-medium text-text-4">
          {savedLabel}
        </Text>
      </View>

      {/* Chevron */}
      <ChevronRightIcon size={16} color="#C4BCB5" />
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
      <RecipeCard recipe={item} onPress={handlePress} />
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

      {/* Section header — brand color to match nav-01 */}
      <Text className="px-5 pb-3 pt-5 text-[11px] font-bold uppercase tracking-wider text-brand">
        My Recipes
      </Text>

      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-32"
      />

      {/* Recently searched */}
      <View className="border-t border-border-subtle bg-bg px-5 pb-6 pt-4">
        <Text className="mb-3 text-[11px] font-bold uppercase tracking-wider text-brand">
          Recently Searched
        </Text>
        {[
          "Thai peanut noodles",
          "Spicy miso ramen",
          "Weeknight roast chicken",
        ].map((search) => (
          <Pressable
            key={search}
            className="flex-row items-center gap-2.5 border-b border-border-subtle py-2.5"
            onPress={() => router.push("/" as never)}
          >
            <SearchIcon size={14} color="#C4BCB5" />
            <Text className="flex-1 text-sm text-text-2">{search}</Text>
            <ChevronRightIcon size={14} color="#C4BCB5" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
