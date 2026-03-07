import { useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import { Button } from "../ui/Button";
import { useShoppingStore } from "../../lib/stores/shoppingStore";
import type { Recipe } from "../../types";
import type { ShoppingItem } from "../../types";

interface AddToShoppingOverlayProps {
  visible: boolean;
  recipe: Recipe;
  servings: number;
  onClose: () => void;
}

export function AddToShoppingOverlay({
  visible,
  recipe,
  servings,
  onClose,
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
    onClose();
  }, [allIngredients, checkedIds, recipe, servings, addItems, onClose]);

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

/** Unicode fraction map */
const FRACTION_MAP: Record<string, number> = {
  "\u00BC": 0.25,
  "\u00BD": 0.5,
  "\u00BE": 0.75,
  "\u2153": 1 / 3,
  "\u2154": 2 / 3,
  "\u215B": 0.125,
  "\u215C": 0.375,
  "\u215D": 0.625,
  "\u215E": 0.875,
};

/** Parse a string amount into a number (handles fractions like "1 1/2", "½", etc.) */
function parseAmount(amount: string): number | null {
  const trimmed = amount.trim();
  if (!trimmed) return null;

  // Check for unicode fractions
  for (const [char, value] of Object.entries(FRACTION_MAP)) {
    if (trimmed.includes(char)) {
      const prefix = trimmed.replace(char, "").trim();
      const whole = prefix ? parseFloat(prefix) : 0;
      if (!isNaN(whole)) return whole + value;
    }
  }

  // Handle "1/2" style fractions
  const fractionMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (fractionMatch?.[1] && fractionMatch[2] && fractionMatch[3]) {
    return (
      parseInt(fractionMatch[1], 10) +
      parseInt(fractionMatch[2], 10) / parseInt(fractionMatch[3], 10)
    );
  }

  const simpleFraction = trimmed.match(/^(\d+)\/(\d+)$/);
  if (simpleFraction?.[1] && simpleFraction[2]) {
    return parseInt(simpleFraction[1], 10) / parseInt(simpleFraction[2], 10);
  }

  const num = parseFloat(trimmed);
  return isNaN(num) ? null : num;
}

/** Format a number back to a human-readable amount */
function formatAmount(value: number): string {
  // Round to 2 decimal places
  const rounded = Math.round(value * 100) / 100;

  // Check if it's a whole number
  if (rounded === Math.floor(rounded)) {
    return String(rounded);
  }

  // Common fractions
  const frac = rounded - Math.floor(rounded);
  const whole = Math.floor(rounded);
  const fractionThreshold = 0.04;

  const fractions: Array<[number, string]> = [
    [0.25, "\u00BC"],
    [0.5, "\u00BD"],
    [0.75, "\u00BE"],
    [1 / 3, "\u2153"],
    [2 / 3, "\u2154"],
  ];

  for (const [fracValue, fracChar] of fractions) {
    if (Math.abs(frac - fracValue) < fractionThreshold) {
      return whole > 0 ? `${String(whole)} ${fracChar}` : fracChar;
    }
  }

  return String(rounded);
}

/** Scale an amount string proportionally */
function scaleAmount(
  amount: string,
  originalServings: number,
  newServings: number,
): string {
  if (originalServings === newServings) return amount;

  const parsed = parseAmount(amount);
  if (parsed === null) return amount;

  const scaled = (parsed * newServings) / originalServings;
  return formatAmount(scaled);
}
