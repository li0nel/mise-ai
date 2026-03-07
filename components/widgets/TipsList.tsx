import { View, Text } from "react-native";
import type { TipsBlock } from "../../types";

interface TipsListProps {
  data: TipsBlock["data"];
}

export function TipsList({ data }: TipsListProps) {
  return (
    <View className="gap-2">
      {data.tips.map((tip, index) => (
        <View
          key={index}
          className="flex-row gap-[11px] rounded-lg border border-border bg-bg-surface px-3.5 py-3"
        >
          {/* Emoji icon */}
          <Text className="shrink-0 text-lg leading-snug">{tip.icon}</Text>

          <View className="flex-1">
            {/* Label */}
            <Text className="mb-[3px] text-[11px] font-bold uppercase tracking-wider text-brand">
              {tip.label}
            </Text>
            {/* Description */}
            <Text className="text-[13px] leading-relaxed text-text">
              {tip.text}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
