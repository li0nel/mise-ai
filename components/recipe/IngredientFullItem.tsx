import { View, Text } from "react-native";

interface IngredientFullItemProps {
  amount: string;
  name: string;
  note?: string;
}

export function IngredientFullItem({ amount, name, note }: IngredientFullItemProps) {
  return (
    <View className="flex-row px-5 py-2">
      <Text className="w-20 text-[13px] text-text-3">{amount}</Text>
      <View className="flex-1">
        <Text className="text-[15px] text-text">{name}</Text>
        {note ? (
          <Text className="mt-0.5 text-[13px] italic text-text-3">{note}</Text>
        ) : null}
      </View>
    </View>
  );
}
