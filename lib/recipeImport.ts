import type { Recipe, Ingredient, Instruction } from "../types";
import { useRecipeStore } from "./stores/recipeStore";

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/i;
const URL_REGEX_GLOBAL = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

const UNIT_PATTERN =
  /\b(?:cups?|tbsp|tablespoons?|tsp|teaspoons?|oz|ounces?|lbs?|pounds?|g|grams?|kg|ml|liters?|litres?|quarts?|pints?|gallons?|cloves?|pinch(?:es)?|dash(?:es)?|bunch(?:es)?|cans?|packages?|slices?|pieces?|whole|large|medium|small|stalks?)\b/i;

const INSTRUCTION_PATTERN =
  /\b(?:step|cook|bake|stir|mix|combine|heat|preheat|simmer|boil|fry|saut[eé]|chop|dice|slice|whisk|fold|knead|drain|rinse|season|serve|garnish|let\s+rest|set\s+aside|bring\s+to)\b/i;

/** Check whether a string contains an http/https URL */
export function isRecipeUrl(text: string): boolean {
  return URL_REGEX.test(text);
}

/** Extract all URLs from a text string */
export function extractUrls(text: string): string[] {
  return text.match(URL_REGEX_GLOBAL) ?? [];
}

/**
 * Stub: fetch and parse a recipe from a URL.
 * TODO: Needs a backend proxy to avoid CORS. Returns null for now.
 */
export async function parseRecipeFromUrl(_url: string): Promise<Recipe | null> {
  // TODO: Implement with server-side proxy to fetch and parse recipe pages.
  // Direct browser fetch will fail due to CORS restrictions on most recipe sites.
  return null;
}

/** Heuristic: is this text likely a pasted recipe? */
export function isLikelyRecipeText(text: string): boolean {
  if (text.length < 200) return false;

  const hasIngredients = UNIT_PATTERN.test(text);
  const hasInstructions = INSTRUCTION_PATTERN.test(text);

  return hasIngredients && hasInstructions;
}

/** Generate a simple unique ID */
function generateId(): string {
  return `recipe-${Date.now().toString(36)}`;
}

/**
 * Split text into ingredient and instruction sections by looking for headers.
 * Returns { before, ingredientLines, instructionLines }.
 */
function splitSections(text: string): {
  title: string;
  ingredientLines: string[];
  instructionLines: string[];
} {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);

  let title = "";
  let ingredientStart = -1;
  let instructionStart = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.toLowerCase() ?? "";

    if (/^#{0,3}\s*ingredients?\s*:?$/i.test(line)) {
      ingredientStart = i + 1;
    } else if (
      /^#{0,3}\s*(?:instructions?|directions?|steps?|method|preparation)\s*:?$/i.test(line)
    ) {
      instructionStart = i + 1;
    }
  }

  // Use first non-empty line as title if no clear title
  title = lines[0] ?? "Imported Recipe";

  // If we found both headers, split accordingly
  if (ingredientStart >= 0 && instructionStart >= 0) {
    const ingEnd = Math.min(
      instructionStart - 1,
      ingredientStart > instructionStart ? lines.length : instructionStart - 1,
    );
    const insEnd = ingredientStart > instructionStart ? ingredientStart - 1 : lines.length;

    return {
      title,
      ingredientLines: lines.slice(ingredientStart, ingEnd),
      instructionLines: lines.slice(instructionStart, insEnd),
    };
  }

  // If only ingredients header found
  if (ingredientStart >= 0) {
    return {
      title,
      ingredientLines: lines.slice(ingredientStart),
      instructionLines: [],
    };
  }

  // If only instructions header found
  if (instructionStart >= 0) {
    return {
      title,
      ingredientLines: [],
      instructionLines: lines.slice(instructionStart),
    };
  }

  // No headers found — try to split by heuristic
  const ingredientLines: string[] = [];
  const instructionLines: string[] = [];

  for (const line of lines.slice(1)) {
    if (line && UNIT_PATTERN.test(line)) {
      ingredientLines.push(line);
    } else if (line && INSTRUCTION_PATTERN.test(line)) {
      instructionLines.push(line);
    }
  }

  return { title, ingredientLines, instructionLines };
}

const QUANTITY_REGEX = /^([\d¼½¾⅓⅔⅛⅜⅝⅞/.\s-]+)\s+/;

/** Parse a single ingredient line like "2 cups flour, sifted" */
function parseIngredientLine(line: string): Ingredient | null {
  // Strip leading bullet/dash/number
  const cleaned = line.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, "").trim();
  if (!cleaned) return null;

  const qtyMatch = cleaned.match(QUANTITY_REGEX);
  if (qtyMatch?.[1]) {
    const amount = qtyMatch[1].trim();
    const rest = cleaned.slice(qtyMatch[0].length);

    // Try to extract unit
    const unitMatch = rest.match(UNIT_PATTERN);
    if (unitMatch) {
      const unit = unitMatch[0];
      const afterUnit = rest.slice((unitMatch.index ?? 0) + unit.length).trim();
      // Split name from notes at comma
      const [name, ...noteParts] = afterUnit.split(",");
      return {
        amount,
        unit,
        name: (name ?? "").trim() || rest,
        notes: noteParts.length > 0 ? noteParts.join(",").trim() : undefined,
      };
    }

    // No unit found — treat rest as name
    const [name, ...noteParts] = rest.split(",");
    return {
      amount,
      name: (name ?? "").trim() || rest,
      notes: noteParts.length > 0 ? noteParts.join(",").trim() : undefined,
    };
  }

  // No quantity — just use the whole line as name
  return { amount: "", name: cleaned };
}

/** Parse instruction lines into Instruction objects */
function parseInstructions(lines: string[]): Instruction[] {
  return lines.map((line, i) => {
    // Strip leading number/bullet
    const text = line
      .replace(/^[-*•]\s*/, "")
      .replace(/^\d+[.)]\s*/, "")
      .trim();

    return {
      stepNumber: i + 1,
      text,
    };
  });
}

/** Save a parsed recipe to the recipe store collection */
export function saveRecipeToCollection(recipe: Recipe): void {
  useRecipeStore.getState().addRecipe(recipe);
}

/** Update an existing saved recipe with partial changes */
export function updateSavedRecipe(recipeId: string, updates: Partial<Recipe>): void {
  useRecipeStore.getState().updateRecipe(recipeId, updates);
}

/** Parse text and immediately save to the recipe store. Returns the saved recipe. */
export function importRecipeFromText(text: string): Recipe {
  const recipe = parseRecipeFromText(text);
  saveRecipeToCollection(recipe);
  return recipe;
}

/** Best-effort recipe parser from pasted text */
export function parseRecipeFromText(text: string): Recipe {
  const { title, ingredientLines, instructionLines } = splitSections(text);

  const ingredients: Ingredient[] = ingredientLines
    .map(parseIngredientLine)
    .filter((i): i is Ingredient => i !== null);

  const instructions: Instruction[] = parseInstructions(instructionLines);

  return {
    id: generateId(),
    title,
    emoji: "\uD83C\uDF73",
    cuisines: [],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 2,
    ingredientSections: [{ ingredients }],
    instructions,
  };
}
