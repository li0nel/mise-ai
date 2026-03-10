/** A single ingredient in a recipe */
export interface Ingredient {
  amount: string;
  unit?: string;
  name: string;
  notes?: string;
  optional?: boolean;
}

/** A grouped section of ingredients (e.g., "Dipping Sauces") */
export interface IngredientSection {
  name?: string;
  ingredients: Ingredient[];
}

/** A warning attached to a cooking step */
export interface StepWarning {
  icon: string;
  text: string;
}

/** A timer reference in a step */
export interface StepTimer {
  duration: string;
  activity: string;
}

/** A glossary term that can appear inline in instructions */
export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
}

/** A single instruction step */
export interface Instruction {
  stepNumber: number;
  title?: string;
  text: string;
  tips?: string[];
  warnings?: StepWarning[];
  timers?: StepTimer[];
  glossaryTerms?: GlossaryTerm[];
}

/** Full recipe data */
export interface Recipe {
  id: string;
  title: string;
  emoji: string;
  cuisines: string[];
  heroImage?: {
    gradient: string;
    emoji: string;
  };
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: number;
  ingredientSections: IngredientSection[];
  instructions: Instruction[];
  bookmarked?: boolean;
  liked?: boolean;
  variations?: RecipeVariation[];
  createdAt?: Date;
  updatedAt?: Date;
}

/** A recipe variation or related recipe */
export interface RecipeVariation {
  title: string;
  subtitle: string;
  emoji: string;
}
