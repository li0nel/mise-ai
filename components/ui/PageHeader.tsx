import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { BackArrowIcon } from "./Icons";

interface PageHeaderProps {
  title?: string;
  rightAction?: ReactNode;
}

export function PageHeader({ title, rightAction }: PageHeaderProps) {
  const router = useRouter();

  return (
    <View className="h-[52px] px-3 flex-row items-center justify-between bg-bg">
      <Pressable
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        className="w-9 h-9 rounded-full items-center justify-center"
      >
        <BackArrowIcon size={22} color="#3D3329" />
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
