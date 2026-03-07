import { View, Text } from "react-native";

interface ShoppingSectionProps {
  icon: string;
  name: string;
  itemCount: number;
}

export function ShoppingSection({ icon, name, itemCount }: ShoppingSectionProps) {
  return (
    <View className="flex-row items-center gap-2.5 pb-2.5 mb-1 border-b-2 border-border-subtle">
      <Text className="text-xl w-8 text-center">{icon}</Text>
      <Text className="flex-1 text-sm font-bold text-text-2 uppercase tracking-wider">
        {name}
      </Text>
      <Text className="text-xs text-text-3">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </Text>
    </View>
  );
}
