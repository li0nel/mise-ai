import type { ChatMessage } from "../types";

const BASE_TIMESTAMP = 1709924400000; // 2024-03-08 19:00:00 UTC

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  // ── 1. User opener ────────────────────────────────────────
  {
    id: "msg-001",
    role: "user",
    content:
      "Good evening mise. I've been meaning to learn Beef Bourguignon — the proper Julia Child way. I want the full experience, not shortcuts.",
    timestamp: BASE_TIMESTAMP,
  },

  // ── 2. AI welcome text ────────────────────────────────────
  {
    id: "msg-002",
    role: "assistant",
    content:
      "What a wonderful choice for an evening project. Boeuf Bourguignon is one of those dishes that elevated home cooking into something approaching art — Julia Child called it \"one of the most savoury French dishes concocted by man,\" and I'd argue she was right.\n\nThe original Julia Child version from Mastering the Art of French Cooking (1961) has a few hallmarks that separate it from shortcuts: the lardons are blanched then rendered, the beef is dried and browned in small batches (this matters enormously), and the whole thing braises low and slow for at least 3 hours. No rushing. The payoff is a depth of flavour you genuinely can't fake.",
    timestamp: BASE_TIMESTAMP + 5_000,
  },

  // ── 3. AI — Recipe Card widget ────────────────────────────
  {
    id: "msg-003",
    role: "assistant",
    content: "Here's the full recipe:",
    timestamp: BASE_TIMESTAMP + 8_000,
    blocks: [
      {
        type: "recipe-card",
        data: {
          id: "boeuf-bourguignon",
          title: "Boeuf Bourguignon",
          emoji: "🥩",
          rating: 3,
          subtitle: "Julia Child's Classic",
          time: "3h 30 min",
          servings: 6,
          cuisine: "French",
          description:
            "Beef braised in Burgundy wine with lardons, pearl onions and mushrooms. Julia Child's defining recipe from Mastering the Art of French Cooking.",
          image: {
            gradient:
              "linear-gradient(160deg, #D4B0A8 0%, #8B4838 40%, #4A1818 100%)",
            emoji: "🥩",
          },
          actions: [
            { label: "Cook Now 👨‍🍳", type: "primary", actionType: "chat", chatMessage: "Cook Boeuf Bourguignon now" },
            { label: "View Full Recipe", type: "outline" },
          ],
        },
      },
    ],
  },

  // ── 4. User asks for ingredients ──────────────────────────
  {
    id: "msg-004",
    role: "user",
    content: "Perfect! What do I need?",
    timestamp: BASE_TIMESTAMP + 30_000,
  },

  // ── 5. AI — Ingredients widget ────────────────────────────
  {
    id: "msg-005",
    role: "assistant",
    content:
      "Here's the full shopping list for Julia's version. This serves 6 generously — it's actually better the next day, so don't worry about making too much.",
    timestamp: BASE_TIMESTAMP + 33_000,
    blocks: [
      {
        type: "ingredients",
        data: {
          recipeTitle: "Boeuf Bourguignon",
          servings: 6,
          totalItems: 13,
          sections: [{ name: "Main" }, { name: "Garnish" }],
          items: [
            { amount: "170", unit: "g", name: "Lardons (thick-cut pancetta or bacon)" },
            {
              amount: "1.3",
              unit: "kg",
              name: "Stewing beef",
              notes: "Chuck, brisket or beef cheek — never lean cuts",
            },
            {
              amount: "1",
              unit: "bottle",
              name: "Full-bodied red wine",
              notes: "Burgundy, Cotes du Rhone or Chianti — drinkable quality",
            },
            { amount: "500", unit: "ml", name: "Beef stock, homemade or good quality" },
            { amount: "2", unit: "tbsp", name: "Tomato paste" },
            { amount: "4", unit: "cloves", name: "Garlic, smashed" },
            { amount: "1", name: "Bouquet garni (thyme, bay leaf, parsley)" },
            { amount: "18-24", name: "Pearl onions, blanched and peeled" },
            { amount: "450", unit: "g", name: "Button mushrooms, quartered" },
            { amount: "3", unit: "tbsp", name: "Unsalted butter, divided" },
            { amount: "2", unit: "tbsp", name: "Neutral oil (vegetable or grapeseed)" },
            { amount: "3", unit: "tbsp", name: "Plain flour (for dredging)" },
            { amount: "To taste", name: "Salt and freshly ground black pepper" },
          ],
          actions: [
            { label: "Add All to Shopping List", type: "primary", actionType: "direct", directAction: "add-to-shopping" },
          ],
        },
      },
    ],
  },

  // ── 6. AI — Tips widget ───────────────────────────────────
  {
    id: "msg-006",
    role: "assistant",
    content: "Before we start, three things Julia was emphatic about:",
    timestamp: BASE_TIMESTAMP + 40_000,
    blocks: [
      {
        type: "tips",
        data: {
          tips: [
            {
              icon: "🥩",
              label: "Dry the beef",
              text: "Pat every piece of beef completely dry with kitchen paper before browning. Wet beef steams instead of browning — and browning is where 40% of the flavour lives.",
            },
            {
              icon: "🍷",
              label: "Use good wine",
              text: "Julia's rule: if you wouldn't drink it, don't cook with it. The wine reduces and concentrates — a bad wine becomes a very bad sauce.",
            },
            {
              icon: "🔥",
              label: "Brown in small batches",
              text: "Never crowd the pan. The beef must sear, not steam. Work in batches of 4-5 pieces maximum, with hot fat and space between them.",
            },
          ],
        },
      },
    ],
  },

  // ── 7. User ready to cook ─────────────────────────────────
  {
    id: "msg-007",
    role: "user",
    content: "Let's cook! I'll go step by step.",
    timestamp: BASE_TIMESTAMP + 120_000,
  },

  // ── 8. AI — Cook Step widget (step 1 only) ────────────────
  {
    id: "msg-008",
    role: "assistant",
    content: "Let's start with step 1:",
    timestamp: BASE_TIMESTAMP + 125_000,
    blocks: [
      {
        type: "cook-step",
        data: {
          stepNumber: 1,
          totalSteps: 5,
          text: "Bring a medium pot of water to a boil. Add 170g lardons and blanch for 8 minutes. This removes excess salt and the smoky flavour so it doesn't overwhelm the finished dish. Drain and pat dry with kitchen paper.",
          timerPill: "8 min blanch",
          progressPercent: 20,
          actions: [
            { label: "Next Step", type: "primary", actionType: "chat", chatMessage: "Show me the next step" },
            { label: "Show All Steps", type: "outline", actionType: "chat", chatMessage: "Show me all the steps" },
          ],
        },
      },
    ],
  },

  // ── 9. User asks for all steps ────────────────────────────
  {
    id: "msg-009",
    role: "user",
    content: "Show me all the steps at once please.",
    timestamp: BASE_TIMESTAMP + 180_000,
  },

  // ── 10. AI — Cook Mode widget (all steps) ─────────────────
  {
    id: "msg-010",
    role: "assistant",
    content: "Here is the full cook mode view:",
    timestamp: BASE_TIMESTAMP + 185_000,
    blocks: [
      {
        type: "cook-mode",
        data: {
          totalSteps: 5,
          steps: [
            {
              stepNumber: 1,
              title: "Blanch the lardons",
              text: "Bring a medium pot of water to a boil. Add 170g lardons and blanch for 8 minutes. Drain and pat dry with kitchen paper.",
              timerPill: "8 min blanch",
            },
            {
              stepNumber: 2,
              title: "Render the lardons",
              text: "In a large casserole, heat 1 tbsp butter and 1 tbsp oil over medium heat. Add lardons and render until golden and lightly crisp, about 3-4 minutes. Remove with a slotted spoon.",
              timerPill: "3-4 min render",
            },
            {
              stepNumber: 3,
              title: "Brown the beef in batches",
              text: "Pat every piece of 1.3kg beef completely dry. Season generously with salt and pepper. Sear in batches of 4-5 pieces on all sides until deeply browned — about 3 min per batch.",
              warnings: [
                {
                  icon: "⚠️",
                  text: "Crowded pan = steamed beef = grey, sad, flavourless. Space between pieces is mandatory.",
                },
              ],
            },
            {
              stepNumber: 4,
              title: "Deglaze the pot",
              text: "Add sliced carrots and onion, cook 5 minutes. Add 4 cloves garlic and cook 1 minute. Sprinkle 3 tbsp flour over everything and stir. Pour in half the bottle of wine and scrape vigorously, releasing every bit of fond.",
            },
            {
              stepNumber: 5,
              title: "Braise in the oven",
              text: "Return beef and lardons. Add remaining wine, 500ml beef stock, 2 tbsp tomato paste, and bouquet garni. Bring to a bare simmer, then cover and braise at 160C / 325F.",
              timerPill: "2.5-3 hours in oven",
              tips: "Julia's test: the beef should be easily pierced with a fork with no resistance. Not falling apart — that's overcooked.",
            },
          ],
        },
      },
    ],
  },

  // ── 11. User — 2 hours later ──────────────────────────────
  {
    id: "msg-011",
    role: "user",
    content:
      "It's been 2 hours. Smells incredible. Beef is very tender but the sauce seems thin — almost watery. Is that normal?",
    timestamp: BASE_TIMESTAMP + 7_500_000, // ~2 hours later
  },

  // ── 12. AI — Rescue widget ────────────────────────────────
  {
    id: "msg-012",
    role: "assistant",
    content:
      "Completely normal at this stage! The sauce will thin as it cooks because the beef releases moisture. You reduce it at the end — this is actually exactly how Julia intended it. Here's the finish:",
    timestamp: BASE_TIMESTAMP + 7_505_000,
    blocks: [
      {
        type: "rescue",
        data: {
          icon: "🍷",
          title: "Sauce Recovery — Reduction Finish",
          steps: [
            {
              number: 1,
              text: "Remove beef with a slotted spoon and keep warm in a covered bowl. Leave sauce in the pot over the stove.",
            },
            {
              number: 2,
              text: "Rapid boil the sauce uncovered for 12-15 minutes until reduced by about one-third and it coats the back of a spoon. Skim off any fat that rises.",
            },
            {
              number: 3,
              text: "Taste and adjust with salt, a few grinds of pepper, and if you like, a small splash of the remaining wine for brightness.",
            },
            {
              number: 4,
              text: "Finish with cold butter (montee au beurre): cut 2 tbsp cold butter into cubes, take the pan off heat, and whisk them in one at a time until glossy and thickened. Return beef to sauce.",
            },
          ],
        },
      },
    ],
  },

  // ── 13. User — sauce is great ─────────────────────────────
  {
    id: "msg-013",
    role: "user",
    content:
      "The sauce is absolutely gorgeous now. Rich, glossy, incredible. How do I serve?",
    timestamp: BASE_TIMESTAMP + 8_400_000,
  },

  // ── 14. AI — Recipe Carousel (related recipes / serving) ──
  {
    id: "msg-014",
    role: "assistant",
    content:
      "You've made something exceptional. Here are some classic French dishes that pair beautifully for a full menu:",
    timestamp: BASE_TIMESTAMP + 8_405_000,
    blocks: [
      {
        type: "recipe-carousel",
        data: {
          cards: [
            {
              id: "pommes-puree",
              title: "Pommes Puree",
              emoji: "🥔",
              time: "30 min",
              tag: "Julia's Choice",
              image: {
                gradient:
                  "linear-gradient(160deg, #F5F0D0 0%, #D4C870 40%, #8B8530 100%)",
                emoji: "🥔",
              },
            },
            {
              id: "french-onion-soup",
              title: "French Onion Soup",
              emoji: "🧅",
              time: "1h 15 min",
              tag: "Classic Starter",
              image: {
                gradient:
                  "linear-gradient(160deg, #E8D0A0 0%, #A07030 40%, #5A3010 100%)",
                emoji: "🧅",
              },
            },
            {
              id: "tarte-tatin",
              title: "Tarte Tatin",
              emoji: "🍎",
              time: "1h",
              tag: "French Dessert",
              image: {
                gradient:
                  "linear-gradient(160deg, #F5D0C0 0%, #D45040 40%, #8B1818 100%)",
                emoji: "🍎",
              },
            },
            {
              id: "salade-lyonnaise",
              title: "Salade Lyonnaise",
              emoji: "🥗",
              time: "20 min",
              tag: "Light Side",
              image: {
                gradient:
                  "linear-gradient(160deg, #E8F0D0 0%, #7AA840 40%, #3A5018 100%)",
                emoji: "🥗",
              },
            },
          ],
        },
      },
    ],
  },
];
