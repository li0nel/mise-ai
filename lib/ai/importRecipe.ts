import { getAI, getGenerativeModel, GoogleAIBackend } from "@firebase/ai";
import { getApps } from "firebase/app";
import type { FullRecipeBlock } from "@/types/chat";
import { buildImportSystemPrompt } from "./systemPrompt";
import {
  fetchRecipeUrl,
  searchRecipes,
  buildRecipeContext,
  extractSourceMeta,
} from "../exa/exaService";
import { SEED_RECIPE } from "../../data/seedRecipe";
import type { Recipe } from "../../types";

// ── Types ──

export type ImportStep =
  | "fetching"
  | "searching"
  | "found_similar"
  | "enriching"
  | "complete"
  | "error";

export interface ImportProgress {
  step: ImportStep;
  message: string;
  detail?: string;
  recipeData?: FullRecipeBlock["data"];
  error?: string;
}

// ── Helpers ──

/** Strip site suffixes and common prefixes from a page title to get the dish name */
export function extractDishName(title: string): string {
  return (
    title
      // Remove common suffixes: " | Site", " - Site", " — Site", " – Site"
      .replace(/\s*[|–—-]\s*[^|–—-]+$/g, "")
      // Remove leading "Recipe: " or "How to Make "
      .replace(/^(?:recipe:\s*|how to (?:make|cook)\s+)/i, "")
      // Remove trailing " Recipe" or " recipe"
      .replace(/\s+recipe$/i, "")
      .trim()
  );
}

/** Extract domain from URL for display */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^(www\.|m\.)/, "");
  } catch {
    return url;
  }
}

// ── Mock data ──

