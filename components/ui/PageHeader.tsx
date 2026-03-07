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
    <View className="h-[52px] flex-row items-center justify-between border-b border-border-subtle bg-bg-surface px-2 shadow-sm">
      <Pressable
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        className="h-[38px] w-[38px] items-center justify-center rounded-full"
      >
        <BackArrowIcon size={20} color="#3D3329" />
      </Pressable>
      {title ? (
        <Text className="text-base font-semibold text-text">{title}</Text>
      ) : (
        <View className="flex-1" />
      )}
      {rightAction ?? <View className="w-[38px]" />}
    </View>
  );
}
