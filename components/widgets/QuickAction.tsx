import { useState, useCallback } from "react";
import { Text, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import type { QuickActionBlock } from "../../types";
import { useChatStore } from "../../lib/stores/chatStore";
import { useRecipeStore } from "../../lib/stores/recipeStore";

interface QuickActionProps {
  data: QuickActionBlock["data"];
}

export function QuickAction({ data }: QuickActionProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (data.actionType === "chat" && data.chatMessage) {
      useChatStore.getState().sendMessage(data.chatMessage);
    } else if (data.actionType === "direct") {
      if (data.directAction === "view-recipe") {
        // Navigate to the most recently saved recipe
        const recipes = useRecipeStore.getState().recipes;
        const latest = recipes[recipes.length - 1];
        if (latest) {
          router.push(`/recipe/${latest.id}` as never);
          return;
        }
      }
      setShowFeedback(true);
    }
  }, [data, router]);

  if (showFeedback) {
    return (
      <View className="self-start rounded-xl border border-border bg-bg-elevated px-4 py-2.5">
        <Text className="text-[13px] font-semibold text-text-2">
          {"\u2713"} Done
        </Text>
      </View>
    );
  }

  // Special CTA style for "view-recipe" action
  if (data.directAction === "view-recipe") {
    return (
      <View className="mt-1 items-center rounded-xl border border-border bg-bg-surface px-5 py-5">
        <Text className="text-[40px]">{data.icon ?? "\uD83C\uDF89"}</Text>
        <Text className="mt-2 text-[17px] font-bold text-text">
          Your recipe is ready
        </Text>
        <Pressable
          onPress={handlePress}
          className="mt-4 w-full items-center rounded-full bg-brand px-6 py-3"
        >
          <Text className="text-[15px] font-semibold text-white">
            View Recipe {"\u2192"}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      className="self-start flex-row items-center gap-1.5 rounded-xl border border-brand/30 bg-brand-50 px-4 py-2.5"
    >
      {data.icon ? <Text className="text-[13px]">{data.icon}</Text> : null}
      <Text className="text-[13px] font-semibold text-brand">{data.label}</Text>
      <Text className="text-[13px] text-brand/50">{"\u2192"}</Text>
    </Pressable>
  );
}