function createMockImportRecipe(url: string): Recipe {
  const id = "import-" + Date.now().toString(36);
  return {
    ...SEED_RECIPE,
    id,
    title: "Weeknight Chicken Massaman Curry",
    emoji: "\uD83C\uDF5B",
    cuisines: ["Thai"],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 2,
    bookmarked: false,
    tags: [
      { label: "Gluten-free", tier: "dietary" },
      { label: "Dairy-free", tier: "dietary" },
    ],
    aiBlurb:
      "Imported from " +
      extractDomain(url) +
      " and enriched with tips from 10 similar recipes across the web.",
    sources: [
      {
        domain: "hot-thai-kitchen.com",
        title: "Authentic Massaman Curry Recipe",
        url: "https://hot-thai-kitchen.com/massaman-curry/",
      },
      {
        domain: "seriouseats.com",
        title: "The Best Massaman Curry",
        url: "https://www.seriouseats.com/massaman-curry-recipe",
      },
      {
        domain: "joshuaweissman.com",
        title: "Massaman Curry But Better",
        url: "https://www.joshuaweissman.com/massaman-curry",
      },
    ],
    analysisStats: {
      sourceCount: 10,
      recipeCount: 10,
      tokenCount: 42000,
      durationMs: 3200,
    },
    ingredientSections: [
      {
        name: "Curry",
        ingredients: [
          {
            amount: "400",
            unit: "ml",
            name: "Coconut milk",
            notes: "1 can, full-fat",
          },
          {
            amount: "600",
            unit: "g",
            name: "Chicken thighs",
            notes: "Boneless, cut into chunks",
          },
          {
            amount: "200",
            unit: "g",
            name: "Baby potatoes",
            notes: "Halved",
          },
          { amount: "1", name: "Brown onion", notes: "Quartered" },
          { amount: "50", unit: "g", name: "Roasted peanuts" },
          { amount: "2", unit: "tbsp", name: "Fish sauce" },
          { amount: "1", unit: "tbsp", name: "Palm sugar" },
          { amount: "1", unit: "tbsp", name: "Tamarind paste" },
          {
            amount: "4",
            unit: "tbsp",
            name: "Massaman curry paste",
          },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Bloom the paste",
        text: '<b>Bloom the paste:</b> Heat half the <ingr>coconut milk</ingr> in a heavy-bottomed pot over medium-high heat. Add <ingr>curry paste</ingr> and fry for <timer duration="3 min">3\u20134 min</timer> until fragrant.',
      },
      {
        stepNumber: 2,
        title: "Sear the chicken",
        text: 'Add <ingr>chicken thighs</ingr> to the pot. Stir to coat. Cook for <timer duration="3 min">3 min</timer> until sealed.',
      },
      {
        stepNumber: 3,
        title: "Simmer",
        text: 'Pour in remaining <ingr>coconut milk</ingr>. Add <ingr>potatoes</ingr> and <ingr>onion</ingr>. Simmer for <timer duration="20 min">20 min</timer>.',
      },
      {
        stepNumber: 4,
        title: "Season and serve",
        text: "Stir in <ingr>peanuts</ingr>, <ingr>fish sauce</ingr>, <ingr>palm sugar</ingr>, and <ingr>tamarind paste</ingr>. Serve over jasmine rice.",
        tips: ["This curry tastes even better the next day."],
      },
    ],
  };
}

function mockRecipeToFullBlock(recipe: Recipe): FullRecipeBlock["data"] {
  return {
    id: recipe.id,
    title: recipe.title,
    emoji: recipe.emoji,
    time: `${String(recipe.prepTime + recipe.cookTime)} min`,
    servings: recipe.servings,
    cuisine: recipe.cuisines[0] ?? "International",
    description: recipe.aiBlurb ?? "",
    image: recipe.heroImage,
    ingredients: {
      sections: recipe.ingredientSections.map((s) => ({
        name: s.name ?? "Ingredients",
      })),
      items: recipe.ingredientSections.flatMap((s) =>
        s.ingredients.map((ing) => ({
          amount: ing.amount,
          unit: ing.unit,
          name: ing.name,
          notes: ing.notes,
        })),
      ),
    },
    steps: recipe.instructions.map((inst) => ({
      stepNumber: inst.stepNumber,
      title: inst.title ?? `Step ${String(inst.stepNumber)}`,
      text: inst.text,
      timerPill: inst.timers?.[0]?.duration,
      tips: inst.tips?.[0],
      warnings: inst.warnings,
    })),
    tags: recipe.tags,
    aiBlurb: recipe.aiBlurb,
    sources: recipe.sources,
  };
}

// ── Orchestration ──

/**
 * Import a recipe from a URL. Yields progress events as an async generator.
 *
 * Flow: fetch URL → extract dish name → search similar → Gemini enriches → complete
 */
export async function* importRecipeFromUrl(
  url: string,
  signal?: AbortSignal,
): AsyncGenerator<ImportProgress> {
  const domain = extractDomain(url);

  // 1. Fetch the URL
  yield { step: "fetching", message: `Fetching from ${domain}\u2026` };

  if (signal?.aborted) return;

  if (process.env.EXPO_PUBLIC_MOCK_AI === "true") {
    // ── Mock flow ──
    await new Promise((r) => setTimeout(r, 1200));
    if (signal?.aborted) return;

    yield {
      step: "searching",
      message: "Extracting recipe details\u2026",
    };
    await new Promise((r) => setTimeout(r, 800));
    if (signal?.aborted) return;

    yield {
      step: "found_similar",
      message: "Found 10 similar recipes",
      detail: "Comparing techniques and ingredients\u2026",
    };
    await new Promise((r) => setTimeout(r, 1000));
    if (signal?.aborted) return;

    yield {
      step: "enriching",
      message: "Enriching with chef insights\u2026",
    };
    await new Promise((r) => setTimeout(r, 1500));
    if (signal?.aborted) return;

    const recipe = createMockImportRecipe(url);
    const recipeData = mockRecipeToFullBlock(recipe);

    yield {
      step: "complete",
      message: "Recipe imported!",
      recipeData,
    };
    return;
  }

  // ── Live flow ──
  try {
    const contentsResponse = await fetchRecipeUrl(url);
    if (signal?.aborted) return;

    const primaryResult = contentsResponse.results[0];
    if (!primaryResult) {
      yield {
        step: "error",
        message: "Could not fetch recipe from URL",
        error: "No content returned from URL",
      };
      return;
    }

    // 2. Extract dish name
    const dishName = extractDishName(primaryResult.title);

    yield {
      step: "searching",
      message: `Searching for similar ${dishName} recipes\u2026`,
    };

    // 3. Search for similar recipes
    const searchResponse = await searchRecipes(dishName);
    if (signal?.aborted) return;

    const sources = extractSourceMeta(searchResponse);
    yield {
      step: "found_similar",
      message: `Found ${String(sources.length)} similar recipes`,
      detail: "Comparing techniques and ingredients\u2026",
    };

    // 4. Build context and call Gemini
    yield {
      step: "enriching",
      message: "Enriching with chef insights\u2026",
    };

    const primaryContext = buildRecipeContext(contentsResponse);
    const similarContext = buildRecipeContext(searchResponse);
    const sourceList = sources.map((s) => ({
      domain: s.domain,
      title: s.title,
      url: s.url,
    }));

    const systemPrompt = buildImportSystemPrompt(
      url,
      primaryContext,
      similarContext,
      sourceList,
    );

    const apps = getApps();
    const app = apps[0];
    if (!app) {
      yield {
        step: "error",
        message: "Firebase not initialized",
        error: "No Firebase app found",
      };
      return;
    }

    const ai = getAI(app, { backend: new GoogleAIBackend() });
    const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
      contents: [
        {
          role: "user",
          parts: [{ text: `Import and enrich this recipe from ${url}` }],
        },
      ],
    });

    if (signal?.aborted) return;

    const responseText = result.response.text() ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(
        /\{[\s\S]*"blocks"\s*:\s*\[[\s\S]*\]\s*\}/,
      );
      if (jsonMatch?.[0]) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      "blocks" in (parsed as Record<string, unknown>)
    ) {
      const blocks = (parsed as Record<string, unknown>).blocks;
      if (Array.isArray(blocks)) {
        const fullRecipe = blocks.find(
          (b: unknown) =>
            b !== null &&
            typeof b === "object" &&
            (b as Record<string, unknown>).type === "full-recipe",
        );
        if (fullRecipe) {
          yield {
            step: "complete",
            message: "Recipe imported!",
            recipeData: (fullRecipe as FullRecipeBlock).data,
          };
          return;
        }
      }
    }

    yield {
      step: "error",
      message: "Could not parse recipe from AI response",
      error: "No full-recipe block in response",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    yield {
      step: "error",
      message: "Import failed",
      error: message,
    };
  }
}
