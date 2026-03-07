import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PageHeader } from "../../../components/ui/PageHeader";
import { RecipeHero } from "../../../components/recipe/RecipeHero";
import { RecipeMetaBar } from "../../../components/recipe/RecipeMetaBar";
import { ServingsStepper } from "../../../components/recipe/ServingsStepper";
import { IngredientFullItem } from "../../../components/recipe/IngredientFullItem";
import { InstructionStep } from "../../../components/recipe/InstructionStep";
import { RecipeBottomBar } from "../../../components/recipe/RecipeBottomBar";
import { RECIPES } from "../../../data/recipes";

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = RECIPES.find((r) => r.id === id);

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <Text className="text-lg text-text-3">Recipe not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      {/* Sticky page header */}
      <PageHeader
        rightAction={
          <View className="h-9 w-9 items-center justify-center">
            <Text className="text-lg text-text">{"\uD83D\uDED2"}</Text>
          </View>
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
        <ServingsStepper initialServings={recipe.servings} />

        {/* Ingredient sections */}
        <View className="pt-5">
          {recipe.ingredientSections.map((section, sectionIndex) => (
            <View key={section.name ?? `section-${String(sectionIndex)}`}>
              {/* Section header */}
              {section.name ? (
                <View
                  className={`px-5 ${sectionIndex > 0 ? "border-t border-border-subtle pt-5" : ""} pb-2.5`}
                >
                  <Text className="text-xs font-bold uppercase tracking-wider text-text-3">
                    {section.name}
                  </Text>
                </View>
              ) : null}

              {/* Ingredient items */}
              {section.ingredients.map((ingredient) => {
                const displayAmount = [ingredient.amount, ingredient.unit]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <IngredientFullItem
                    key={`${ingredient.name}-${ingredient.amount}`}
                    amount={displayAmount}
                    name={ingredient.name}
                    note={ingredient.notes}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {/* Section divider */}
        <View className="my-7 h-1.5 bg-bg-elevated" />

        {/* Instructions */}
        <View className="pb-5">
          <Text className="mb-5 px-5 text-lg font-bold text-text">
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
      <RecipeBottomBar />
    </View>
  );
}
