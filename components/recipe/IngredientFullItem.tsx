import { View, Text } from "react-native";

interface IngredientFullItemProps {
  amount: string;
  name: string;
  note?: string;
  isLast?: boolean;
}

export function IngredientFullItem({ amount, name, note, isLast = false }: IngredientFullItemProps) {
  return (
    <View className={`flex-row gap-3 py-[11px] ${isLast ? "" : "border-b border-border-subtle"}`}>
      <View className="flex-1">
        <Text className="text-[13px] text-text">{name}</Text>
        {note ? (
          <Text className="mt-0.5 text-[11px] text-text-3">{note}</Text>
        ) : null}
      </View>
      <Text className="ml-auto text-[13px] font-semibold text-text-2">{amount}</Text>
    </View>
  );
}
