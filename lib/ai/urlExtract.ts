import { getAI, getGenerativeModel, GoogleAIBackend } from "@firebase/ai";
import type { GenerativeModel } from "@firebase/ai";
import { getApps } from "firebase/app";
import type { FullRecipeBlock } from "@/types/chat";

export type UrlExtractionResult =
  | { status: "success"; data: FullRecipeBlock["data"] }
  | { status: "not_recipe"; message: string }
  | { status: "error"; message: string };

let _urlModel: GenerativeModel | null = null;

/** Initialize (or return cached) Gemini model with urlContext tool */
function initUrlModel(): GenerativeModel | null {
  if (_urlModel) return _urlModel;

  const apps = getApps();
  if (apps.length === 0) {
    console.warn(
      "[mise] No Firebase app initialized — cannot create URL model",
    );
    return null;
  }

  const app = apps[0];
  if (!app) {
    console.warn("[mise] Firebase app is undefined");
    return null;
  }

  try {
    const ai = getAI(app, { backend: new GoogleAIBackend() });
    _urlModel = getGenerativeModel(ai, {
      model: "gemini-2.5-flash",
      tools: [{ urlContext: {} }],
    });
    return _urlModel;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[mise] Failed to initialize URL model:", message);
    return null;
  }
}

const EXTRACTION_PROMPT = `Visit the URL below and extract the recipe data as JSON.

Return ONLY a JSON object in one of these two formats:

If the page contains a recipe:
{
  "status": "success",
  "data": {
    "id": "<slug from url>",
    "title": "<recipe title>",
    "emoji": "<single emoji for the dish>",
    "time": "<total time as string, e.g. '45 min'>",
    "servings": <number>,
    "cuisine": "<cuisine type>",
    "description": "<1-2 sentence description>",
    "ingredients": {
      "sections": [{"name": "Main"}],
      "items": [{"amount": "<qty>", "unit": "<unit>", "name": "<ingredient>", "notes": "<optional>"}]
    },
    "steps": [{"stepNumber": 1, "title": "<short title>", "text": "<instruction text>", "timerPill": "<optional time>", "tips": "<optional tip>"}]
  }
}

If the page is NOT a recipe:
{"status": "not_recipe", "message": "<brief explanation>"}

URL: `;

const MOCK_RESULT: UrlExtractionResult = {
  status: "success",
  data: {
    id: "mock-extracted-recipe",
    title: "Classic Chicken Tikka Masala",
    emoji: "\uD83C\uDF5B",
    time: "45 min",
    servings: 4,
    cuisine: "Indian",
    description:
      "Tender chicken pieces in a rich, creamy tomato-spiced sauce — a beloved classic.",
    image: {
      gradient:
        "linear-gradient(160deg, #FF6B35 0%, #D63031 40%, #C0392B 100%)",
      emoji: "\uD83C\uDF5B",
    },
    ingredients: {
      sections: [{ name: "Main" }],
      items: [
        { amount: "500", unit: "g", name: "Chicken breast", notes: "cubed" },
        { amount: "1", unit: "cup", name: "Yogurt" },
        { amount: "2", unit: "tbsp", name: "Garam masala" },
        { amount: "400", unit: "ml", name: "Tomato sauce" },
        { amount: "200", unit: "ml", name: "Heavy cream" },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: "Marinate chicken",
        text: "Mix <ingr>chicken</ingr> with <ingr>yogurt</ingr> and <ingr>garam masala</ingr>. Refrigerate for at least 30 minutes.",
        timerPill: "30 min",
      },
      {
        stepNumber: 2,
        title: "Cook chicken",
        text: "Grill or pan-fry the marinated chicken until charred and cooked through.",
        timerPill: "8 min",
      },
      {
        stepNumber: 3,
        title: "Make sauce",
        text: "Simmer <ingr>tomato sauce</ingr> with spices, then stir in <ingr>heavy cream</ingr>. Add chicken and cook until sauce thickens.",
        timerPill: "15 min",
      },
    ],
  },
};

const MOCK_MASSAMAN: UrlExtractionResult = {
  status: "success",
  data: {
    id: "massaman-curry",
    title: "Massaman Curry",
    emoji: "🍛",
    time: "1 hr 30 min",
    servings: 4,
    cuisine: "Thai",
    description:
      "A rich, mildly spiced Thai curry with tender beef, potatoes, and roasted peanuts in coconut milk.",
    ingredients: {
      sections: [{ name: "Main" }],
      items: [
        { amount: "400", unit: "ml", name: "Coconut milk" },
        { amount: "500", unit: "g", name: "Beef chuck", notes: "cubed" },
        { amount: "3", unit: "tbsp", name: "Massaman curry paste" },
        { amount: "2", unit: "", name: "Potatoes", notes: "quartered" },
        { amount: "1/4", unit: "cup", name: "Roasted peanuts" },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: "Bloom curry paste",
        text: "Heat coconut cream in a pot, add <ingr>massaman curry paste</ingr> and fry until fragrant.",
        timerPill: "3 min",
      },
      {
        stepNumber: 2,
        title: "Braise beef",
        text: "Add <ingr>beef chuck</ingr> and <ingr>coconut milk</ingr>. Simmer until tender, then add <ingr>potatoes</ingr> and cook through.",
        timerPill: "1 hr",
      },
    ],
  },
};

const MOCK_NOT_RECIPE: UrlExtractionResult = {
  status: "not_recipe",
  message: "This page does not contain a recipe.",
};

function getMockResult(url: string): UrlExtractionResult {
  if (/hot-thai-kitchen|massaman/i.test(url)) return MOCK_MASSAMAN;
  if (/example\.com|google\.com/i.test(url)) return MOCK_NOT_RECIPE;
  return MOCK_RESULT;
}

/** Extract recipe data from a URL using Gemini's urlContext tool */
export async function extractRecipeFromUrl(
  url: string,
  signal?: AbortSignal,
): Promise<UrlExtractionResult> {
  // Mock mode for E2E testing
  if (process.env.EXPO_PUBLIC_MOCK_AI === "true") {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (signal?.aborted) {
      return { status: "error", message: "Request was cancelled" };
    }
    return getMockResult(url);
  }

  const model = initUrlModel();
  if (!model) {
    return {
      status: "error",
      message: "Gemini model not initialized. Check Firebase configuration.",
    };
  }

  try {
    const result = await model.generateContent(
      {
        contents: [
          { role: "user", parts: [{ text: EXTRACTION_PROMPT + url }] },
        ],
      },
      { signal },
    );

    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { status: "error", message: "Could not parse extraction result" };
    }

    const parsed: unknown = JSON.parse(jsonMatch[0]);
    if (parsed === null || typeof parsed !== "object") {
      return { status: "error", message: "Invalid extraction result" };
    }

    if ("status" in parsed) {
      const p = parsed as Record<string, unknown>;
      if (p.status === "success" && "data" in p) {
        return { status: "success", data: p.data as FullRecipeBlock["data"] };
      }
      if (p.status === "not_recipe" && typeof p.message === "string") {
        return { status: "not_recipe", message: p.message };
      }
    }

    return { status: "error", message: "Unexpected response format" };
  } catch (err: unknown) {
    if (signal?.aborted) {
      return { status: "error", message: "Request was cancelled" };
    }
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", message };
  }
}
