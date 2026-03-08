import { composeRecipeFromFullBlock } from "./recipeComposer";
import type { FullRecipeBlock } from "../../types/chat";

const sampleData: FullRecipeBlock["data"] = {
  id: "classic-potato-puree",
  title: "Classic Potato Puree",
  emoji: "🥔",
  time: "30 min",
  servings: 4,
  cuisine: "French",
  description: "Silky smooth mashed potatoes with butter and cream.",
  image: {
    gradient: "linear-gradient(160deg, #F5F0D0 0%, #D4C870 100%)",
    emoji: "🥔",
  },
  ingredients: {
    sections: [{ name: "Main" }],
    items: [
      { amount: "1", unit: "kg", name: "Yukon Gold potatoes" },
      { amount: "100", unit: "g", name: "Unsalted butter" },
      { amount: "120", unit: "ml", name: "Heavy cream", notes: "warmed" },
    ],
  },
  steps: [
    {
      stepNumber: 1,
      title: "Boil potatoes",
      text: "Peel and cut potatoes. Boil in salted water for 20 minutes.",
      timerPill: "20 min",
    },
    {
      stepNumber: 2,
      title: "Mash and enrich",
      text: "Drain and pass through a ricer. Fold in butter and cream.",
      tips: "A ricer gives the smoothest texture.",
    },
  ],
};

describe("composeRecipeFromFullBlock", () => {
  it("maps basic fields correctly", () => {
    const recipe = composeRecipeFromFullBlock(sampleData);
    expect(recipe.id).toBe("classic-potato-puree");
    expect(recipe.title).toBe("Classic Potato Puree");
    expect(recipe.emoji).toBe("🥔");
    expect(recipe.servings).toBe(4);
    expect(recipe.cuisines).toEqual(["French"]);
    expect(recipe.heroImage).toEqual(sampleData.image);
  });

  it("converts time string to cookTime seconds", () => {
    const recipe = composeRecipeFromFullBlock(sampleData);
    expect(recipe.cookTime).toBe(1800); // 30 min = 1800s
  });

  it("maps ingredients with sections", () => {
    const recipe = composeRecipeFromFullBlock(sampleData);
    expect(recipe.ingredientSections).toHaveLength(1);
    expect(recipe.ingredientSections[0]?.name).toBe("Main");
    expect(recipe.ingredientSections[0]?.ingredients).toHaveLength(3);
    expect(recipe.ingredientSections[0]?.ingredients[0]?.name).toBe(
      "Yukon Gold potatoes",
    );
  });

  it("maps ingredients without sections", () => {
    const noSections: FullRecipeBlock["data"] = {
      ...sampleData,
      ingredients: { items: sampleData.ingredients.items },
    };
    const recipe = composeRecipeFromFullBlock(noSections);
    expect(recipe.ingredientSections).toHaveLength(1);
    expect(recipe.ingredientSections[0]?.ingredients).toHaveLength(3);
  });

  it("maps steps to instructions", () => {
    const recipe = composeRecipeFromFullBlock(sampleData);
    expect(recipe.instructions).toHaveLength(2);
    expect(recipe.instructions[0]?.stepNumber).toBe(1);
    expect(recipe.instructions[0]?.title).toBe("Boil potatoes");
    expect(recipe.instructions[0]?.timers).toEqual([
      { duration: "20 min", activity: "Boil potatoes" },
    ]);
    expect(recipe.instructions[1]?.tips).toEqual([
      "A ricer gives the smoothest texture.",
    ]);
  });
});
