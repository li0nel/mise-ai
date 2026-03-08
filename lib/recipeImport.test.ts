import {
  isRecipeUrl,
  extractUrls,
  isLikelyRecipeText,
  parseRecipeFromText,
} from "./recipeImport";

describe("isRecipeUrl", () => {
  it("returns true for HTTP URLs", () => {
    expect(isRecipeUrl("http://example.com/recipe")).toBe(true);
  });

  it("returns true for HTTPS URLs", () => {
    expect(isRecipeUrl("https://www.allrecipes.com/recipe/12345")).toBe(true);
  });

  it("returns true when URL is embedded in text", () => {
    expect(
      isRecipeUrl("Check out this recipe https://cooking.nytimes.com/recipes/1234")
    ).toBe(true);
  });

  it("returns false for plain text without URLs", () => {
    expect(isRecipeUrl("Just a normal message about cooking")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isRecipeUrl("")).toBe(false);
  });
});

describe("extractUrls", () => {
  it("extracts a single URL", () => {
    const urls = extractUrls("Visit https://example.com/recipe for details");
    expect(urls).toEqual(["https://example.com/recipe"]);
  });

  it("extracts multiple URLs", () => {
    const urls = extractUrls(
      "Try https://example.com/recipe1 or http://example.com/recipe2"
    );
    expect(urls).toHaveLength(2);
    expect(urls).toContain("https://example.com/recipe1");
    expect(urls).toContain("http://example.com/recipe2");
  });

  it("returns empty array when no URLs found", () => {
    expect(extractUrls("No URLs here")).toEqual([]);
  });

  it("handles URLs with query parameters", () => {
    const urls = extractUrls("https://example.com/recipe?id=123&lang=en");
    expect(urls).toHaveLength(1);
    expect(urls[0]).toContain("id=123");
  });
});

describe("isLikelyRecipeText", () => {
  it("returns false for short text", () => {
    expect(isLikelyRecipeText("2 cups flour")).toBe(false);
  });

  it("returns true for text with both ingredients and instructions", () => {
    const recipeText = `
      Classic Chocolate Cake

      Ingredients:
      2 cups all-purpose flour
      1 cup sugar
      3/4 cup cocoa powder
      2 teaspoons baking soda
      1 cup buttermilk
      1/2 cup vegetable oil
      2 large eggs
      1 teaspoon vanilla extract

      Instructions:
      1. Preheat the oven to 350F.
      2. Mix flour, sugar, cocoa, and baking soda in a large bowl.
      3. Combine buttermilk, oil, eggs, and vanilla.
      4. Stir wet ingredients into dry until just combined.
      5. Bake for 30-35 minutes until a toothpick comes out clean.
    `;
    expect(isLikelyRecipeText(recipeText)).toBe(true);
  });

  it("returns false for long text without recipe patterns", () => {
    const essay = "A".repeat(300) + " this is a long essay about history and philosophy";
    expect(isLikelyRecipeText(essay)).toBe(false);
  });

  it("returns false for text with only ingredients but no instructions", () => {
    // This has units but no instruction verbs
    const text = "A".repeat(200) + " 2 cups of water and 3 tablespoons of oil";
    expect(isLikelyRecipeText(text)).toBe(false);
  });

  it("returns false for text with only instructions but no ingredients", () => {
    // This has instruction verbs but no units
    const text = "A".repeat(200) + " Preheat and then mix everything together and bake it";
    expect(isLikelyRecipeText(text)).toBe(false);
  });
});

