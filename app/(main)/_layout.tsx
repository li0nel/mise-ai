import { useEffect } from "react";
import { View } from "react-native";
import { Slot, useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function MainLayout() {
  const { user, isLoading, isVerified } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/(auth)/login");
    } else if (!isVerified) {
      router.replace("/(auth)/verify-email");
    }
  }, [isLoading, user, isVerified, router]);

  if (isLoading || !user || !isVerified) return null;

  return (
    <View className="flex-1 bg-bg">
      <Slot />
    </View>
  );
}
