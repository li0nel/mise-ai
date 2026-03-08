import type { Recipe } from "../../types";
import type { FullRecipeBlock } from "../../types/chat";
import { parseDurationToSeconds } from "../duration";

/** Convert a full-recipe block's data to a Recipe object for storage */
export function composeRecipeFromFullBlock(
  data: FullRecipeBlock["data"],
): Recipe {
  const totalSeconds = parseDurationToSeconds(data.time);

  return {
    id: data.id,
    title: data.title,
    emoji: data.emoji,
    cuisines: [data.cuisine],
    heroImage: data.image,
    prepTime: 0,
    cookTime: totalSeconds,
    servings: data.servings,
    difficulty: 2,
    ingredientSections: data.ingredients.sections
      ? data.ingredients.sections.map((section, i) => ({
          name: section.name,
          ingredients:
            i === 0
              ? data.ingredients.items.map((item) => ({
                  amount: item.amount,
                  unit: item.unit,
                  name: item.name,
                  notes: item.notes,
                  optional: item.optional,
                }))
              : [],
        }))
      : [
          {
            ingredients: data.ingredients.items.map((item) => ({
              amount: item.amount,
              unit: item.unit,
              name: item.name,
              notes: item.notes,
              optional: item.optional,
            })),
          },
        ],
    instructions: data.steps.map((step) => ({
      stepNumber: step.stepNumber,
      title: step.title,
      text: step.text,
      tips: step.tips ? [step.tips] : undefined,
      warnings: step.warnings,
      timers: step.timerPill
        ? [{ duration: step.timerPill, activity: step.title }]
        : undefined,
    })),
  };
}
