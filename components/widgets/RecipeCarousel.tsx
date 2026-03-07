import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { RecipeCarouselBlock } from "../../types";

interface RecipeCarouselProps {
  data: RecipeCarouselBlock["data"];
}

/**
 * Parse a CSS linear-gradient string and return the middle hex color.
 */
function parseGradientMiddleColor(gradient: string): string {
  const hexMatches = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (!hexMatches || hexMatches.length === 0) return "#888888";
  const midIndex = Math.floor(hexMatches.length / 2);
  return hexMatches[midIndex] ?? "#888888";
}

export function RecipeCarousel({ data }: RecipeCarouselProps) {
  const router = useRouter();

  return (
    <View className="-mx-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4 pb-2 pt-1"
      >
        {data.cards.map((card) => {
          const bgColor = card.image
            ? parseGradientMiddleColor(card.image.gradient)
            : "#888888";
          const emoji = card.image?.emoji ?? card.emoji;

          return (
            <Pressable
              key={card.id}
              onPress={() => router.push(`/recipe/${card.id}` as "/recipe/[id]")}
              className="w-[158px] overflow-hidden rounded-lg border border-border bg-bg-surface"
            >
              {/* Card image */}
              <View
                className="w-full items-center justify-center"
                style={{ aspectRatio: 1, backgroundColor: bgColor }}
              >
                <Text style={{ fontSize: 36 }}>{emoji}</Text>
              </View>

              {/* Card body */}
              <View className="px-[11px] pb-3 pt-2.5">
                <Text
                  className="mb-[5px] text-[13px] font-semibold leading-tight text-text"
                  numberOfLines={2}
                >
                  {card.title}
                </Text>
                <Text className="text-[11px] text-text-3">
                  {card.time}
                </Text>
                {/* Tag pill */}
                <View className="mt-1.5 self-start rounded-full bg-bg-elevated px-[7px] py-[2px]">
                  <Text className="text-[10px] font-medium text-text-2">
                    {card.tag}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
