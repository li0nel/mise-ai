import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  rightAction?: ReactNode;
}

export function PageHeader({ title, rightAction }: PageHeaderProps) {
  const router = useRouter();

  return (
    <View className="h-11 px-2 flex-row items-center justify-between bg-bg">
      <Pressable
        onPress={() => router.back()}
        className="w-9 h-9 rounded-full items-center justify-center"
      >
        <Text className="text-text text-lg">{"\u2190"}</Text>
      </Pressable>
      {title ? (
        <Text className="text-base font-semibold text-text">{title}</Text>
      ) : (
        <View />
      )}
      {rightAction ?? <View className="w-9" />}
    </View>
  );
}
