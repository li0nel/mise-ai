import { View, Text } from "react-native";

interface SystemMessageProps {
  content: string;
}

export function SystemMessage({ content }: SystemMessageProps) {
  return (
    <View className="items-center py-1">
      <View className="rounded-full bg-bg-elevated px-3.5 py-1">
        <Text className="text-xs text-text-3">{content}</Text>
      </View>
    </View>
  );
}
