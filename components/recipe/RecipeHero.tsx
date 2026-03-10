import { View, Text } from "react-native";
import type { Recipe } from "../../types";
import { parseGradientMiddleColor } from "../../lib/gradient";

interface RecipeHeroProps {
  recipe: Recipe;
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
              <Text
                className="text-[11px] font-medium"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                {cuisineLabel}
              </Text>
            </View>
          </View>
        ) : null}
        <Text
          className="text-[26px] font-extrabold tracking-[-0.8px] text-white"
          style={
            {
              lineHeight: 31,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            } as Record<string, unknown>
          }
        >
          {recipe.title}
        </Text>
      </View>
    </View>
  );
}
