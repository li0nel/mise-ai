import type { StreamChunk } from "./chat";

const RECIPE_RESPONSE = JSON.stringify({
  content:
    "Here's a delicious potato puree recipe for you! This classic French side dish is all about simplicity and technique.",
  blocks: [
    {
      type: "full-recipe",
      data: {
        id: "classic-potato-puree",
        title: "Classic Potato Puree",
        emoji: "🥔",
        time: "30 min",
        servings: 4,
        cuisine: "French",
        description:
          "Silky smooth mashed potatoes enriched with butter and cream — the ultimate comfort side dish.",
        image: {
          gradient:
            "linear-gradient(160deg, #F5F0D0 0%, #D4C870 40%, #8B8530 100%)",
          emoji: "🥔",
        },
        ingredients: {
          sections: [{ name: "Main" }],
          items: [
            { amount: "1", unit: "kg", name: "Yukon Gold potatoes" },
            {
              amount: "100",
              unit: "g",
              name: "Unsalted butter",
              notes: "cold, cubed",
            },
            { amount: "120", unit: "ml", name: "Heavy cream", notes: "warmed" },
            { amount: "To taste", name: "Salt and white pepper" },
          ],
        },
        steps: [
          {
            stepNumber: 1,
            title: "Prep potatoes",
            text: "Peel <ingr>potatoes</ingr> and cut into even 2-inch chunks. Place in a large pot and cover with cold salted water.",
          },
          {
            stepNumber: 2,
            title: "Boil until tender",
            text: "Bring to a boil, then reduce to a gentle simmer. Cook until a knife slides through easily.",
            timerPill: "20 min",
            tips: "Start in cold water so they cook evenly — hot water = mushy outside, raw inside.",
          },
          {
            stepNumber: 3,
            title: "Drain and dry",
            text: "Drain thoroughly and return to the hot pot. Let steam dry for 2 minutes.",
          },
          {
            stepNumber: 4,
            title: "Rice and enrich",
            text: "Pass through a potato ricer back into the pot. Over low heat, fold in <ingr>cold butter</ingr> a few cubes at a time, then stir in <ingr>warm cream</ingr>. Season with salt and white pepper.",
            tips: "A ricer gives the smoothest texture. Never use a food processor — it makes glue.",
          },
        ],
      },
    },
    {
      type: "quick-action",
      data: {
        label: "Show me a variation",
        icon: "🔄",
        actionType: "chat",
        chatMessage: "Show me a different variation of this recipe",
      },
    },
    {
      type: "quick-action",
      data: {
        label: "What to serve with this?",
        icon: "🍽️",
        actionType: "chat",
        chatMessage: "What dishes go well with potato puree?",
      },
    },
  ],
});

const URL_RESPONSE = JSON.stringify({
  content:
    "I can see you've shared a recipe URL! Unfortunately I can't fetch web pages directly, but I might be able to help. If I recognize the recipe, I'll generate it for you — otherwise, just paste the recipe text and I'll format it beautifully.\n\nCould you paste the recipe text, or tell me what dish it is? I'll create a full recipe for you.",
  blocks: [
    {
      type: "quick-action",
      data: {
        label: "It's Chicken Tikka Masala",
        icon: "🍗",
        actionType: "chat",
        chatMessage: "Generate a Chicken Tikka Masala recipe",
      },
    },
  ],
});

const GREETING_RESPONSE = JSON.stringify({
  content:
    "Hello! Welcome to Mise — I'm your AI cooking assistant. I can help you discover recipes, guide you through cooking step by step, and even help troubleshoot when things go sideways in the kitchen.\n\nWhat would you like to cook today?",
  blocks: [],
});

const MY_RECIPES_RESPONSE = JSON.stringify({
  content:
    "Here are your saved recipes! You have a Massaman Curry in your collection.",
  blocks: [],
});

const FALLBACK_RESPONSE = JSON.stringify({
  content:
    "That's a great question! I'm here to help with anything cooking-related — from finding recipes to technique tips. What would you like to explore?",
  blocks: [],
});

function selectResponse(userMessage: string): string | "MY_RECIPES" {
  const lower = userMessage.toLowerCase();

  if (/my recipes|saved|what.*saved|recipes.*saved/i.test(lower)) {
    return "MY_RECIPES";
  }

  if (/https?:\/\//.test(lower)) {
    return URL_RESPONSE;
  }

  if (
    /potato|puree|pasta|recipe|cook|make|bake|prepare|how do i/i.test(lower)
  ) {
    return RECIPE_RESPONSE;
  }

  if (/^(hi|hello|hey|good morning|good evening|howdy)/i.test(lower)) {
    return GREETING_RESPONSE;
  }

  return FALLBACK_RESPONSE;
}

/** Yield a JSON response as streamed text chunks, then parsed blocks */
function* yieldJsonResponse(
  response: string,
): Generator<StreamChunk, void, unknown> {
  const chunkSize = 20;
  for (let i = 0; i < response.length; i += chunkSize) {
    yield { type: "text", content: response.slice(i, i + chunkSize) };
  }

  try {
    const parsed: unknown = JSON.parse(response);
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      "blocks" in parsed &&
      Array.isArray((parsed as { blocks: unknown[] }).blocks) &&
      (parsed as { blocks: unknown[] }).blocks.length > 0
    ) {
      yield {
        type: "blocks",
        blocks: (parsed as { blocks: import("../../types").Block[] }).blocks,
      };
    }
  } catch {
    // No blocks
  }
}

/**
 * Mock AI response generator for deterministic E2E testing.
 * Simulates Gemini streaming by yielding text in chunks, then blocks.
 */
export async function* getMockResponse(
  userMessage: string,
): AsyncGenerator<StreamChunk> {
  const response = selectResponse(userMessage);

  // Special case: simulate tool call flow for "my recipes" queries
  if (response === "MY_RECIPES") {
    yield { type: "toolCall", name: "listMyRecipes", args: {} };
    yield* yieldJsonResponse(MY_RECIPES_RESPONSE);
    yield { type: "done" };
    return;
  }

  yield* yieldJsonResponse(response);
  yield { type: "done" };
}
