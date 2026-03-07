import type { ShoppingItem, ShoppingRecipeGroup, ShoppingAisleGroup } from "../types";

// ── Flat item list ──────────────────────────────────────────
// Items from Boeuf Bourguignon and Pad Thai, some checked off.

export const MOCK_SHOPPING_ITEMS: ShoppingItem[] = [
  // ─── Boeuf Bourguignon items ────────────────────────────
  {
    id: "si-bb-01",
    name: "Lardons (thick-cut pancetta)",
    amount: "170",
    unit: "g",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Meat & Seafood",
    checked: true,
  },
  {
    id: "si-bb-02",
    name: "Stewing beef (chuck)",
    amount: "1.3",
    unit: "kg",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Meat & Seafood",
    checked: true,
  },
  {
    id: "si-bb-03",
    name: "Full-bodied red wine",
    amount: "1",
    unit: "bottle",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Alcohol",
    checked: true,
  },
  {
    id: "si-bb-04",
    name: "Beef stock",
    amount: "500",
    unit: "ml",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Pantry",
    checked: false,
  },
  {
    id: "si-bb-05",
    name: "Tomato paste",
    amount: "2",
    unit: "tbsp",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Pantry",
    checked: false,
  },
  {
    id: "si-bb-06",
    name: "Garlic",
    amount: "4",
    unit: "cloves",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Produce",
    checked: true,
  },
  {
    id: "si-bb-07",
    name: "Bouquet garni (thyme, bay leaf, parsley)",
    amount: "1",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Produce",
    checked: false,
  },
  {
    id: "si-bb-08",
    name: "Pearl onions",
    amount: "18-24",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Produce",
    checked: false,
  },
  {
    id: "si-bb-09",
    name: "Button mushrooms",
    amount: "450",
    unit: "g",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Produce",
    checked: true,
  },
  {
    id: "si-bb-10",
    name: "Unsalted butter",
    amount: "3",
    unit: "tbsp",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Dairy",
    checked: false,
  },
  {
    id: "si-bb-11",
    name: "Plain flour",
    amount: "3",
    unit: "tbsp",
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    aisle: "Pantry",
    checked: true,
  },

  // ─── Pad Thai items ─────────────────────────────────────
  {
    id: "si-pt-01",
    name: "Flat rice noodles",
    amount: "200",
    unit: "g",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Pantry",
    checked: true,
  },
  {
    id: "si-pt-02",
    name: "Prawns",
    amount: "200",
    unit: "g",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Meat & Seafood",
    checked: false,
  },
  {
    id: "si-pt-03",
    name: "Eggs",
    amount: "2",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Dairy",
    checked: true,
  },
  {
    id: "si-pt-04",
    name: "Firm tofu",
    amount: "100",
    unit: "g",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Dairy",
    checked: false,
  },
  {
    id: "si-pt-05",
    name: "Tamarind paste",
    amount: "3",
    unit: "tbsp",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Condiments & Sauces",
    checked: false,
  },
  {
    id: "si-pt-06",
    name: "Fish sauce",
    amount: "2",
    unit: "tbsp",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Condiments & Sauces",
    checked: false,
  },
  {
    id: "si-pt-07",
    name: "Palm sugar",
    amount: "2",
    unit: "tbsp",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Pantry",
    checked: false,
  },
  {
    id: "si-pt-08",
    name: "Bean sprouts",
    amount: "50",
    unit: "g",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Produce",
    checked: false,
  },
  {
    id: "si-pt-09",
    name: "Roasted peanuts",
    amount: "3",
    unit: "tbsp",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Pantry",
    checked: true,
  },
  {
    id: "si-pt-10",
    name: "Spring onions",
    amount: "2",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Produce",
    checked: false,
  },
  {
    id: "si-pt-11",
    name: "Lime",
    amount: "1",
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    aisle: "Produce",
    checked: false,
  },
];

// ── Grouped by recipe ───────────────────────────────────────

export const MOCK_SHOPPING_BY_RECIPE: ShoppingRecipeGroup[] = [
  {
    recipeId: "boeuf-bourguignon",
    recipeName: "Boeuf Bourguignon",
    emoji: "🥩",
    items: MOCK_SHOPPING_ITEMS.filter((i) => i.recipeId === "boeuf-bourguignon"),
  },
  {
    recipeId: "pad-thai",
    recipeName: "Pad Thai",
    emoji: "🍜",
    items: MOCK_SHOPPING_ITEMS.filter((i) => i.recipeId === "pad-thai"),
  },
];

// ── Grouped by aisle ────────────────────────────────────────

function groupByAisle(items: ShoppingItem[]): ShoppingAisleGroup[] {
  const aisleMap = new Map<string, { icon: string; items: ShoppingItem[] }>();
  const aisleIcons: Record<string, string> = {
    "Meat & Seafood": "🥩",
    Produce: "🥬",
    Dairy: "🧈",
    Pantry: "🥫",
    "Condiments & Sauces": "🍶",
    Alcohol: "🍷",
  };

  for (const item of items) {
    const aisle = item.aisle ?? "Other";
    const existing = aisleMap.get(aisle);
    if (existing) {
      existing.items.push(item);
    } else {
      aisleMap.set(aisle, {
        icon: aisleIcons[aisle] ?? "📦",
        items: [item],
      });
    }
  }

  return Array.from(aisleMap.entries()).map(([aisle, value]) => ({
    aisle,
    icon: value.icon,
    items: value.items,
  }));
}

export const MOCK_SHOPPING_BY_AISLE: ShoppingAisleGroup[] = groupByAisle(
  MOCK_SHOPPING_ITEMS,
);
