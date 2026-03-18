import { useEffect } from "react";
import { View } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { TabBar } from "../../components/ui/TabBar";

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
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="recipes" />
        <Tabs.Screen name="shopping" />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="recipe" options={{ href: null }} />
      </Tabs>
    </View>
  );
}
