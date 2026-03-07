import { View, Text } from "react-native";
import type { Recipe } from "../../types";

interface RecipeHeroProps {
  recipe: Recipe;
}

/**
 * Parse a CSS linear-gradient string and return the middle hex color
 * for use as a solid background approximation.
 * Handles formats like "linear-gradient(160deg, #F5D76E 0%, #E89228 40%, #C8481C 100%)".
 */
function parseGradientMiddleColor(gradient: string): string {
  const hexMatches = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (!hexMatches || hexMatches.length === 0) return "#888888";
  // Pick the middle color for a balanced look
  const midIndex = Math.floor(hexMatches.length / 2);
  return hexMatches[midIndex] ?? "#888888";
}

export function RecipeHero({ recipe }: RecipeHeroProps) {
  const gradient = recipe.heroImage?.gradient ?? "";
  const bgColor = parseGradientMiddleColor(gradient);
  const emoji = recipe.heroImage?.emoji ?? recipe.emoji;
  const cuisineLabel = recipe.cuisines.join(" \u00B7 ");

  return (
    <View className="relative w-full">
      {/* Solid background with centered emoji */}
      <View
        className="w-full items-center justify-center"
        style={{ height: 260, backgroundColor: bgColor }}
      >
        <Text style={{ fontSize: 80 }}>{emoji}</Text>
      </View>

      {/* Bottom gradient overlay for text legibility */}
      <View
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 120, backgroundColor: "rgba(0,0,0,0.35)" }}
      />

      {/* Title block at bottom */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-4">
        <Text className="text-xs font-semibold tracking-wider text-white/75">
          {cuisineLabel}
        </Text>
        <Text className="mt-1 text-2xl font-bold text-white">
          {recipe.title}
        </Text>
      </View>
    </View>
  );
}
