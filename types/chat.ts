import type { Ingredient } from "./recipe";

/** Action button in widgets */
export interface WidgetAction {
  label: string;
  type: "primary" | "outline" | "ghost";
  disabled?: boolean;
}

/** Block 1: Single recipe card */
export interface RecipeCardBlock {
  type: "recipe-card";
  data: {
    id: string;
    title: string;
    emoji: string;
    rating: number;
    subtitle?: string;
    time: string;
    servings: number;
    cuisine: string;
    description: string;
    image?: { gradient: string; emoji: string };
    actions: WidgetAction[];
  };
}

/** Block 2: Horizontal carousel of recipe cards */
export interface RecipeCarouselBlock {
  type: "recipe-carousel";
  data: {
    cards: Array<{
      id: string;
      title: string;
      emoji: string;
      time: string;
      tag: string;
      image?: { gradient: string; emoji: string };
    }>;
  };
}

/** Block 3: Ingredients list for a recipe */
export interface IngredientsBlock {
  type: "ingredients";
  data: {
    recipeTitle: string;
    servings: number;
    totalItems: number;
    sections?: Array<{ name: string }>;
    items: Array<Ingredient & { checked?: boolean }>;
    actions?: WidgetAction[];
  };
}

/** Block 4: Single cook step */
export interface CookStepBlock {
  type: "cook-step";
  data: {
    stepNumber: number;
    totalSteps: number;
    text: string;
    timerPill?: string;
    progressPercent: number;
    actions?: WidgetAction[];
  };
}

/** Block 5: All cook steps stacked */
export interface CookModeBlock {
  type: "cook-mode";
  data: {
    totalSteps: number;
    steps: Array<{
      stepNumber: number;
      title: string;
      text: string;
      timerPill?: string;
      tips?: string;
      warnings?: Array<{ icon: string; text: string }>;
    }>;
  };
}

/** Block 6: Tips / suggestions */
export interface TipsBlock {
  type: "tips";
  data: {
    tips: Array<{
      icon: string;
      label: string;
      text: string;
    }>;
  };
}

/** Block 7: Rescue / error recovery */
export interface RescueBlock {
  type: "rescue";
  data: {
    icon: string;
    title: string;
    steps: Array<{
      number: number;
      text: string;
    }>;
  };
}

/** Discriminated union of all widget blocks */
export type Block =
  | RecipeCardBlock
  | RecipeCarouselBlock
  | IngredientsBlock
  | CookStepBlock
  | CookModeBlock
  | TipsBlock
  | RescueBlock;

/** All valid block type strings */
export type BlockType = Block["type"];

/** Chat message from user or AI */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  blocks?: Block[];
}
