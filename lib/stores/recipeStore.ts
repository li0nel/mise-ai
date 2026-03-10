import { create } from "zustand";
import type { Recipe } from "../../types";
import {
  addRecipe as firestoreAddRecipe,
  deleteRecipe as firestoreDeleteRecipe,
} from "../firebase/recipes";
import { auth } from "../firebase";

interface RecipeState {
  recipes: Recipe[];
  currentRecipeId: string | null;
  addRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  setRecipes: (recipes: Recipe[]) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  setCurrentRecipe: (id: string | null) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  currentRecipeId: null,

  addRecipe: async (recipe: Recipe) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await firestoreAddRecipe(uid, recipe);
  },

  deleteRecipe: async (id: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await firestoreDeleteRecipe(uid, id);
  },

  setRecipes: (recipes: Recipe[]) => set({ recipes }),

  updateRecipe: (id: string, updates: Partial<Recipe>) =>
    set((state) => ({
      recipes: state.recipes.map((r) =>
        r.id === id ? { ...r, ...updates } : r,
      ),
    })),

  setCurrentRecipe: (id: string | null) => set({ currentRecipeId: id }),

  getRecipeById: (id: string) => get().recipes.find((r) => r.id === id),
}));
