import type { FunctionDeclarationsTool } from "@firebase/ai";
import { useRecipeStore } from "../stores/recipeStore";

/** Tool declarations for Gemini function calling */
export const recipeTools: FunctionDeclarationsTool[] = [
  {
    functionDeclarations: [
      {
        name: "searchMyRecipes",
        description:
          "Search the user's saved recipes by keyword matching title, cuisine, or ingredient names",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "Search keyword to match against recipe titles, cuisines, and ingredients",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "getMyRecipe",
        description: "Get full details of a saved recipe by its ID",
        parameters: {
          type: "object",
          properties: {
            recipeId: {
              type: "string",
              description: "The recipe ID to look up",
            },
          },
          required: ["recipeId"],
        },
      },
      {
        name: "listMyRecipes",
        description:
          "List all of the user's saved recipes with titles and IDs (compact summary)",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    ],
  },
];

/** Handle searchMyRecipes tool call */
export function handleSearchMyRecipes(args: {
  query: string;
}): Record<string, unknown> {
  const { recipes } = useRecipeStore.getState();
  const q = args.query.toLowerCase();

  const matches = recipes.filter((r) => {
    if (r.title.toLowerCase().includes(q)) return true;
    if (r.cuisines.some((c) => c.toLowerCase().includes(q))) return true;
    for (const section of r.ingredientSections) {
      if (section.ingredients.some((i) => i.name.toLowerCase().includes(q))) {
        return true;
      }
    }
    return false;
  });

  return {
    results: matches.map((r) => ({
      id: r.id,
      title: r.title,
      emoji: r.emoji,
      cuisines: r.cuisines,
      servings: r.servings,
    })),
    count: matches.length,
  };
}

/** Handle getMyRecipe tool call */
export function handleGetMyRecipe(args: {
  recipeId: string;
}): Record<string, unknown> {
  const recipe = useRecipeStore.getState().getRecipeById(args.recipeId);
  if (!recipe) {
    return { error: "Recipe not found", recipeId: args.recipeId };
  }
  return { recipe };
}

/** Handle listMyRecipes tool call */
export function handleListMyRecipes(): Record<string, unknown> {
  const { recipes } = useRecipeStore.getState();
  return {
    recipes: recipes.map((r) => ({
      id: r.id,
      title: r.title,
      emoji: r.emoji,
      cuisines: r.cuisines,
    })),
    count: recipes.length,
  };
}

/** Dispatch a function call to the appropriate handler */
export function executeToolCall(
  name: string,
  args: Record<string, unknown>,
): Record<string, unknown> {
  switch (name) {
    case "searchMyRecipes":
      return handleSearchMyRecipes(args as { query: string });
    case "getMyRecipe":
      return handleGetMyRecipe(args as { recipeId: string });
    case "listMyRecipes":
      return handleListMyRecipes();
    default:
      return { error: `Unknown function: ${name}` };
  }
}
