import { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PageHeader } from "../../../components/ui/PageHeader";
import { CartIcon } from "../../../components/ui/Icons";
import { RecipeHero } from "../../../components/recipe/RecipeHero";
import { RecipeMetaBar } from "../../../components/recipe/RecipeMetaBar";
import { ServingsStepper } from "../../../components/recipe/ServingsStepper";
import { IngredientFullItem } from "../../../components/recipe/IngredientFullItem";
import { InstructionStep } from "../../../components/recipe/InstructionStep";
import { RecipeBottomBar } from "../../../components/recipe/RecipeBottomBar";
import { AddToShoppingOverlay } from "../../../components/overlays/AddToShoppingOverlay";
import { useRecipeStore } from "../../../lib/stores/recipeStore";

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

/** Parse a string amount to a number */
function parseAmount(amount: string): number | null {
  const trimmed = amount.trim();
  if (!trimmed) return null;

  for (const [char, value] of Object.entries(FRACTION_MAP)) {
    if (trimmed.includes(char)) {
      const prefix = trimmed.replace(char, "").trim();
      const whole = prefix ? parseFloat(prefix) : 0;
      if (!isNaN(whole)) return whole + value;
    }
  }

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

/** Format a number back to a display string */
function formatAmount(value: number): string {
  const rounded = Math.round(value * 100) / 100;

  if (rounded === Math.floor(rounded)) {
    return String(rounded);
  }

  const frac = rounded - Math.floor(rounded);
  const whole = Math.floor(rounded);
  const threshold = 0.04;

  const fractions: [number, string][] = [
    [0.25, "\u00BC"],
    [0.5, "\u00BD"],
    [0.75, "\u00BE"],
    [1 / 3, "\u2153"],
    [2 / 3, "\u2154"],
  ];

  for (const [fracValue, fracChar] of fractions) {
    if (Math.abs(frac - fracValue) < threshold) {
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

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recipe = useRecipeStore((state) => state.recipes.find((r) => r.id === id));
  const [servings, setServings] = useState<number | null>(null);
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [addedToShopping, setAddedToShopping] = useState(false);

  const handleOpenOverlay = useCallback(() => setShowAddOverlay(true), []);
  const handleCloseOverlay = useCallback(() => setShowAddOverlay(false), []);
  const handleItemsAdded = useCallback(() => {
    setShowAddOverlay(false);
    setAddedToShopping(true);
  }, []);

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <Text className="text-lg text-text-3">Recipe not found</Text>
      </View>
    );
  }

  const currentServings = servings ?? recipe.servings;

  return (
    <View className="flex-1 bg-bg">
      {/* Sticky page header — no title for recipe view */}
      <PageHeader
        rightAction={
          <Pressable
            className="h-[38px] w-[38px] items-center justify-center"
            onPress={() => router.push("/(main)/shopping")}
            accessibilityLabel="Shopping list"
          >
            <CartIcon size={20} color="#3D3329" />
          </Pressable>
        }
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <RecipeHero recipe={recipe} />

        {/* Meta bar */}
        <RecipeMetaBar
          prepTime={recipe.prepTime}
          cookTime={recipe.cookTime}
          servings={recipe.servings}
          difficulty={recipe.difficulty}
        />

        {/* Servings stepper */}
        <ServingsStepper
          servings={currentServings}
          onServingsChange={setServings}
        />

        {/* Ingredient sections — no top-level "Ingredients" heading per mock */}
        <View className="pt-5">
          {recipe.ingredientSections.map((section, sectionIndex) => (
            <View key={section.name ?? `section-${String(sectionIndex)}`}>
              {/* Section header */}
              {section.name ? (
                <View
                  className={`px-5 ${sectionIndex > 0 ? "border-t border-border-subtle pt-5" : ""} pb-2.5`}
                >
                  <Text className="text-[11px] font-bold uppercase tracking-wider text-text-3">
                    {section.name}
                  </Text>
                </View>
              ) : null}

              {/* Ingredient items */}
              <View className="px-5">
                {section.ingredients.map((ingredient) => {
                  const scaledAmount = scaleAmount(
                    ingredient.amount,
                    recipe.servings,
                    currentServings,
                  );
                  const displayAmount = [scaledAmount, ingredient.unit]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <IngredientFullItem
                      key={`${ingredient.name}-${ingredient.amount}`}
                      amount={displayAmount}
                      name={ingredient.name}
                      note={ingredient.notes}
                      isLast={ingredient === section.ingredients[section.ingredients.length - 1]}
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Section divider */}
        <View className="my-7 h-1.5 bg-bg-elevated" />

        {/* Instructions */}
        <View className="pb-5">
          <Text className="mb-5 px-5 text-[13px] font-bold uppercase tracking-wider text-text-3">
            Instructions
          </Text>
          {recipe.instructions.map((instruction) => (
            <InstructionStep
              key={instruction.stepNumber}
              stepNumber={instruction.stepNumber}
              text={instruction.text}
              timers={instruction.timers}
              warnings={instruction.warnings}
            />
          ))}
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <RecipeBottomBar onAddToShopping={handleOpenOverlay} recipeName={recipe.title} addedToShopping={addedToShopping} />

      {/* Add to shopping overlay */}
      <AddToShoppingOverlay
        visible={showAddOverlay}
        recipe={recipe}
        servings={currentServings}
        onClose={handleCloseOverlay}
        onAdd={handleItemsAdded}
      />
    </View>
  );
}