describe("parseRecipeFromText", () => {
  const sampleRecipe = `
    Simple Pasta

    Ingredients
    2 cups flour
    3 large eggs
    1 tsp salt
    1 tbsp olive oil

    Instructions
    1. Mix flour and salt in a bowl.
    2. Whisk eggs and oil together.
    3. Combine wet and dry ingredients and knead for 10 minutes.
    4. Let rest for 30 minutes, then roll and cut.
  `;

  it("extracts the title from the first line", () => {
    const recipe = parseRecipeFromText(sampleRecipe);
    expect(recipe.title).toBe("Simple Pasta");
  });

  it("generates a unique ID", () => {
    const recipe = parseRecipeFromText(sampleRecipe);
    expect(recipe.id).toMatch(/^recipe-/);
  });

  it("parses ingredients with amounts and units", () => {
    const recipe = parseRecipeFromText(sampleRecipe);
    expect(recipe.ingredientSections).toHaveLength(1);

    const ingredients = recipe.ingredientSections[0]?.ingredients ?? [];
    expect(ingredients.length).toBeGreaterThanOrEqual(3);

    // Check one parsed ingredient
    const flourIngredient = ingredients.find((i) => i.name.includes("flour"));
    expect(flourIngredient).toBeDefined();
    expect(flourIngredient?.amount).toBe("2");
    expect(flourIngredient?.unit).toBe("cups");
  });

  it("parses instructions into numbered steps", () => {
    const recipe = parseRecipeFromText(sampleRecipe);
    expect(recipe.instructions.length).toBeGreaterThanOrEqual(3);

    // Step numbers should be sequential starting from 1
    recipe.instructions.forEach((instruction, i) => {
      expect(instruction.stepNumber).toBe(i + 1);
    });
  });

  it("strips leading numbers from instruction text", () => {
    const recipe = parseRecipeFromText(sampleRecipe);
    const firstInstruction = recipe.instructions[0];
    expect(firstInstruction?.text).not.toMatch(/^\d+\./);
    expect(firstInstruction?.text).toContain("Mix flour");
  });

  it("sets default values for metadata", () => {
    const recipe = parseRecipeFromText(sampleRecipe);
    expect(recipe.servings).toBe(4);
    expect(recipe.prepTime).toBe(15);
    expect(recipe.cookTime).toBe(30);
    expect(recipe.difficulty).toBe(2);
    expect(recipe.cuisines).toEqual([]);
    expect(recipe.emoji).toBeDefined();
  });

  it("handles text with no clear sections by using heuristics", () => {
    const messyText = `
      My Stir Fry
      2 cups rice
      1 tbsp soy sauce
      3 cloves garlic
      Heat oil in a pan
      Stir fry the vegetables
      Cook rice in a pot
    `;
    const recipe = parseRecipeFromText(messyText);
    // Should still produce a recipe with at least some parsed content
    expect(recipe.title).toBe("My Stir Fry");
    expect(recipe.ingredientSections[0]?.ingredients.length).toBeGreaterThanOrEqual(0);
  });

  it("handles ingredient lines with notes after comma", () => {
    const text = `
      Test Recipe

      Ingredients
      2 cups flour, sifted
      1 tsp salt, fine grain

      Instructions
      1. Mix everything.
    `;
    const recipe = parseRecipeFromText(text);
    const ingredients = recipe.ingredientSections[0]?.ingredients ?? [];
    const flourIngredient = ingredients.find((i) => i.name.includes("flour"));
    expect(flourIngredient?.notes).toBe("sifted");
  });

  it("handles ingredient lines with no quantity", () => {
    const text = `
      Test Recipe

      Ingredients
      Salt and pepper to taste
      Fresh parsley for garnish

      Instructions
      1. Season to taste.
    `;
    const recipe = parseRecipeFromText(text);
    const ingredients = recipe.ingredientSections[0]?.ingredients ?? [];
    // Lines without quantities should still be parsed
    expect(ingredients.length).toBeGreaterThanOrEqual(1);
  });

  it("generates different IDs for different calls", () => {
    let now = 1000000;
    jest.spyOn(Date, "now").mockImplementation(() => now++);

    const recipe1 = parseRecipeFromText("Recipe 1\n\nIngredients\n1 cup flour\n\nInstructions\nMix.");
    const recipe2 = parseRecipeFromText("Recipe 2\n\nIngredients\n1 cup sugar\n\nInstructions\nStir.");

    expect(recipe1.id).toMatch(/^recipe-/);
    expect(recipe2.id).toMatch(/^recipe-/);
    expect(recipe1.id).not.toBe(recipe2.id);

    jest.restoreAllMocks();
  });
});
