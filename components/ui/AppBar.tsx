import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export function AppBar() {
  const router = useRouter();

  return (
    <View className="h-[52px] px-4 flex-row items-center justify-between bg-bg">
      <Text className="text-2xl font-extrabold tracking-tighter text-text">
        mise<Text className="text-brand">.</Text>
      </Text>
      <Pressable
        onPress={() => router.push("/shopping")}
        className="w-9 h-9 rounded-full items-center justify-center"
      >
        <Text className="text-text text-lg">{"\u{1F6D2}"}</Text>
      </Pressable>
    </View>
  );
}
