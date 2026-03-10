import { useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import { Button } from "../ui/Button";
import { useShoppingStore } from "../../lib/stores/shoppingStore";
import type { Recipe, ShoppingItem } from "../../types";
import { scaleAmount } from "../../lib/amounts";

interface AddToShoppingOverlayProps {
  visible: boolean;
  recipe: Recipe;
  servings: number;
  onClose: () => void;
  onAdd?: () => void;
}

export function AddToShoppingOverlay({
  visible,
  recipe,
  servings,
  onClose,
  onAdd,
}: AddToShoppingOverlayProps) {
  const addItems = useShoppingStore((state) => state.addItems);

  // Flatten all ingredients with section context
  const allIngredients = recipe.ingredientSections.flatMap((section) =>
    section.ingredients.map((ing) => ({
      ...ing,
      sectionName: section.name,
    })),
  );

  const [checkedIds, setCheckedIds] = useState<Set<number>>(
    () => new Set(allIngredients.map((_, i) => i)),
  );

  const toggleIngredient = useCallback((index: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleAdd = useCallback(() => {
    const selectedItems: ShoppingItem[] = allIngredients
      .filter((_, i) => checkedIds.has(i))
      .map((ing, i) => ({
        id: `shop-${recipe.id}-${String(i)}-${Date.now()}`,
        name: ing.name,
        amount: scaleAmount(ing.amount, recipe.servings, servings),
        unit: ing.unit,
        recipeId: recipe.id,
        recipeName: recipe.title,
        checked: false,
      }));

    addItems(selectedItems);
    (onAdd ?? onClose)();
  }, [allIngredients, checkedIds, recipe, servings, addItems, onClose, onAdd]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50" onPress={onClose}>
        <View className="mt-auto" onStartShouldSetResponder={() => true}>
          <View className="rounded-t-3xl bg-bg px-5 pb-[34px] pt-5">
            {/* Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-text">
                Add to Shopping List
              </Text>
              <Pressable onPress={onClose}>
                <Text className="text-[15px] text-text-3">Cancel</Text>
              </Pressable>
            </View>

            {/* Servings info */}
            <Text className="mb-4 text-[13px] text-text-2">
              {servings} serving{servings !== 1 ? "s" : ""} {"\u00B7"}{" "}
              {checkedIds.size} of {allIngredients.length} ingredients selected
            </Text>

            {/* Ingredient checklist */}
            <ScrollView className="max-h-[400px]">
              {allIngredients.map((ing, index) => {
                const isChecked = checkedIds.has(index);
                const displayAmount = [
                  scaleAmount(ing.amount, recipe.servings, servings),
                  ing.unit,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <Pressable
                    key={`${ing.name}-${String(index)}`}
                    onPress={() => toggleIngredient(index)}
                    className={`flex-row items-center gap-3 border-b border-border-subtle py-3 ${
                      !isChecked ? "opacity-40" : ""
                    }`}
                  >
                    <View
                      className={`h-5 w-5 items-center justify-center rounded border-[1.5px] ${
                        isChecked
                          ? "border-brand bg-brand"
                          : "border-border-strong bg-transparent"
                      }`}
                    >
                      {isChecked ? (
                        <Text className="text-[11px] font-bold text-text-inv">
                          {"\u2713"}
                        </Text>
                      ) : null}
                    </View>
                    <Text className="flex-1 text-[13px] text-text">
                      {ing.name}
                    </Text>
                    {displayAmount ? (
                      <Text className="text-[13px] text-text-2">
                        {displayAmount}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Add button */}
            <View className="mt-5">
              <Button
                variant="primary"
                onPress={handleAdd}
                disabled={checkedIds.size === 0}
              >
                {`Add ${String(checkedIds.size)} Item${checkedIds.size !== 1 ? "s" : ""} to List`}
              </Button>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
