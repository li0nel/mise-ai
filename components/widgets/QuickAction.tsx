import { useState, useCallback } from "react";
import { Text, Pressable, View } from "react-native";
import type { QuickActionBlock } from "../../types";
import { useChatStore } from "../../lib/stores/chatStore";

interface QuickActionProps {
  data: QuickActionBlock["data"];
}

export function QuickAction({ data }: QuickActionProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  const handlePress = useCallback(() => {
    if (data.actionType === "chat" && data.chatMessage) {
      useChatStore.getState().sendMessage(data.chatMessage);
    } else if (data.actionType === "direct") {
      setShowFeedback(true);
    }
  }, [data]);

  if (showFeedback) {
    return (
      <View className="self-start rounded-xl border border-border bg-bg-elevated px-4 py-2.5">
        <Text className="text-[13px] font-semibold text-text-2">
          {"\u2713"} Done
        </Text>
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
