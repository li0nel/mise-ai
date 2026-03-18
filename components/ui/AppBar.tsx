import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { CogIcon } from "./Icons";

export function AppBar() {
  const router = useRouter();

  return (
    <View className="h-[52px] px-4 flex-row items-center justify-between bg-bg">
      <Text className="text-2xl font-extrabold tracking-tighter text-text">
        mise<Text className="text-brand">.</Text>
      </Text>
      <Pressable
        onPress={() => router.push("/settings" as never)}
        className="w-9 h-9 rounded-full items-center justify-center"
      >
        <CogIcon size={22} color="#3D3329" />
      </Pressable>
    </View>
  );
}
