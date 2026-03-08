import { useCallback, useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { IngredientsBlock, WidgetAction, ShoppingItem } from "../../types";
import { ActionButton } from "./ActionButton";
import { useChatStore } from "../../lib/stores/chatStore";
import { useShoppingStore } from "../../lib/stores/shoppingStore";

interface IngredientsWidgetProps {
  data: IngredientsBlock["data"];
}

export function IngredientsWidget({ data }: IngredientsWidgetProps) {
  const [checkedSet, setCheckedSet] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    data.items.forEach((item, i) => {
      if (item.checked) initial.add(i);
    });
    return initial;
  });

  const toggleChecked = useCallback((index: number) => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleAction = useCallback(
    (action: WidgetAction) => {
      if (action.actionType === "direct" && action.directAction === "add-to-shopping") {
        const shoppingItems: ShoppingItem[] = data.items.map((item, index) => ({
          id: `shop-${data.recipeTitle}-${index}-${Date.now()}`,
          name: item.name,
          amount: item.amount,
          unit: item.unit,
          recipeName: data.recipeTitle,
          checked: false,
        }));
        useShoppingStore.getState().addItems(shoppingItems);
      } else if (action.actionType === "chat") {
        useChatStore.getState().sendMessage(action.chatMessage ?? action.label);
      }
    },
    [data.items, data.recipeTitle],
  );

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-surface shadow-xs">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border-subtle px-4 py-3.5">
        <View>
          <Text className="text-[15px] font-semibold text-text">
            {"\uD83E\uDDC2"} Ingredients
          </Text>
          <Text className="mt-0.5 text-[11px] text-text-3">
            {data.servings} servings {"\u00B7"} {data.totalItems} items
          </Text>
        </View>
        <View className="rounded-full bg-bg-elevated px-3 py-1">
          <Text className="text-[11px] font-semibold text-text-2">
            {data.servings} servings
          </Text>
        </View>
      </View>

      {/* Section headers and ingredients list */}
      <View>
        {data.sections?.map((section) => (
          <View key={section.name} className="px-4 pb-2 pt-3">
            <Text className="text-[11px] font-semibold uppercase tracking-wider text-text-3">
              {section.name}
            </Text>
          </View>
        ))}

        {data.items.map((item, index) => {
          const isLast = index === data.items.length - 1;
          const isChecked = checkedSet.has(index);
          return (
            <Pressable
              key={`${item.name}-${index}`}
              onPress={() => toggleChecked(index)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              className={`flex-row items-center gap-3 px-4 py-2.5 ${isLast ? "" : "border-b border-border-subtle"}`}
            >
              {/* Checkbox */}
              <View
                className={`h-5 w-5 items-center justify-center rounded-xs border-2 ${
                  isChecked
                    ? "border-brand bg-brand"
                    : "border-border bg-transparent"
                }`}
              >
                {isChecked ? (
                  <Text className="text-[10px] text-text-inv">{"\u2713"}</Text>
                ) : null}
              </View>

              {/* Name + optional note */}
              <View className={`flex-1 ${isChecked ? "opacity-50" : ""}`}>
                <Text className="text-[13px] leading-snug text-text">
                  {item.name}
                </Text>
                {item.notes ? (
                  <Text className="mt-px text-[11px] text-text-3">
                    {item.notes}
                  </Text>
                ) : null}
              </View>

              {/* Amount */}
              <Text className={`ml-auto shrink-0 text-right text-[13px] font-semibold tabular-nums text-text-2 ${isChecked ? "opacity-50" : ""}`}>
                {item.amount}
                {item.unit ? ` ${item.unit}` : ""}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Action buttons */}
      {data.actions && data.actions.length > 0 ? (
        <View className="flex-row gap-2 px-4 pb-4 pt-2">
          {data.actions.map((action) => (
            <ActionButton key={action.label} action={action} onPress={() => handleAction(action)} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
