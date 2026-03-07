import { isRecipeUrl, extractUrls, isLikelyRecipeText } from "./recipeImport";

interface RecipeDetectionResult {
  type: "url" | "text" | "none";
  urls?: string[];
}

/** Determine if a user message contains recipe URLs or pasted recipe text */
export function detectRecipeContent(text: string): RecipeDetectionResult {
  if (isRecipeUrl(text)) {
    return { type: "url", urls: extractUrls(text) };
  }

  if (isLikelyRecipeText(text)) {
    return { type: "text" };
  }

  return { type: "none" };
}
