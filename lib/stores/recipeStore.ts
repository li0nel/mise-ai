import { create } from "zustand";
import type { Recipe } from "../../types";
import { RECIPES } from "../../data/recipes";

interface RecipeState {
  recipes: Recipe[];
  currentRecipeId: string | null;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  setCurrentRecipe: (id: string | null) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: RECIPES,
  currentRecipeId: null,

  addRecipe: (recipe: Recipe) =>
    set((state) => ({ recipes: [...state.recipes, recipe] })),

  updateRecipe: (id: string, updates: Partial<Recipe>) =>
    set((state) => ({
      recipes: state.recipes.map((r) =>
        r.id === id ? { ...r, ...updates } : r,
      ),
    })),

  setCurrentRecipe: (id: string | null) => set({ currentRecipeId: id }),

  getRecipeById: (id: string) => get().recipes.find((r) => r.id === id),
}));
