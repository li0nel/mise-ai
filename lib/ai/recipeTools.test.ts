import { useRecipeStore } from "../stores/recipeStore";
import {
  handleSearchMyRecipes,
  handleGetMyRecipe,
  handleListMyRecipes,
  executeToolCall,
} from "./recipeTools";
import type { Recipe } from "../../types";

const makeRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  id: "test-recipe",
  title: "Test Recipe",
  emoji: "\u{1F355}",
  cuisines: ["Italian"],
  prepTime: 10,
  cookTime: 20,
  servings: 4,
  difficulty: 2,
  ingredientSections: [
    { ingredients: [{ amount: "2", unit: "cups", name: "Flour" }] },
  ],
  instructions: [{ stepNumber: 1, text: "Mix ingredients" }],
  ...overrides,
});

const sampleRecipes: Recipe[] = [
  makeRecipe({
    id: "massaman-curry",
    title: "Massaman Curry",
    cuisines: ["Thai"],
    ingredientSections: [
      {
        ingredients: [
          { amount: "1", unit: "kg", name: "Beef chuck" },
          { amount: "800", unit: "ml", name: "Coconut milk" },
        ],
      },
    ],
  }),
  makeRecipe({
    id: "chicken-tikka",
    title: "Chicken Tikka Masala",
    cuisines: ["Indian"],
    ingredientSections: [
      {
        ingredients: [
          { amount: "500", unit: "g", name: "Chicken thighs" },
          { amount: "1", unit: "cup", name: "Yogurt" },
        ],
      },
    ],
  }),
  makeRecipe({
    id: "potato-puree",
    title: "Classic Potato Puree",
    cuisines: ["French"],
  }),
];

describe("recipeTools handlers", () => {
  beforeEach(() => {
    useRecipeStore.setState({ recipes: sampleRecipes });
  });

  describe("handleSearchMyRecipes", () => {
    it("finds recipes matching title (case-insensitive)", () => {
      const result = handleSearchMyRecipes({ query: "curry" });
      expect(result.count).toBe(1);
      expect((result.results as { id: string }[])[0]?.id).toBe(
        "massaman-curry",
      );
    });

    it("finds recipes matching cuisine", () => {
      const result = handleSearchMyRecipes({ query: "thai" });
      expect(result.count).toBe(1);
    });

    it("finds recipes matching ingredient name", () => {
      const result = handleSearchMyRecipes({ query: "chicken" });
      expect(result.count).toBe(1);
      expect((result.results as { id: string }[])[0]?.id).toBe("chicken-tikka");
    });

    it("returns empty results for no match", () => {
      const result = handleSearchMyRecipes({ query: "sushi" });
      expect(result.count).toBe(0);
      expect(result.results).toEqual([]);
    });
  });

  describe("handleGetMyRecipe", () => {
    it("returns recipe when found", () => {
      const result = handleGetMyRecipe({ recipeId: "massaman-curry" });
      expect(result.recipe).toBeDefined();
      expect((result.recipe as Recipe).title).toBe("Massaman Curry");
    });

    it("returns error when recipe not found", () => {
      const result = handleGetMyRecipe({ recipeId: "non-existent" });
      expect(result.error).toBe("Recipe not found");
    });
  });

  describe("handleListMyRecipes", () => {
    it("returns compact list of all recipes", () => {
      const result = handleListMyRecipes();
      expect(result.count).toBe(3);
      const recipes = result.recipes as { id: string; title: string }[];
      expect(recipes[0]?.title).toBe("Massaman Curry");
      expect(recipes[1]?.title).toBe("Chicken Tikka Masala");
      expect(recipes[2]?.title).toBe("Classic Potato Puree");
    });

    it("returns empty list when no recipes", () => {
      useRecipeStore.setState({ recipes: [] });
      const result = handleListMyRecipes();
      expect(result.count).toBe(0);
    });
  });

  describe("executeToolCall", () => {
    it("dispatches to searchMyRecipes", () => {
      const result = executeToolCall("searchMyRecipes", { query: "potato" });
      expect(result.count).toBe(1);
    });

    it("dispatches to getMyRecipe", () => {
      const result = executeToolCall("getMyRecipe", {
        recipeId: "potato-puree",
      });
      expect((result.recipe as Recipe).title).toBe("Classic Potato Puree");
    });

    it("dispatches to listMyRecipes", () => {
      const result = executeToolCall("listMyRecipes", {});
      expect(result.count).toBe(3);
    });

    it("returns error for unknown function", () => {
      const result = executeToolCall("unknownFunction", {});
      expect(result.error).toBe("Unknown function: unknownFunction");
    });
  });
});
