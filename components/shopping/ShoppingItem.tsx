import { View, Text, Pressable } from "react-native";
import type { ShoppingItem as ShoppingItemType } from "../../types";

interface ShoppingItemProps {
  item: ShoppingItemType;
  onToggle: (id: string) => void;
}

export function ShoppingItem({ item, onToggle }: ShoppingItemProps) {
  const amount = item.unit ? `${item.amount} ${item.unit}` : item.amount;

  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      className="flex-row items-center gap-3 py-3 border-b border-border-subtle"
      style={item.checked ? { opacity: 0.55 } : undefined}
    >
      {/* Checkbox */}
      <View
        className={`w-5 h-5 items-center justify-center ${
          item.checked
            ? "bg-success rounded-full"
            : "border-2 border-border-strong rounded-full"
        }`}
      >
        {item.checked && (
          <Text className="text-[10px] text-white font-bold">{"\u2713"}</Text>
        )}
      </View>

      {/* Info */}
      <View className="flex-1 min-w-0">
        <Text
          className={`text-base leading-snug ${
            item.checked ? "line-through text-text-3" : "text-text"
          }`}
        >
          {item.name}
        </Text>
        <Text className="text-sm text-text-2 mt-px">{amount}</Text>
        {item.recipeName ? (
          <Text className="text-xs text-text-3 mt-0.5">{item.recipeName}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
