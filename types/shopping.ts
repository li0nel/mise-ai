/** A single item in the shopping list */
export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  unit?: string;
  recipeId?: string;
  recipeName?: string;
  aisle?: string;
  checked: boolean;
}

/** Recipe group for "by recipe" view */
export interface ShoppingRecipeGroup {
  recipeId: string;
  recipeName: string;
  emoji?: string;
  items: ShoppingItem[];
}

/** Aisle group for "by aisle" view */
export interface ShoppingAisleGroup {
  aisle: string;
  icon: string;
  items: ShoppingItem[];
}

/** Sort mode for shopping list display */
export type ShoppingSortMode = "recipe" | "aisle";
