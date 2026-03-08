import { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import type { FullRecipeBlock } from "../../types";
import { IngredientFullItem } from "../recipe/IngredientFullItem";
import { RichStepText } from "../shared/RichStepText";
import { composeRecipeFromFullBlock } from "../../lib/ai/recipeComposer";
import { useRecipeStore } from "../../lib/stores/recipeStore";

interface FullRecipeProps {
  data: FullRecipeBlock["data"];
}

export function FullRecipe({ data }: FullRecipeProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    const recipe = composeRecipeFromFullBlock(data);
    useRecipeStore.getState().addRecipe(recipe);
    setSaved(true);
  }, [data]);

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-surface">
      {/* Hero header */}
      <View className="items-center border-b border-border bg-bg-elevated px-4 py-5">
        <Text className="text-[40px]">{data.emoji}</Text>
        <Text className="mt-2 text-center text-[17px] font-bold text-text">
          {data.title}
        </Text>
        <View className="mt-2 flex-row items-center gap-3">
          <Text className="text-[11px] text-text-3">{data.time}</Text>
          <Text className="text-[11px] text-text-3">
            {data.servings} servings
          </Text>
          <Text className="text-[11px] text-text-3">{data.cuisine}</Text>
        </View>
        <Text className="mt-2.5 text-center text-[13px] leading-relaxed text-text-2">
          {data.description}
        </Text>
      </View>

      {/* Ingredients section */}
      <View className="border-b border-border px-3.5 py-3">
        <Text className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand">
          Ingredients
        </Text>
        {data.ingredients.items.map((item, index) => (
          <IngredientFullItem
            key={`${item.name}-${index}`}
            amount={item.unit ? `${item.amount} ${item.unit}` : item.amount}
            name={item.name}
            note={item.notes}
            isLast={index === data.ingredients.items.length - 1}
          />
        ))}
      </View>

      {/* Steps section */}
      <View className="px-3.5 py-3">
        <Text className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand">
          Steps
        </Text>
        {data.steps.map((step, index) => {
          const isLast = index === data.steps.length - 1;
          return (
            <View
              key={step.stepNumber}
              className={`py-[13px] ${isLast ? "" : "border-b border-border"}`}
            >
              <View className="mb-2 flex-row items-center gap-2">
                <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-brand">
                  <Text className="text-[11px] font-bold text-white">
                    {step.stepNumber}
                  </Text>
                </View>
                <Text className="text-[13px] font-semibold text-text">
                  {step.title}
                </Text>
              </View>

              <RichStepText
                text={step.text}
                className="text-[13px] leading-relaxed text-text"
              />

              {step.timerPill ? (
                <View className="mt-2 self-start rounded-full bg-warning-bg px-2 py-[3px]">
                  <Text className="text-[11px] font-semibold text-warning">
                    {"\u23F1"} {step.timerPill}
                  </Text>
                </View>
              ) : null}

              {step.tips ? (
                <View className="mt-2.5 flex-row items-start gap-2 rounded-lg bg-info-bg p-[11px]">
                  <Text className="text-[13px]">{"\uD83D\uDCA1"}</Text>
                  <Text className="flex-1 text-[13px] leading-snug text-info">
                    {step.tips}
                  </Text>
                </View>
              ) : null}

              {step.warnings?.map((warning, wIndex) => (
                <View
                  key={wIndex}
                  className="mt-2.5 flex-row items-start gap-[7px] rounded-md border border-[#FDE68A] bg-warning-bg px-3 py-[9px]"
                >
                  <Text className="text-[11px]">{warning.icon}</Text>
                  <Text className="flex-1 text-[11px] leading-snug text-warning">
                    {warning.text}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>

      {/* Save action row */}
      <View className="border-t border-border px-3.5 py-3">
        {saved ? (
          <View className="items-center justify-center px-4 py-2.5">
            <Text className="text-[13px] font-semibold text-text-2">
              {"\u2713"} Saved to My Recipes
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={handleSave}
            className="items-center justify-center rounded-md bg-brand px-4 py-2.5"
          >
            <Text className="text-[13px] font-bold text-text-inv">
              Save to My Recipes
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
