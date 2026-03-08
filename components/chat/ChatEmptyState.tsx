import { View, Text } from "react-native";

export function ChatEmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-7 py-8">
      <Text className="mb-2 text-[58px]">{"\u{1F35C}"}</Text>
      <Text className="text-2xl font-extrabold tracking-tight text-text">
        Ready to cook?
      </Text>
      <Text className="mt-1 max-w-[270px] text-center text-base leading-normal text-text-2">
        Ask me anything about recipes, ingredients, or techniques. I&apos;m your AI
        cooking companion.
      </Text>
      <Text className="mt-2 text-center text-sm text-text-3">
        I&apos;m here to make you a better chef over time.
      </Text>
    </View>
  );
}
