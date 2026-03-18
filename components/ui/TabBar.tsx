import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { HomeIcon, BookIcon, CartIcon } from "./Icons";

type IconComponent = typeof HomeIcon;

const TAB_ICONS: Record<string, { label: string; Icon: IconComponent }> = {
  index: { label: "Home", Icon: HomeIcon },
  recipes: { label: "My Recipes", Icon: BookIcon },
  shopping: { label: "Shopping", Icon: CartIcon },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t border-border bg-bg-surface"
      style={{ paddingBottom: insets.bottom }}
    >
      {state.routes.map((route, index) => {
        const tab = TAB_ICONS[route.name];
        if (!tab) return null;

        const isFocused = state.index === index;
        const color = isFocused ? "#C8481C" : "#A8A09A";

        return (
          <Pressable
            key={route.key}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            className="h-14 flex-1 items-center justify-center"
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
          >
            <tab.Icon size={22} color={color} />
            <Text className="mt-1 text-[10px] font-medium" style={{ color }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
