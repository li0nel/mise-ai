import type { Recipe } from "../../types";
import { SEED_RECIPE } from "../../data/seedRecipe";

/** AI verdict text from conversational flow mock */
export const MOCK_VERDICT =
  "I\u2019ve gone through 47 recipes for Massaman Curry and found some really interesting patterns.\n\n" +
  "**Pailin Chongchitnant** from Hot Thai Kitchen makes what most people consider the definitive version \u2014 she dry-roasts whole spices (cardamom, cinnamon, cloves, cumin) before grinding them into the paste. It takes about 1.5 hours but the depth of flavour is incredible.\n\n" +
  "**J. Kenji L\u00F3pez-Alt** on Serious Eats takes a more scientific approach \u2014 he blooms the curry paste in coconut cream (not milk) first, which releases the fat-soluble compounds and gives a much richer base.\n\n" +
  "**Joshua Weissman** goes all-out with a from-scratch paste but uses a shortcut of store-bought tamarind concentrate.\n\n" +
  "Traditionally in southern Thailand, Massaman uses beef shank braised for hours with potatoes and peanuts. The paste includes dried chillies, lemongrass, galangal, and roasted shrimp paste \u2014 some of these are hard to find outside Asia.\n\n" +
  "Let me tailor this to your preferences.";

/** Questions for the conversational wizard */
export const MOCK_QUESTIONS: {
  aiText: string;
  options: { label: string }[];
}[] = [
  {
    aiText:
      "Based on your profile, I\u2019ll make this **gluten-free** (using tamari instead of soy sauce) and **dairy-free** (full coconut milk).\n\nWhich protein would you like?",
    options: [
      { label: "\uD83D\uDC04 Beef (traditional)" },
      { label: "\uD83C\uDF57 Chicken" },
      { label: "\uD83E\uDED8 Tofu" },
      { label: "\uD83E\uDD90 Shrimp" },
    ],
  },
  {
    aiText:
      "Good choice \u2014 chicken thighs work beautifully here and cook in about 25 minutes vs 2 hours for beef.\n\nDo you want the proper slow-cook version or something quicker for a weeknight?",
    options: [
      { label: "\uD83D\uDD50 Authentic slow-cook (1.5 hrs)" },
      { label: "\u26A1 Weeknight express (45 min)" },
    ],
  },
  {
    aiText:
      "The paste really makes or breaks a Massaman. Pailin\u2019s homemade paste is worth the effort \u2014 about 15 minutes of extra prep but the flavour difference is night and day versus store-bought.\n\nHomemade or store-bought?",
    options: [
      { label: "\uD83D\uDC68\u200D\uD83C\uDF73 Homemade from scratch" },
      { label: "\uD83C\uDFEA Store-bought (totally fine)" },
    ],
  },
  {
    aiText:
      "Great call. Traditional Massaman is actually one of the milder Thai curries \u2014 the spice comes from white pepper and nutmeg more than chillies.\n\nHow spicy do you want it?",
    options: [
      { label: "\uD83C\uDF36\uFE0F Mild" },
      { label: "\uD83C\uDF36\uFE0F\uD83C\uDF36\uFE0F Medium" },
      { label: "\uD83D\uDD25 Hot (not traditional but delicious)" },
    ],
  },
];

/** Wrap-up text after all questions answered */
export const MOCK_WRAPUP =
  "All done \u2014 your recipe is coming right up. I\u2019ve pulled the best ideas from Pailin, Kenji, and Joshua\u2019s approaches. You can always refine it later from your saved recipe.";

/** Create a mock recipe adapted for chicken/weeknight version */
export function createMockRecipe(id: string): Recipe {
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
      { label: "Chicken thighs", detail: "Over beef or tofu", tier: "recipe" },
      { label: "Weeknight express", detail: "45 min total", tier: "recipe" },
      { label: "Homemade paste", detail: "15 min extra prep", tier: "recipe" },
      { label: "Medium spice", tier: "recipe" },
    ],
    aiBlurb:
      "A weeknight-friendly take on the classic Thai curry, blending Pailin\u2019s dry-roasted spice approach with Kenji\u2019s coconut cream blooming technique. Chicken thighs keep it quick without sacrificing depth.",
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
      sourceCount: 47,
      recipeCount: 12,
      tokenCount: 85000,
      durationMs: 4200,
    },
    ingredientSections: [
      {
        name: "Curry Paste (Quick Version)",
        ingredients: [
          { amount: "3", name: "Dried chillies", notes: "Soaked 10 min" },
          { amount: "1", unit: "tbsp", name: "Coriander seeds" },
          { amount: "1", unit: "tsp", name: "Cumin seeds" },
          { amount: "3", unit: "cloves", name: "Garlic" },
          {
            amount: "1",
            unit: "stalk",
            name: "Lemongrass",
            notes: "Tender part, sliced",
          },
          { amount: "2", name: "Shallots", notes: "Roughly chopped" },
          { amount: "1", unit: "cm", name: "Galangal", notes: "Sliced" },
          { amount: "1", unit: "tsp", name: "Shrimp paste" },
        ],
      },
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
            amount: "200",
            unit: "ml",
            name: "Coconut cream",
            notes: "For blooming paste",
          },
          {
            amount: "600",
            unit: "g",
            name: "Chicken thighs",
            notes: "Boneless, cut into chunks",
          },
          { amount: "200", unit: "g", name: "Baby potatoes", notes: "Halved" },
          { amount: "1", name: "Brown onion", notes: "Quartered" },
          { amount: "50", unit: "g", name: "Roasted peanuts" },
          { amount: "2", unit: "tbsp", name: "Fish sauce" },
          { amount: "1", unit: "tbsp", name: "Palm sugar" },
          { amount: "1", unit: "tbsp", name: "Tamarind paste" },
          { amount: "1", name: "Cinnamon stick" },
          { amount: "2", name: "Cardamom pods" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Bloom the paste",
        text: '<b>Bloom the paste:</b> Heat <ingr>coconut cream</ingr> in a heavy-bottomed pot over medium-high heat. Add the <ingr>curry paste</ingr> and fry, stirring constantly, for <timer duration="3 min">3\u20134 min</timer> until fragrant and oil separates.',
      },
      {
        stepNumber: 2,
        title: "Sear the chicken",
        text: 'Add <ingr>chicken thighs</ingr> to the pot. Stir to coat in paste. Cook for <timer duration="3 min">3 min</timer> until sealed on all sides.',
      },
      {
        stepNumber: 3,
        title: "Simmer",
        text: 'Pour in <ingr>coconut milk</ingr>. Add <ingr>cinnamon stick</ingr>, <ingr>cardamom pods</ingr>, <ingr>potatoes</ingr>, and <ingr>onion</ingr>. Bring to a gentle simmer, reduce heat to low, cover and cook for <timer duration="20 min">20 min</timer>.',
      },
      {
        stepNumber: 4,
        title: "Season and finish",
        text: "Stir in <ingr>peanuts</ingr>, <ingr>fish sauce</ingr>, <ingr>palm sugar</ingr>, and <ingr>tamarind paste</ingr>. Simmer uncovered for 5 more minutes. Taste and adjust the balance.",
      },
      {
        stepNumber: 5,
        title: "Serve",
        text: "Remove <ingr>cinnamon stick</ingr> and <ingr>cardamom pods</ingr>. Serve over jasmine rice with extra peanuts and fresh coriander.",
        tips: [
          "This curry tastes even better the next day \u2014 make extra for leftovers.",
        ],
      },
    ],
  };
}
