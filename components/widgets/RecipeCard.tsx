import { useCallback } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import type { RecipeCardBlock, WidgetAction } from "../../types";
import { ActionButton } from "./ActionButton";
import { useChatStore } from "../../lib/stores/chatStore";
import { parseGradientMiddleColor } from "../../lib/gradient";

interface RecipeCardProps {
  data: RecipeCardBlock["data"];
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text
        key={i}
        className={
          i <= rating
            ? "text-[15px] text-[#F59E0B]"
            : "text-[15px] text-border-strong"
        }
      >
        {"\u2605"}
      </Text>,
    );
  }
  return <View className="flex-row gap-[3px]">{stars}</View>;
}

export function RecipeCard({ data }: RecipeCardProps) {
  const router = useRouter();
  const gradient = data.image?.gradient ?? "";
  const bgColor = parseGradientMiddleColor(gradient);
  const heroEmoji = data.image?.emoji ?? data.emoji;

  const handleNavigate = useCallback(() => {
    router.push(`/recipe/${data.id}` as "/recipe/[id]");
  }, [router, data.id]);

  const handleAction = useCallback(
    (action: WidgetAction) => {
      if (action.actionType === "chat") {
        useChatStore.getState().sendMessage(action.chatMessage ?? action.label);
      } else {
        handleNavigate();
      }
    },
    [handleNavigate],
  );

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
          {data.actions.map((action) => (
            <ActionButton
              key={action.label}
              action={action}
              onPress={() => handleAction(action)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
