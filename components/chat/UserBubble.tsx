import { View, Text } from "react-native";

interface UserBubbleProps {
  content: string;
}

export function UserBubble({ content }: UserBubbleProps) {
  return (
    <View className="flex-row justify-end">
      <View className="max-w-[85%] rounded-2xl rounded-br-sm bg-user-bubble px-4 py-2.5">
        <Text className="text-sm leading-snug text-user-text">{content}</Text>
      </View>
    </View>
  );
}
