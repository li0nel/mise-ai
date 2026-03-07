import { View, Text, Pressable } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function MainIndex() {
  const { logout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <Text className="text-lg font-semibold text-text mb-4">
        Welcome to Mise
      </Text>
      <Pressable
        onPress={logout}
        className="rounded-md bg-brand px-6 py-3"
      >
        <Text className="font-semibold text-text-inv">Sign Out</Text>
      </Pressable>
    </View>
  );
}
