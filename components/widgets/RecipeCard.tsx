import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { RecipeCardBlock } from "../../types";

interface RecipeCardProps {
  data: RecipeCardBlock["data"];
}

/**
 * Parse a CSS linear-gradient string and return the middle hex color
 * for use as a solid background approximation in React Native.
 */
function parseGradientMiddleColor(gradient: string): string {
  const hexMatches = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (!hexMatches || hexMatches.length === 0) return "#888888";
  const midIndex = Math.floor(hexMatches.length / 2);
  return hexMatches[midIndex] ?? "#888888";
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text
        key={i}
        className={i <= rating ? "text-[15px] text-[#F59E0B]" : "text-[15px] text-border-strong"}
      >
        {"\u2605"}
      </Text>
    );
  }
  return <View className="flex-row gap-[3px]">{stars}</View>;
}

export function RecipeCard({ data }: RecipeCardProps) {
  const router = useRouter();
  const gradient = data.image?.gradient ?? "";
  const bgColor = parseGradientMiddleColor(gradient);
  const heroEmoji = data.image?.emoji ?? data.emoji;

  function handleNavigate() {
    router.push(`/recipe/${data.id}` as "/recipe/[id]");
  }

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-surface shadow-sm">
      {/* Hero image area */}
      <View
        className="w-full items-end justify-end p-3"
        style={{ aspectRatio: 16 / 9, backgroundColor: bgColor }}
      >
        <Text style={{ fontSize: 42 }}>{heroEmoji}</Text>
      </View>

      {/* Body */}
      <View className="px-4 pb-4 pt-3.5">
        {/* Title + star rating */}
        <View className="mb-1.5 flex-row items-start justify-between">
          <Text className="flex-1 text-base font-bold leading-tight tracking-tight text-text">
            {data.title}
          </Text>
          <StarRating rating={data.rating} />
        </View>

        {/* Subtitle */}
        {data.subtitle ? (
          <Text className="mb-2.5 text-xs font-semibold text-brand">
            {data.subtitle}
          </Text>
        ) : null}

        {/* Meta row */}
        <View className="mb-3.5 flex-row flex-wrap gap-3.5">
          <Text className="text-[13px] text-text-2">
            {"\u23F1"} {data.time}
          </Text>
          <Text className="text-[13px] text-text-2">
            {"\uD83D\uDC65"} {data.servings} servings
          </Text>
          <Text className="text-[13px] text-text-2">
            {"\uD83C\uDF0D"} {data.cuisine}
          </Text>
        </View>

        {/* Description */}
        <Text className="mb-3.5 text-[13px] leading-snug text-text-2">
          {data.description}
        </Text>

        {/* Action buttons */}
        <View className="flex-row gap-2">
          {data.actions.map((action) => {
            if (action.type === "primary") {
              return (
                <Pressable
                  key={action.label}
                  onPress={handleNavigate}
                  disabled={action.disabled}
                  className={`flex-1 items-center justify-center rounded-md bg-brand px-4 py-2.5 ${action.disabled ? "opacity-50" : ""}`}
                >
                  <Text className="text-[13px] font-bold text-text-inv">
                    {action.label}
                  </Text>
                </Pressable>
              );
            }
            return (
              <Pressable
                key={action.label}
                onPress={handleNavigate}
                disabled={action.disabled}
                className={`items-center justify-center rounded-md border border-border bg-transparent px-4 py-2.5 ${action.disabled ? "opacity-50" : ""}`}
              >
                <Text className="text-[13px] font-semibold text-text">
                  {action.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
