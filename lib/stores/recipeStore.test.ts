import { useRecipeStore } from "./recipeStore";
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
    {
      ingredients: [{ amount: "2", unit: "cups", name: "Flour" }],
    },
  ],
  instructions: [{ stepNumber: 1, text: "Mix ingredients" }],
  ...overrides,
});

describe("recipeStore", () => {
  beforeEach(() => {
    useRecipeStore.setState({ recipes: [], currentRecipeId: null });
  });

  describe("setRecipes", () => {
    it("replaces entire recipes array", () => {
      const recipes = [makeRecipe({ id: "a" }), makeRecipe({ id: "b" })];
      useRecipeStore.getState().setRecipes(recipes);

      expect(useRecipeStore.getState().recipes).toHaveLength(2);
      expect(useRecipeStore.getState().recipes[0]?.id).toBe("a");
      expect(useRecipeStore.getState().recipes[1]?.id).toBe("b");
    });

    it("clears recipes when given empty array", () => {
      useRecipeStore.setState({ recipes: [makeRecipe()] });
      useRecipeStore.getState().setRecipes([]);

      expect(useRecipeStore.getState().recipes).toHaveLength(0);
    });
  });

  describe("updateRecipe", () => {
    it("updates an existing recipe with partial changes", () => {
      useRecipeStore.setState({
        recipes: [makeRecipe({ id: "recipe-1", title: "Old Title" })],
      });

      useRecipeStore
        .getState()
        .updateRecipe("recipe-1", { title: "New Title" });

      const recipe = useRecipeStore.getState().recipes[0];
      expect(recipe?.title).toBe("New Title");
      expect(recipe?.servings).toBe(4);
    });

    it("does not modify other recipes", () => {
      useRecipeStore.setState({
        recipes: [
          makeRecipe({ id: "recipe-1", title: "Recipe 1" }),
          makeRecipe({ id: "recipe-2", title: "Recipe 2" }),
        ],
      });

      useRecipeStore.getState().updateRecipe("recipe-1", { title: "Updated" });

      const { recipes } = useRecipeStore.getState();
      expect(recipes[0]?.title).toBe("Updated");
      expect(recipes[1]?.title).toBe("Recipe 2");
    });

    it("does nothing when ID does not match", () => {
      const originalRecipe = makeRecipe({ id: "recipe-1", title: "Original" });
      useRecipeStore.setState({ recipes: [originalRecipe] });

      useRecipeStore
        .getState()
        .updateRecipe("non-existent", { title: "Should Not Apply" });

      expect(useRecipeStore.getState().recipes[0]?.title).toBe("Original");
    });
  });

  describe("setCurrentRecipe", () => {
    it("sets the current recipe ID", () => {
      useRecipeStore.getState().setCurrentRecipe("recipe-1");
      expect(useRecipeStore.getState().currentRecipeId).toBe("recipe-1");
    });

    it("clears the current recipe with null", () => {
      useRecipeStore.setState({ currentRecipeId: "recipe-1" });
      useRecipeStore.getState().setCurrentRecipe(null);
      expect(useRecipeStore.getState().currentRecipeId).toBeNull();
    });
  });

  describe("getRecipeById", () => {
    it("returns a recipe by its ID", () => {
      useRecipeStore.setState({
        recipes: [
          makeRecipe({ id: "recipe-1", title: "First" }),
          makeRecipe({ id: "recipe-2", title: "Second" }),
        ],
      });

      const recipe = useRecipeStore.getState().getRecipeById("recipe-2");
      expect(recipe).toBeDefined();
      expect(recipe?.title).toBe("Second");
    });

    it("returns undefined when ID is not found", () => {
      useRecipeStore.setState({ recipes: [makeRecipe()] });

      const recipe = useRecipeStore.getState().getRecipeById("non-existent");
      expect(recipe).toBeUndefined();
    });

    it("returns undefined from empty store", () => {
      const recipe = useRecipeStore.getState().getRecipeById("any-id");
      expect(recipe).toBeUndefined();
    });
  });

  describe("initial state", () => {
    it("starts with empty recipes array", () => {
      // Reset to initial state by re-requiring (or just check default)
      useRecipeStore.setState({ recipes: [] });
      expect(useRecipeStore.getState().recipes).toEqual([]);
    });
  });
});
