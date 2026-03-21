import type {
  ExaSearchResponse,
  ExaContentsResponse,
  ExaSourceMeta,
} from "../../types/exa";
import { MOCK_EXA_SEARCH_RESPONSE } from "./mockSearchResponse";
import { MOCK_EXA_CONTENTS_RESPONSE } from "./mockContentsResponse";

const USE_MOCK = process.env.EXPO_PUBLIC_MOCK_EXA !== "false";

/** Extract domain from a URL (e.g. "https://seriouseats.com/foo" → "seriouseats.com") */
function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^(www\.|m\.)/, "");
  } catch {
    return url;
  }
}

/**
 * Extract source metadata from Exa results for the analysis trace UI.
 * This is pure data mapping — no AI call needed.
 */
export function extractSourceMeta(
  response: ExaSearchResponse | ExaContentsResponse,
): ExaSourceMeta[] {
  return response.results.map((r) => ({
    domain: extractDomain(r.url),
    title: r.title,
    url: r.url,
    author: r.author,
    publishedDate: r.publishedDate,
    favicon: r.favicon,
    image: r.image,
  }));
}

/**
 * Concatenate all recipe texts from Exa results into a single context string
 * for Gemini. Each source is labeled with its domain and title.
 */
export function buildRecipeContext(
  response: ExaSearchResponse | ExaContentsResponse,
): string {
  return response.results
    .map((r, i) => {
      const domain = extractDomain(r.url);
      const parts = [
        `--- Source ${i + 1}: ${r.title} (${domain}) ---`,
        r.summary ? `Summary: ${r.summary}` : null,
        r.text ? `Content:\n${r.text}` : null,
      ].filter(Boolean);
      return parts.join("\n");
    })
    .join("\n\n");
}

/**
 * Search Exa for recipes matching a dish name.
 * In mock mode, returns the pre-captured Massaman Curry response.
 */
export async function searchRecipes(query: string): Promise<ExaSearchResponse> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    return MOCK_EXA_SEARCH_RESPONSE;
  }

  // TODO: Call Exa API via backend proxy
  throw new Error(`Live Exa search not implemented yet. Query: ${query}`);
}

/**
 * Fetch recipe content from a specific URL via Exa.
 * In mock mode, returns the pre-captured Hot Thai Kitchen response.
 */
export async function fetchRecipeUrl(
  url: string,
): Promise<ExaContentsResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_EXA_CONTENTS_RESPONSE;
  }

  // TODO: Call Exa /contents API via backend proxy
  throw new Error(`Live Exa contents not implemented yet. URL: ${url}`);
}
