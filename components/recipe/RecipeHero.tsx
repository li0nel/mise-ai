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
        style={{ aspectRatio: 4 / 3, backgroundColor: bgColor }}
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
        {cuisineLabel ? (
          <View className="mb-2 flex-row">
            <View
              className="rounded-full px-[9px] py-[3px]"
              style={{
                backgroundColor: "rgba(255,255,255,0.18)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.25)",
              }}
            >
              <Text className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>
                {cuisineLabel}
              </Text>
            </View>
          </View>
        ) : null}
        <Text
          className="text-[26px] font-extrabold tracking-[-0.8px] text-white"
          style={{ lineHeight: 31, textShadow: "0 2px 8px rgba(0,0,0,0.3)" } as Record<string, unknown>}
        >
          {recipe.title}
        </Text>
      </View>
    </View>
  );
}
