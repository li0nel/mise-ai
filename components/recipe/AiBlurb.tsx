import { View, Text } from "react-native";

interface AiBlurbProps {
  blurb: string;
}

export function AiBlurb({ blurb }: AiBlurbProps) {
  return (
    <View
      className="mx-5 rounded-lg bg-bg-elevated px-4 py-3"
      style={{ borderLeftWidth: 3, borderLeftColor: "#E8E2D9" }}
    >
      <Text className="text-[13px] leading-5 text-text-2">{blurb}</Text>
    </View>
  );
}
