import type { Ingredient } from "./recipe";

/** Action button in widgets */
export interface WidgetAction {
  label: string;
  type: "primary" | "outline" | "ghost";
  disabled?: boolean;
  /** Whether tapping triggers a chat message or a direct store mutation */
  actionType?: "chat" | "direct";
  /** Message to inject into chat (used when actionType is 'chat') */
  chatMessage?: string;
  /** Action identifier for direct mutations (e.g. 'add-to-shopping') */
  directAction?: string;
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
    cards: {
      id: string;
      title: string;
      emoji: string;
      time: string;
      tag: string;
      image?: { gradient: string; emoji: string };
    }[];
  };
}

/** Block 3: Ingredients list for a recipe */
export interface IngredientsBlock {
  type: "ingredients";
  data: {
    recipeTitle: string;
    servings: number;
    totalItems: number;
    sections?: { name: string }[];
    items: (Ingredient & { checked?: boolean })[];
    actions?: WidgetAction[];
  };
}

/** Block 4: All cook steps stacked */
export interface CookModeBlock {
  type: "cook-mode";
  data: {
    totalSteps: number;
    steps: {
      stepNumber: number;
      title: string;
      text: string;
      timerPill?: string;
      tips?: string;
      warnings?: { icon: string; text: string }[];
    }[];
  };
}

/** Block 5: Full recipe with header, ingredients, steps, and save button */
export interface FullRecipeBlock {
  type: "full-recipe";
  data: {
    id: string;
    title: string;
    emoji: string;
    time: string;
    servings: number;
    cuisine: string;
    description: string;
    image?: { gradient: string; emoji: string };
    ingredients: {
      sections?: { name: string }[];
      items: Ingredient[];
    };
    steps: {
      stepNumber: number;
      title: string;
      text: string;
      timerPill?: string;
      tips?: string;
      warnings?: { icon: string; text: string }[];
    }[];
  };
}

/** Block 6: Quick action bubble for conversational suggestions */
export interface QuickActionBlock {
  type: "quick-action";
  data: {
    label: string;
    icon?: string;
    actionType: "chat" | "direct";
    chatMessage?: string;
    directAction?: string;
  };
}

/** Block 7: Tips / suggestions */
export interface TipsBlock {
  type: "tips";
  data: {
    tips: {
      icon: string;
      label: string;
      text: string;
    }[];
  };
}

/** Block 7: Rescue / error recovery */
export interface RescueBlock {
  type: "rescue";
  data: {
    icon: string;
    title: string;
    steps: {
      number: number;
      text: string;
    }[];
  };
}

/** Discriminated union of all widget blocks */
export type Block =
  | RecipeCardBlock
  | RecipeCarouselBlock
  | IngredientsBlock
  | CookModeBlock
  | FullRecipeBlock
  | QuickActionBlock
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
