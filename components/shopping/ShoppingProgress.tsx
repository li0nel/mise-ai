import { View, Text, Pressable } from "react-native";
import type { ShoppingSortMode } from "../../types";

interface ShoppingProgressProps {
  checkedCount: number;
  totalCount: number;
  sortMode: ShoppingSortMode;
  onSortChange: (mode: ShoppingSortMode) => void;
}

export function ShoppingProgress({
  checkedCount,
  totalCount,
  sortMode,
  onSortChange,
}: ShoppingProgressProps) {
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <View className="flex-row items-center px-4 pt-2.5">
      {/* Progress info */}
      <View className="flex-1 min-w-0">
        <Text className="text-[13px] font-semibold text-text-2">
          {checkedCount} of {totalCount} items {"\u2713"}
        </Text>
        <View className="mt-1 h-[6px] rounded-full bg-bg-elevated overflow-hidden">
          <View
            className="h-full rounded-full bg-success"
            style={{ width: `${pct}%` }}
          />
        </View>
      </View>

      {/* Divider */}
      <View className="w-px h-8 bg-border mx-3" />

      {/* Sort toggle */}
      <View className="flex-row bg-bg-elevated rounded-full p-[3px] gap-0.5">
        <Pressable
          onPress={() => onSortChange("recipe")}
          className={`px-4 py-[7px] rounded-full ${
            sortMode === "recipe"
              ? "bg-bg-surface shadow-xs"
              : ""
          }`}
        >
          <Text
            className={`text-sm ${
              sortMode === "recipe"
                ? "font-semibold text-text"
                : "text-text-3"
            }`}
          >
            By Recipe
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onSortChange("aisle")}
          className={`px-4 py-[7px] rounded-full ${
            sortMode === "aisle"
              ? "bg-bg-surface shadow-xs"
              : ""
          }`}
        >
          <Text
            className={`text-sm ${
              sortMode === "aisle"
                ? "font-semibold text-text"
                : "text-text-3"
            }`}
          >
            By Aisle
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
