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
import { RecipeTags } from "../../../components/recipe/RecipeTags";
import { AiBlurb } from "../../../components/recipe/AiBlurb";
import { RecipeSources } from "../../../components/recipe/RecipeSources";
import { AddToShoppingOverlay } from "../../../components/overlays/AddToShoppingOverlay";
import { useRecipeStore } from "../../../lib/stores/recipeStore";
import { scaleAmount } from "../../../lib/amounts";

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recipe = useRecipeStore((state) =>
    state.recipes.find((r) => r.id === id),
  );
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

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 ? (
          <RecipeTags tags={recipe.tags} />
        ) : null}

        {/* AI blurb */}
        {recipe.aiBlurb ? <AiBlurb blurb={recipe.aiBlurb} /> : null}

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
                      isLast={
                        ingredient ===
                        section.ingredients[section.ingredients.length - 1]
                      }
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
              tips={instruction.tips}
            />
          ))}
        </View>

        {/* Sources */}
        {recipe.sources && recipe.sources.length > 0 ? (
          <RecipeSources
            sources={recipe.sources}
            analysisStats={recipe.analysisStats}
          />
        ) : null}
      </ScrollView>

      {/* Sticky bottom bar */}
      <RecipeBottomBar
        onAddToShopping={handleOpenOverlay}
        recipeName={recipe.title}
        addedToShopping={addedToShopping}
      />

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
