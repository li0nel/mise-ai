import type { Recipe } from "../types";

export const RECIPES: Recipe[] = [
  // ─── French ───────────────────────────────────────────────
  {
    id: "boeuf-bourguignon",
    title: "Boeuf Bourguignon",
    emoji: "🥩",
    cuisines: ["French"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #D4B0A8 0%, #8B4838 40%, #4A1818 100%)",
      emoji: "🥩",
    },
    prepTime: 30,
    cookTime: 180,
    servings: 6,
    difficulty: 4,
    bookmarked: true,
    liked: true,
    ingredientSections: [
      {
        name: "Main",
        ingredients: [
          {
            amount: "1.3",
            unit: "kg",
            name: "Stewing beef",
            notes: "Chuck, brisket or beef cheek — cut into 5cm cubes",
          },
          {
            amount: "170",
            unit: "g",
            name: "Lardons",
            notes: "Thick-cut pancetta or bacon",
          },
          {
            amount: "1",
            unit: "bottle",
            name: "Full-bodied red wine",
            notes: "Burgundy or Cotes du Rhone",
          },
          { amount: "500", unit: "ml", name: "Beef stock" },
          { amount: "2", unit: "tbsp", name: "Tomato paste" },
          { amount: "4", unit: "cloves", name: "Garlic", notes: "Smashed" },
          {
            amount: "1",
            name: "Bouquet garni",
            notes: "Thyme, bay leaf, parsley",
          },
        ],
      },
      {
        name: "Garnish",
        ingredients: [
          {
            amount: "18-24",
            name: "Pearl onions",
            notes: "Blanched and peeled",
          },
          {
            amount: "450",
            unit: "g",
            name: "Button mushrooms",
            notes: "Quartered",
          },
          { amount: "3", unit: "tbsp", name: "Unsalted butter" },
          { amount: "2", unit: "tbsp", name: "Neutral oil" },
          {
            amount: "3",
            unit: "tbsp",
            name: "Plain flour",
            notes: "For dredging",
          },
          { amount: "To taste", name: "Salt and black pepper" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Blanch the lardons",
        text: '<b>Blanch the lardons:</b> Bring a medium pot of water to a boil. Add <ingr>lardons</ingr> and blanch for <timer duration="8 min">8 min</timer>. Drain and pat dry.',
        timers: [{ duration: "8 min", activity: "blanch" }],
      },
      {
        stepNumber: 2,
        title: "Render the lardons",
        text: 'In a large casserole, heat <ingr>butter</ingr> and <ingr>oil</ingr> over medium heat. Add <ingr>lardons</ingr> and render until golden, about <timer duration="3 min">3-4 min</timer>. Remove with a slotted spoon.',
        timers: [{ duration: "3-4 min", activity: "render" }],
      },
      {
        stepNumber: 3,
        title: "Brown the beef in batches",
        text: "Pat every piece of beef dry. Season generously. Sear in batches of 4-5 pieces on all sides until deeply browned.",
        warnings: [
          {
            icon: "⚠️",
            text: "Never crowd the pan — wet or crowded beef steams instead of browning.",
          },
        ],
      },
      {
        stepNumber: 4,
        title: "Deglaze the pot",
        text: "<b>Deglaze:</b> Add sliced <ingr>carrots</ingr> and <ingr>onion</ingr>, cook 5 minutes. Add <ingr>garlic</ingr> and <ingr>flour</ingr>, stir, then pour in half the <ingr>red wine</ingr> and scrape the fond.",
      },
      {
        stepNumber: 5,
        title: "Braise in the oven",
        text: "Return beef and lardons to pot. Add remaining wine, stock, tomato paste, and bouquet garni. Bring to simmer, cover, and braise at 160C for 2.5-3 hours.",
        timers: [{ duration: "2.5-3 hours", activity: "braise" }],
        tips: [
          "The beef should be easily pierced with a fork but not falling apart.",
        ],
      },
    ],
    variations: [
      {
        title: "Pressure Cooker",
        subtitle: "45 minutes instead of 3 hours",
        emoji: "⏱",
      },
      {
        title: "Slow Cooker",
        subtitle: "8 hours on low, hands-off",
        emoji: "🫕",
      },
    ],
  },

  // ─── Thai ─────────────────────────────────────────────────
  {
    id: "pad-thai",
    title: "Pad Thai",
    emoji: "🍜",
    cuisines: ["Thai"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5E0C0 0%, #D4944A 40%, #8B4A18 100%)",
      emoji: "🍜",
    },
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: 2,
    liked: true,
    ingredientSections: [
      {
        name: "Noodles & Protein",
        ingredients: [
          { amount: "200", unit: "g", name: "Flat rice noodles" },
          { amount: "200", unit: "g", name: "Prawns or chicken breast" },
          { amount: "2", name: "Eggs" },
          {
            amount: "100",
            unit: "g",
            name: "Firm tofu",
            notes: "Pressed and cubed",
            optional: true,
          },
        ],
      },
      {
        name: "Sauce",
        ingredients: [
          { amount: "3", unit: "tbsp", name: "Tamarind paste" },
          { amount: "2", unit: "tbsp", name: "Fish sauce" },
          { amount: "2", unit: "tbsp", name: "Palm sugar" },
          { amount: "1", unit: "tbsp", name: "Lime juice" },
        ],
      },
      {
        name: "Garnish",
        ingredients: [
          { amount: "50", unit: "g", name: "Bean sprouts" },
          {
            amount: "3",
            unit: "tbsp",
            name: "Roasted peanuts",
            notes: "Crushed",
          },
          { amount: "2", name: "Spring onions", notes: "Cut into 3cm pieces" },
          { amount: "1", name: "Lime", notes: "Cut into wedges" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Soak noodles",
        text: 'Soak <ingr>rice noodles</ingr> in warm water for <timer duration="20 min">20 min</timer> until pliable but not soft. Drain well.',
        timers: [{ duration: "20 min", activity: "soak" }],
      },
      {
        stepNumber: 2,
        title: "Make the sauce",
        text: "<b>Make the sauce:</b> Mix <ingr>tamarind paste</ingr>, <ingr>fish sauce</ingr>, <ingr>palm sugar</ingr>, and <ingr>lime juice</ingr> in a small bowl until sugar dissolves.",
      },
      {
        stepNumber: 3,
        title: "Stir-fry",
        text: "Heat oil in a wok over high heat. Cook protein until done, push to the side. Scramble eggs. Add noodles, pour sauce over, and toss everything together for 2-3 minutes.",
        timers: [{ duration: "2-3 min", activity: "stir-fry" }],
      },
      {
        stepNumber: 4,
        title: "Serve",
        text: "Top with <ingr>bean sprouts</ingr>, crushed <ingr>peanuts</ingr>, <ingr>spring onions</ingr>, and <ingr>lime</ingr> wedges.",
      },
    ],
  },

  // ─── Italian ──────────────────────────────────────────────
  {
    id: "margherita-pizza",
    title: "Margherita Pizza",
    emoji: "🍕",
    cuisines: ["Italian"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5E8CC 0%, #D4A040 40%, #8B5020 100%)",
      emoji: "🍕",
    },
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    difficulty: 2,
    bookmarked: true,
    ingredientSections: [
      {
        name: "Dough",
        ingredients: [
          { amount: "500", unit: "g", name: "Tipo 00 flour" },
          { amount: "325", unit: "ml", name: "Warm water" },
          { amount: "7", unit: "g", name: "Active dry yeast" },
          { amount: "10", unit: "g", name: "Salt" },
          { amount: "1", unit: "tbsp", name: "Olive oil" },
        ],
      },
      {
        name: "Topping",
        ingredients: [
          {
            amount: "200",
            unit: "g",
            name: "San Marzano tomatoes",
            notes: "Crushed",
          },
          {
            amount: "250",
            unit: "g",
            name: "Fresh mozzarella",
            notes: "Torn into pieces",
          },
          { amount: "8-10", name: "Fresh basil leaves" },
          { amount: "To taste", name: "Sea salt and olive oil" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Make the dough",
        text: "Dissolve yeast in warm water. Mix flour and salt, add yeast water and olive oil. Knead 10 minutes until smooth. Let rise 1 hour.",
        timers: [{ duration: "1 hour", activity: "rise" }],
      },
      {
        stepNumber: 2,
        title: "Shape and top",
        text: "Preheat oven to highest setting. Divide dough into 4 balls. Stretch each into a thin round. Spread crushed tomatoes, add mozzarella.",
      },
      {
        stepNumber: 3,
        title: "Bake",
        text: "Bake on a preheated stone or steel for 8-10 minutes until charred and bubbly. Add fresh basil and a drizzle of olive oil.",
        timers: [{ duration: "8-10 min", activity: "bake" }],
      },
    ],
  },

  // ─── Indian ───────────────────────────────────────────────
  {
    id: "chicken-tikka-masala",
    title: "Chicken Tikka Masala",
    emoji: "🍗",
    cuisines: ["Indian"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5D0A0 0%, #D46A30 40%, #8B2010 100%)",
      emoji: "🍗",
    },
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    difficulty: 3,
    liked: true,
    ingredientSections: [
      {
        name: "Marinade",
        ingredients: [
          {
            amount: "600",
            unit: "g",
            name: "Chicken thighs",
            notes: "Boneless, cubed",
          },
          { amount: "200", unit: "ml", name: "Yogurt" },
          { amount: "2", unit: "tbsp", name: "Tikka masala spice blend" },
          { amount: "1", unit: "tbsp", name: "Lemon juice" },
        ],
      },
      {
        name: "Sauce",
        ingredients: [
          { amount: "400", unit: "g", name: "Canned tomatoes" },
          { amount: "200", unit: "ml", name: "Heavy cream" },
          { amount: "2", name: "Onions", notes: "Finely diced" },
          { amount: "3", unit: "cloves", name: "Garlic" },
          { amount: "1", unit: "tbsp", name: "Ginger", notes: "Grated" },
          { amount: "1", unit: "tsp", name: "Garam masala" },
          { amount: "1", unit: "tsp", name: "Cumin" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Marinate the chicken",
        text: "Combine chicken with yogurt, spice blend, and lemon juice. Refrigerate for at least 1 hour or overnight.",
        timers: [{ duration: "1 hour", activity: "marinate" }],
      },
      {
        stepNumber: 2,
        title: "Grill the chicken",
        text: "Thread chicken onto skewers or spread on a baking tray. Grill or broil at high heat until charred, about 10-12 minutes.",
        timers: [{ duration: "10-12 min", activity: "grill" }],
      },
      {
        stepNumber: 3,
        title: "Make the sauce",
        text: "Saute onions until golden. Add garlic, ginger, and spices. Cook 1 minute. Add tomatoes and simmer 15 minutes. Stir in cream.",
        timers: [{ duration: "15 min", activity: "simmer" }],
      },
      {
        stepNumber: 4,
        title: "Combine",
        text: "Add grilled chicken to the sauce. Simmer 5 minutes to meld flavours. Serve with basmati rice and naan.",
      },
    ],
  },

  // ─── Japanese ─────────────────────────────────────────────
  {
    id: "sushi-rolls",
    title: "Sushi Rolls",
    emoji: "🍣",
    cuisines: ["Japanese"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #E8F0E0 0%, #5A8A3C 40%, #2D4016 100%)",
      emoji: "🍣",
    },
    prepTime: 45,
    cookTime: 45,
    servings: 4,
    difficulty: 4,
    ingredientSections: [
      {
        name: "Sushi Rice",
        ingredients: [
          { amount: "400", unit: "g", name: "Japanese short-grain rice" },
          { amount: "60", unit: "ml", name: "Rice vinegar" },
          { amount: "2", unit: "tbsp", name: "Sugar" },
          { amount: "1", unit: "tsp", name: "Salt" },
        ],
      },
      {
        name: "Fillings",
        ingredients: [
          { amount: "200", unit: "g", name: "Sashimi-grade salmon or tuna" },
          { amount: "1", name: "Cucumber", notes: "Cut into thin strips" },
          { amount: "1", name: "Avocado", notes: "Sliced" },
          { amount: "4", unit: "sheets", name: "Nori" },
          { amount: "To taste", name: "Wasabi, soy sauce, pickled ginger" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Cook the rice",
        text: "Wash rice until water runs clear. Cook in rice cooker or pot. Mix vinegar, sugar, and salt, then fold into hot rice. Fan to cool.",
      },
      {
        stepNumber: 2,
        title: "Prepare fillings",
        text: "Slice fish into thin strips. Cut cucumber and avocado into long, thin pieces.",
      },
      {
        stepNumber: 3,
        title: "Roll the sushi",
        text: "Place nori on a bamboo mat. Spread rice evenly, leaving 2cm at the top. Arrange fillings in a line. Roll tightly using the mat.",
        tips: ["Wet your fingers before handling rice to prevent sticking."],
      },
      {
        stepNumber: 4,
        title: "Slice and serve",
        text: "Use a sharp, wet knife to cut each roll into 6-8 pieces. Serve with soy sauce, wasabi, and pickled ginger.",
      },
    ],
  },

  // ─── Mexican ──────────────────────────────────────────────
  {
    id: "fish-tacos",
    title: "Fish Tacos",
    emoji: "🌮",
    cuisines: ["Mexican"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5F0CC 0%, #D4B040 40%, #8B7020 100%)",
      emoji: "🌮",
    },
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 1,
    ingredientSections: [
      {
        ingredients: [
          {
            amount: "500",
            unit: "g",
            name: "White fish fillets",
            notes: "Mahi-mahi, cod, or tilapia",
          },
          { amount: "8", name: "Small corn tortillas" },
          { amount: "1/2", name: "Red cabbage", notes: "Finely shredded" },
          { amount: "1", name: "Avocado", notes: "Sliced" },
          { amount: "1", name: "Lime", notes: "Cut into wedges" },
          { amount: "2", unit: "tbsp", name: "Chipotle mayo" },
          { amount: "1", unit: "tsp", name: "Cumin" },
          { amount: "1", unit: "tsp", name: "Smoked paprika" },
          { amount: "Handful", name: "Fresh coriander" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Season the fish",
        text: "Pat fish dry, season with cumin, smoked paprika, salt, and pepper.",
      },
      {
        stepNumber: 2,
        title: "Cook the fish",
        text: "Grill or pan-fry fish over high heat for 3-4 minutes per side until flaky and slightly charred.",
        timers: [{ duration: "3-4 min", activity: "per side" }],
      },
      {
        stepNumber: 3,
        title: "Assemble",
        text: "Warm tortillas. Flake fish into pieces. Top tortillas with cabbage, fish, avocado, chipotle mayo, coriander, and a squeeze of lime.",
      },
    ],
  },

  // ─── Korean ───────────────────────────────────────────────
  {
    id: "bibimbap",
    title: "Bibimbap",
    emoji: "🍚",
    cuisines: ["Korean"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5E8D0 0%, #D48040 40%, #8B3818 100%)",
      emoji: "🍚",
    },
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    difficulty: 3,
    bookmarked: true,
    ingredientSections: [
      {
        ingredients: [
          { amount: "300", unit: "g", name: "Steamed rice" },
          {
            amount: "150",
            unit: "g",
            name: "Beef sirloin",
            notes: "Thinly sliced",
          },
          { amount: "1", name: "Carrot", notes: "Julienned" },
          { amount: "100", unit: "g", name: "Spinach", notes: "Blanched" },
          { amount: "100", unit: "g", name: "Bean sprouts" },
          { amount: "1", name: "Zucchini", notes: "Sliced" },
          { amount: "2", name: "Eggs" },
          { amount: "3", unit: "tbsp", name: "Gochujang" },
          { amount: "1", unit: "tbsp", name: "Sesame oil" },
          { amount: "1", unit: "tbsp", name: "Soy sauce" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Prepare the vegetables",
        text: "Saute each vegetable separately with a pinch of salt and sesame oil. Blanch spinach and squeeze dry.",
      },
      {
        stepNumber: 2,
        title: "Cook the beef",
        text: "Marinate beef in soy sauce and sesame oil for 10 minutes. Stir-fry over high heat until browned.",
        timers: [{ duration: "10 min", activity: "marinate" }],
      },
      {
        stepNumber: 3,
        title: "Fry the egg",
        text: "Fry eggs sunny-side up in a hot pan until whites are set but yolk is still runny.",
      },
      {
        stepNumber: 4,
        title: "Assemble",
        text: "Place rice in a bowl. Arrange vegetables and beef in sections on top. Crown with the egg. Serve with gochujang on the side. Mix everything together before eating.",
      },
    ],
  },

  // ─── American ─────────────────────────────────────────────
  {
    id: "caesar-salad",
    title: "Caesar Salad",
    emoji: "🥗",
    cuisines: ["American"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #E8F0D0 0%, #7AA840 40%, #3A5018 100%)",
      emoji: "🥗",
    },
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    difficulty: 1,
    ingredientSections: [
      {
        ingredients: [
          {
            amount: "1",
            unit: "head",
            name: "Romaine lettuce",
            notes: "Washed, dried, torn",
          },
          { amount: "50", unit: "g", name: "Parmesan", notes: "Shaved" },
          { amount: "1", unit: "cup", name: "Croutons" },
        ],
      },
      {
        name: "Dressing",
        ingredients: [
          { amount: "2", name: "Anchovy fillets", notes: "Mashed" },
          { amount: "1", unit: "clove", name: "Garlic", notes: "Minced" },
          { amount: "1", name: "Egg yolk" },
          { amount: "1", unit: "tbsp", name: "Dijon mustard" },
          { amount: "2", unit: "tbsp", name: "Lemon juice" },
          { amount: "80", unit: "ml", name: "Olive oil" },
          { amount: "To taste", name: "Salt and pepper" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Make the dressing",
        text: "Whisk together mashed anchovy, garlic, egg yolk, mustard, and lemon juice. Slowly drizzle in olive oil while whisking to emulsify. Season with salt and pepper.",
      },
      {
        stepNumber: 2,
        title: "Toss the salad",
        text: "In a large bowl, toss romaine with dressing until evenly coated. Add croutons and shaved Parmesan.",
      },
      {
        stepNumber: 3,
        title: "Serve",
        text: "Plate immediately. Finish with an extra grind of pepper and shaved Parmesan on top.",
      },
    ],
  },

  // ─── Mediterranean ────────────────────────────────────────
  {
    id: "shakshuka",
    title: "Shakshuka",
    emoji: "🍳",
    cuisines: ["Mediterranean", "Middle Eastern"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5D0B0 0%, #D45030 40%, #8B1818 100%)",
      emoji: "🍳",
    },
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 2,
    liked: true,
    ingredientSections: [
      {
        ingredients: [
          { amount: "6", name: "Eggs" },
          {
            amount: "800",
            unit: "g",
            name: "Canned tomatoes",
            notes: "Chopped",
          },
          { amount: "1", name: "Red bell pepper", notes: "Diced" },
          { amount: "1", name: "Onion", notes: "Diced" },
          { amount: "3", unit: "cloves", name: "Garlic" },
          { amount: "1", unit: "tsp", name: "Cumin" },
          { amount: "1", unit: "tsp", name: "Smoked paprika" },
          { amount: "1/2", unit: "tsp", name: "Chilli flakes" },
          { amount: "Handful", name: "Fresh coriander" },
          { amount: "To taste", name: "Salt and pepper" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Saute aromatics",
        text: "Heat oil in a large skillet. Saute onion and bell pepper until soft, about 5 minutes. Add garlic and spices, cook 1 minute.",
        timers: [{ duration: "5 min", activity: "saute" }],
      },
      {
        stepNumber: 2,
        title: "Simmer the sauce",
        text: "Add canned tomatoes, season with salt and pepper. Simmer 10 minutes until thickened.",
        timers: [{ duration: "10 min", activity: "simmer" }],
      },
      {
        stepNumber: 3,
        title: "Poach the eggs",
        text: "Make 6 wells in the sauce. Crack an egg into each well. Cover and cook 5-7 minutes until whites are set but yolks are still runny.",
        timers: [{ duration: "5-7 min", activity: "poach" }],
      },
      {
        stepNumber: 4,
        title: "Serve",
        text: "Scatter fresh coriander over the top. Serve straight from the pan with crusty bread for dipping.",
      },
    ],
  },

  // ─── Japanese (Ramen) ─────────────────────────────────────
  {
    id: "ramen",
    title: "Ramen",
    emoji: "🍜",
    cuisines: ["Japanese"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5E8D0 0%, #C4944A 40%, #6B4A18 100%)",
      emoji: "🍜",
    },
    prepTime: 30,
    cookTime: 210,
    servings: 4,
    difficulty: 5,
    bookmarked: true,
    liked: true,
    ingredientSections: [
      {
        name: "Broth",
        ingredients: [
          {
            amount: "1",
            unit: "kg",
            name: "Pork bones",
            notes: "Trotters and neck bones",
          },
          { amount: "500", unit: "g", name: "Chicken carcass" },
          { amount: "1", name: "Onion", notes: "Halved" },
          { amount: "6", unit: "cloves", name: "Garlic" },
          { amount: "5cm", name: "Ginger", notes: "Sliced" },
          { amount: "1", unit: "sheet", name: "Kombu" },
        ],
      },
      {
        name: "Tare (seasoning)",
        ingredients: [
          { amount: "80", unit: "ml", name: "Soy sauce" },
          { amount: "2", unit: "tbsp", name: "Mirin" },
          { amount: "1", unit: "tbsp", name: "Sake" },
        ],
      },
      {
        name: "Toppings",
        ingredients: [
          { amount: "4", name: "Ramen eggs", notes: "Soft-boiled, marinated" },
          { amount: "200", unit: "g", name: "Chashu pork", notes: "Sliced" },
          { amount: "4", unit: "portions", name: "Fresh ramen noodles" },
          { amount: "2", name: "Spring onions", notes: "Sliced" },
          { amount: "1", unit: "sheet", name: "Nori" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Blanch the bones",
        text: "Cover pork and chicken bones with cold water, bring to a vigorous boil for 10 minutes. Drain, rinse off scum, and clean the pot.",
        timers: [{ duration: "10 min", activity: "blanch" }],
      },
      {
        stepNumber: 2,
        title: "Simmer the broth",
        text: "Return cleaned bones to pot with fresh water, onion, garlic, and ginger. Bring to a rolling boil then reduce to a medium simmer. Cook for 3-4 hours, stirring occasionally.",
        timers: [{ duration: "3-4 hours", activity: "simmer" }],
        tips: [
          "For a creamy tonkotsu-style broth, keep it at a rolling boil instead of a gentle simmer.",
        ],
      },
      {
        stepNumber: 3,
        title: "Prepare toppings",
        text: "Soft-boil eggs (6.5 minutes), marinate in soy-mirin mixture. Sear and braise chashu pork. Slice when cool.",
        timers: [{ duration: "6.5 min", activity: "boil eggs" }],
      },
      {
        stepNumber: 4,
        title: "Assemble",
        text: "Place tare in each bowl. Strain and ladle hot broth over tare. Cook noodles and add. Arrange toppings: chashu, egg, nori, spring onions.",
      },
    ],
    variations: [
      {
        title: "Miso Ramen",
        subtitle: "Add white miso paste to tare",
        emoji: "🫘",
      },
      {
        title: "Shoyu Ramen",
        subtitle: "Light soy-based clear broth",
        emoji: "🍶",
      },
    ],
  },

  // ─── Italian (Carbonara) ──────────────────────────────────
  {
    id: "pasta-carbonara",
    title: "Pasta Carbonara",
    emoji: "🍝",
    cuisines: ["Italian"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5F0D8 0%, #D4C460 40%, #8B8020 100%)",
      emoji: "🍝",
    },
    prepTime: 5,
    cookTime: 20,
    servings: 2,
    difficulty: 2,
    ingredientSections: [
      {
        ingredients: [
          { amount: "200", unit: "g", name: "Spaghetti or rigatoni" },
          {
            amount: "150",
            unit: "g",
            name: "Guanciale",
            notes: "Cut into small strips",
          },
          { amount: "3", name: "Egg yolks" },
          { amount: "1", name: "Whole egg" },
          {
            amount: "80",
            unit: "g",
            name: "Pecorino Romano",
            notes: "Finely grated",
          },
          {
            amount: "To taste",
            name: "Black pepper",
            notes: "Freshly cracked, generous",
          },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Render guanciale",
        text: "Cook guanciale in a cold pan over medium-low heat until fat is rendered and meat is crispy. Remove from heat.",
        timers: [{ duration: "8-10 min", activity: "render" }],
      },
      {
        stepNumber: 2,
        title: "Make egg mixture",
        text: "Whisk egg yolks, whole egg, and most of the Pecorino together. Add generous black pepper.",
      },
      {
        stepNumber: 3,
        title: "Cook and combine",
        text: "Cook pasta in well-salted water until al dente. Reserve 1 cup pasta water. Toss hot pasta with guanciale off heat. Add egg mixture, tossing vigorously. Add pasta water to reach silky consistency.",
        warnings: [
          {
            icon: "⚠️",
            text: "Never add egg mixture over direct heat or you will get scrambled eggs.",
          },
        ],
      },
    ],
  },

  // ─── Thai (Green Curry) ───────────────────────────────────
  {
    id: "green-curry",
    title: "Green Curry",
    emoji: "🍛",
    cuisines: ["Thai"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #D0F0C0 0%, #4A9A30 40%, #1A5010 100%)",
      emoji: "🍛",
    },
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 2,
    ingredientSections: [
      {
        ingredients: [
          { amount: "400", unit: "ml", name: "Coconut milk" },
          { amount: "3", unit: "tbsp", name: "Green curry paste" },
          { amount: "400", unit: "g", name: "Chicken thighs", notes: "Sliced" },
          { amount: "200", unit: "g", name: "Thai eggplant or bamboo shoots" },
          { amount: "2", unit: "tbsp", name: "Fish sauce" },
          { amount: "1", unit: "tbsp", name: "Palm sugar" },
          { amount: "4", name: "Kaffir lime leaves" },
          { amount: "Handful", name: "Thai basil" },
          { amount: "2", name: "Red chillies", notes: "Sliced" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Bloom the curry paste",
        text: "Heat the thick top of the coconut milk in a wok. Add curry paste and fry until fragrant, 2-3 minutes.",
        timers: [{ duration: "2-3 min", activity: "fry paste" }],
      },
      {
        stepNumber: 2,
        title: "Cook the chicken",
        text: "Add chicken and cook until sealed. Pour in remaining coconut milk, eggplant, and lime leaves. Simmer 15 minutes.",
        timers: [{ duration: "15 min", activity: "simmer" }],
      },
      {
        stepNumber: 3,
        title: "Season and serve",
        text: "Season with fish sauce and palm sugar. Stir in Thai basil and red chillies. Serve over jasmine rice.",
      },
    ],
  },

  // ─── Thai (Massaman Curry) ────────────────────────────────
  {
    id: "massaman-curry",
    title: "Massaman Curry",
    emoji: "🍛",
    cuisines: ["Thai"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F0D5A8 0%, #D4A050 40%, #8B5820 100%)",
      emoji: "🍛",
    },
    prepTime: 20,
    cookTime: 100,
    servings: 4,
    difficulty: 3,
    liked: true,
    ingredientSections: [
      {
        ingredients: [
          { amount: "800", unit: "ml", name: "Coconut milk", notes: "2 cans" },
          { amount: "3", unit: "tbsp", name: "Massaman curry paste" },
          {
            amount: "1",
            unit: "kg",
            name: "Beef chuck",
            notes: "Cut into large cubes",
          },
          { amount: "300", unit: "g", name: "Baby potatoes", notes: "Halved" },
          { amount: "2", name: "Brown onions", notes: "Quartered" },
          { amount: "80", unit: "g", name: "Roasted peanuts" },
          { amount: "3", unit: "tbsp", name: "Fish sauce" },
          { amount: "2", unit: "tbsp", name: "Palm sugar" },
          { amount: "2", unit: "tbsp", name: "Tamarind paste" },
          { amount: "1", name: "Cinnamon stick" },
          { amount: "3", name: "Cardamom pods" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Fry the paste",
        text: '<b>Fry the paste:</b> Skim thick cream from the top of the <ingr>coconut milk</ingr>. Fry <ingr>massaman curry paste</ingr> in the cream over medium heat until fragrant and oil separates, about <timer duration="5 min">5 min</timer>.',
        timers: [{ duration: "5 min", activity: "fry" }],
      },
      {
        stepNumber: 2,
        title: "Braise the beef",
        text: 'Add <ingr>beef</ingr> cubes and sear in the paste. Pour in remaining <ingr>coconut milk</ingr>, add <ingr>cinnamon stick</ingr> and <ingr>cardamom</ingr>. Bring to a simmer, cover, and braise for <timer duration="1 hour">1 hour</timer>.',
        timers: [{ duration: "1 hour", activity: "braise" }],
      },
      {
        stepNumber: 3,
        title: "Add vegetables",
        text: 'Add <ingr>baby potatoes</ingr> and <ingr>onions</ingr>. Continue cooking <timer duration="30 min">30 min</timer> until potatoes are tender and beef is falling apart.',
        timers: [{ duration: "30 min", activity: "cook" }],
      },
      {
        stepNumber: 4,
        title: "Season and serve",
        text: "Stir in <ingr>fish sauce</ingr>, <ingr>palm sugar</ingr>, <ingr>tamarind paste</ingr>, and <ingr>roasted peanuts</ingr>. Taste and adjust. Serve with jasmine rice.",
      },
    ],
  },

  // ─── Chinese ──────────────────────────────────────────────
  {
    id: "peking-duck",
    title: "Peking Duck",
    emoji: "🦆",
    cuisines: ["Chinese"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5D0A0 0%, #C47030 40%, #6B2810 100%)",
      emoji: "🦆",
    },
    prepTime: 60,
    cookTime: 240,
    servings: 6,
    difficulty: 5,
    ingredientSections: [
      {
        name: "Duck",
        ingredients: [
          { amount: "1", name: "Whole duck", notes: "About 2.5kg" },
          { amount: "2", unit: "tbsp", name: "Maltose or honey" },
          { amount: "2", unit: "tbsp", name: "Shaoxing wine" },
          { amount: "1", unit: "tbsp", name: "Rice vinegar" },
          { amount: "1", unit: "tsp", name: "Five spice powder" },
        ],
      },
      {
        name: "To Serve",
        ingredients: [
          { amount: "20", name: "Mandarin pancakes" },
          {
            amount: "1",
            unit: "bunch",
            name: "Spring onions",
            notes: "Cut into thin strips",
          },
          { amount: "1", name: "Cucumber", notes: "Cut into thin strips" },
          { amount: "60", unit: "ml", name: "Hoisin sauce" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Prepare the duck",
        text: "Remove giblets. Pour boiling water over the duck several times to tighten the skin. Pat dry. Mix maltose, wine, vinegar, and five spice. Brush all over the duck.",
      },
      {
        stepNumber: 2,
        title: "Dry the duck",
        text: "Hang the duck in a cool, well-ventilated space or place uncovered in the fridge for 24 hours. The skin must be completely dry for a crispy result.",
        timers: [{ duration: "24 hours", activity: "dry" }],
      },
      {
        stepNumber: 3,
        title: "Roast",
        text: "Roast at 200C for 40 minutes, then reduce to 160C for another 40 minutes until skin is deeply lacquered and crispy.",
        timers: [{ duration: "80 min", activity: "roast" }],
      },
      {
        stepNumber: 4,
        title: "Carve and serve",
        text: "Rest for 10 minutes. Carve the skin into squares and slice the meat. Serve with warm pancakes, spring onions, cucumber, and hoisin sauce.",
      },
    ],
  },

  // ─── Spanish ──────────────────────────────────────────────
  {
    id: "paella",
    title: "Paella",
    emoji: "🥘",
    cuisines: ["Spanish"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5E8A0 0%, #D4A030 40%, #8B5810 100%)",
      emoji: "🥘",
    },
    prepTime: 20,
    cookTime: 70,
    servings: 6,
    difficulty: 3,
    bookmarked: true,
    ingredientSections: [
      {
        ingredients: [
          { amount: "400", unit: "g", name: "Bomba or Calasparra rice" },
          { amount: "1", unit: "L", name: "Chicken stock", notes: "Hot" },
          { amount: "Large pinch", name: "Saffron threads" },
          {
            amount: "300",
            unit: "g",
            name: "Chicken thighs",
            notes: "Bone-in, seasoned",
          },
          { amount: "200", unit: "g", name: "Chorizo", notes: "Sliced" },
          { amount: "300", unit: "g", name: "Prawns", notes: "Shell-on" },
          { amount: "200", unit: "g", name: "Mussels", notes: "Cleaned" },
          { amount: "1", name: "Red bell pepper", notes: "Sliced" },
          { amount: "1", name: "Onion", notes: "Diced" },
          { amount: "4", unit: "cloves", name: "Garlic" },
          { amount: "200", unit: "g", name: "Green beans", notes: "Trimmed" },
          { amount: "1", name: "Lemon", notes: "Cut into wedges" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Sear the meats",
        text: "Heat olive oil in a large paella pan. Brown chicken pieces on all sides. Add chorizo and cook until rendered. Remove and set aside.",
      },
      {
        stepNumber: 2,
        title: "Build the sofrito",
        text: "Saute onion, pepper, and green beans in the same pan. Add garlic and cook 1 minute. Stir in saffron-infused stock.",
      },
      {
        stepNumber: 3,
        title: "Cook the rice",
        text: "Scatter rice evenly across the pan. Do not stir from this point. Return chicken and chorizo. Simmer 18-20 minutes until rice absorbs the liquid.",
        timers: [{ duration: "18-20 min", activity: "simmer" }],
        warnings: [
          {
            icon: "⚠️",
            text: "Do not stir the rice once added — this develops the socarrat (crispy bottom).",
          },
        ],
      },
      {
        stepNumber: 4,
        title: "Add seafood",
        text: "Nestle prawns and mussels into the rice. Cover with foil and cook 5-8 minutes until mussels open and prawns are pink. Rest 5 minutes. Serve with lemon wedges.",
        timers: [{ duration: "5-8 min", activity: "cook seafood" }],
      },
    ],
  },

  // ─── Greek ────────────────────────────────────────────────
  {
    id: "moussaka",
    title: "Moussaka",
    emoji: "🍆",
    cuisines: ["Greek"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #E8D8C8 0%, #A07848 40%, #5A3818 100%)",
      emoji: "🍆",
    },
    prepTime: 30,
    cookTime: 90,
    servings: 6,
    difficulty: 3,
    ingredientSections: [
      {
        name: "Layers",
        ingredients: [
          { amount: "3", name: "Large eggplants", notes: "Sliced 1cm thick" },
          { amount: "500", unit: "g", name: "Ground lamb" },
          { amount: "400", unit: "g", name: "Canned tomatoes" },
          { amount: "1", name: "Onion", notes: "Diced" },
          { amount: "2", unit: "cloves", name: "Garlic" },
          { amount: "1", unit: "tsp", name: "Cinnamon" },
          { amount: "1/2", unit: "tsp", name: "Allspice" },
        ],
      },
      {
        name: "Bechamel",
        ingredients: [
          { amount: "60", unit: "g", name: "Butter" },
          { amount: "60", unit: "g", name: "Flour" },
          { amount: "600", unit: "ml", name: "Milk" },
          { amount: "2", name: "Egg yolks" },
          { amount: "Pinch", name: "Nutmeg" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Prepare eggplant",
        text: "Salt eggplant slices and let drain 30 minutes. Pat dry and brush with olive oil. Grill or roast until golden.",
        timers: [{ duration: "30 min", activity: "drain" }],
      },
      {
        stepNumber: 2,
        title: "Make the meat sauce",
        text: "Brown lamb with onion and garlic. Add cinnamon, allspice, and tomatoes. Simmer 20 minutes until thickened.",
        timers: [{ duration: "20 min", activity: "simmer" }],
      },
      {
        stepNumber: 3,
        title: "Make bechamel",
        text: "Melt butter, whisk in flour, and cook 1 minute. Gradually add milk, whisking constantly. Cook until thick. Off heat, whisk in egg yolks and nutmeg.",
      },
      {
        stepNumber: 4,
        title: "Assemble and bake",
        text: "Layer eggplant, meat sauce, eggplant, remaining meat sauce. Pour bechamel over top. Bake at 180C for 45 minutes until golden and bubbly.",
        timers: [{ duration: "45 min", activity: "bake" }],
      },
    ],
  },

  // ─── Indian (Butter Chicken) ──────────────────────────────
  {
    id: "butter-chicken",
    title: "Butter Chicken",
    emoji: "🍗",
    cuisines: ["Indian"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5C8A0 0%, #D47830 40%, #8B3018 100%)",
      emoji: "🍗",
    },
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    difficulty: 2,
    liked: true,
    ingredientSections: [
      {
        ingredients: [
          { amount: "600", unit: "g", name: "Chicken thighs", notes: "Cubed" },
          { amount: "200", unit: "ml", name: "Yogurt" },
          { amount: "2", unit: "tbsp", name: "Tandoori spice mix" },
          { amount: "400", unit: "g", name: "Canned tomatoes" },
          { amount: "100", unit: "ml", name: "Heavy cream" },
          { amount: "50", unit: "g", name: "Butter" },
          { amount: "1", name: "Onion", notes: "Diced" },
          { amount: "3", unit: "cloves", name: "Garlic" },
          { amount: "1", unit: "tbsp", name: "Ginger", notes: "Grated" },
          { amount: "1", unit: "tsp", name: "Garam masala" },
          { amount: "1", unit: "tbsp", name: "Honey" },
          { amount: "Handful", name: "Fresh coriander" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Marinate the chicken",
        text: "Coat chicken in yogurt and tandoori spice mix. Let sit at least 30 minutes.",
        timers: [{ duration: "30 min", activity: "marinate" }],
      },
      {
        stepNumber: 2,
        title: "Cook the chicken",
        text: "Grill or pan-fry marinated chicken until charred on the outside. It does not need to be cooked through — it will finish in the sauce.",
      },
      {
        stepNumber: 3,
        title: "Make the sauce",
        text: "Melt butter, saute onion until soft. Add garlic and ginger, then tomatoes. Simmer 15 minutes. Blend until smooth. Return to pan, stir in cream, garam masala, and honey.",
        timers: [{ duration: "15 min", activity: "simmer" }],
      },
      {
        stepNumber: 4,
        title: "Combine and serve",
        text: "Add chicken to sauce and simmer 10 minutes until cooked through. Garnish with coriander. Serve with naan and rice.",
      },
    ],
  },

  // ─── Italian (Cacio e Pepe) ───────────────────────────────
  {
    id: "cacio-e-pepe",
    title: "Cacio e Pepe",
    emoji: "🧀",
    cuisines: ["Italian"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5F0D0 0%, #D4C870 40%, #8B8530 100%)",
      emoji: "🧀",
    },
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    difficulty: 2,
    ingredientSections: [
      {
        ingredients: [
          { amount: "200", unit: "g", name: "Tonnarelli or spaghetti" },
          {
            amount: "150",
            unit: "g",
            name: "Pecorino Romano",
            notes: "Very finely grated",
          },
          {
            amount: "2",
            unit: "tsp",
            name: "Black peppercorns",
            notes: "Freshly cracked",
          },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Toast the pepper",
        text: "Toast cracked black peppercorns in a dry skillet over medium heat until fragrant, about 1-2 minutes. Add a ladle of pasta water to stop the toasting.",
      },
      {
        stepNumber: 2,
        title: "Cook the pasta",
        text: "Cook pasta in salted water until just shy of al dente. Reserve 2 cups pasta water before draining.",
      },
      {
        stepNumber: 3,
        title: "Emulsify",
        text: "Transfer pasta to the pepper pan. Add pasta water a splash at a time, tossing vigorously. Off heat, add Pecorino in batches, tossing constantly to form a creamy emulsion. Serve immediately.",
        warnings: [
          {
            icon: "⚠️",
            text: "Add cheese off heat to avoid clumping. Toss vigorously for a smooth sauce.",
          },
        ],
      },
    ],
  },

  // ─── British ──────────────────────────────────────────────
  {
    id: "beef-wellington",
    title: "Beef Wellington",
    emoji: "🥩",
    cuisines: ["British"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #E8D0B0 0%, #A06838 40%, #5A2818 100%)",
      emoji: "🥩",
    },
    prepTime: 45,
    cookTime: 135,
    servings: 6,
    difficulty: 5,
    ingredientSections: [
      {
        name: "Wellington",
        ingredients: [
          {
            amount: "1",
            unit: "kg",
            name: "Beef tenderloin",
            notes: "Centre-cut, trimmed",
          },
          {
            amount: "500",
            unit: "g",
            name: "Mushrooms",
            notes: "Finely chopped — duxelles",
          },
          { amount: "6", unit: "slices", name: "Prosciutto" },
          {
            amount: "500",
            unit: "g",
            name: "Puff pastry",
            notes: "Thawed if frozen",
          },
          { amount: "2", unit: "tbsp", name: "English mustard" },
          { amount: "2", unit: "tbsp", name: "Dijon mustard" },
          { amount: "1", name: "Egg", notes: "Beaten, for egg wash" },
          { amount: "To taste", name: "Salt and pepper" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Sear the beef",
        text: "Season beef generously. Sear in a very hot pan on all sides until a deep golden crust forms. Brush with both mustards. Let cool completely.",
      },
      {
        stepNumber: 2,
        title: "Make the duxelles",
        text: "Cook finely chopped mushrooms in butter until all moisture evaporates and the mixture is dry and concentrated. Season well. Cool completely.",
        tips: [
          "The duxelles must be completely dry or the pastry will be soggy.",
        ],
      },
      {
        stepNumber: 3,
        title: "Wrap",
        text: "Lay out cling film. Overlap prosciutto slices. Spread duxelles over prosciutto. Place beef at one end and roll tightly into a log. Refrigerate 30 minutes. Then wrap in puff pastry, seal edges, and egg wash.",
        timers: [{ duration: "30 min", activity: "chill" }],
      },
      {
        stepNumber: 4,
        title: "Bake",
        text: "Bake at 220C for 25-30 minutes until pastry is deep golden and internal temperature reaches 52C for medium-rare. Rest 10 minutes before slicing.",
        timers: [{ duration: "25-30 min", activity: "bake" }],
        warnings: [
          {
            icon: "⚠️",
            text: "Use a meat thermometer. 52C for medium-rare, 57C for medium.",
          },
        ],
      },
    ],
    variations: [
      {
        title: "Mushroom Wellington",
        subtitle: "Vegetarian version with whole portobello",
        emoji: "🍄",
      },
    ],
  },

  // ─── Thai (Tom Yum) ───────────────────────────────────────
  {
    id: "tom-yum-soup",
    title: "Tom Yum Soup",
    emoji: "🍲",
    cuisines: ["Thai"],
    heroImage: {
      gradient:
        "linear-gradient(160deg, #F5D8B0 0%, #D46830 40%, #8B2818 100%)",
      emoji: "🍲",
    },
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 2,
    ingredientSections: [
      {
        ingredients: [
          { amount: "1", unit: "L", name: "Chicken or prawn stock" },
          {
            amount: "300",
            unit: "g",
            name: "Prawns",
            notes: "Peeled and deveined",
          },
          { amount: "200", unit: "g", name: "Mushrooms", notes: "Halved" },
          {
            amount: "3",
            name: "Lemongrass stalks",
            notes: "Smashed and cut into 5cm pieces",
          },
          { amount: "5", name: "Kaffir lime leaves", notes: "Torn" },
          { amount: "3", unit: "slices", name: "Galangal" },
          { amount: "3", unit: "tbsp", name: "Fish sauce" },
          { amount: "3", unit: "tbsp", name: "Lime juice" },
          {
            amount: "2",
            unit: "tbsp",
            name: "Chilli paste in oil",
            notes: "Nam prik pao",
          },
          { amount: "2", name: "Bird's eye chillies", notes: "Crushed" },
          { amount: "Handful", name: "Fresh coriander" },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Build the broth",
        text: "Bring stock to a boil. Add lemongrass, galangal, and kaffir lime leaves. Simmer 5 minutes to infuse.",
        timers: [{ duration: "5 min", activity: "infuse" }],
      },
      {
        stepNumber: 2,
        title: "Cook the prawns",
        text: "Add mushrooms and cook 2 minutes. Add prawns and cook until pink, about 3 minutes.",
        timers: [{ duration: "3 min", activity: "cook prawns" }],
      },
      {
        stepNumber: 3,
        title: "Season and serve",
        text: "Remove from heat. Stir in fish sauce, lime juice, chilli paste, and crushed chillies. Taste and adjust the balance of sour, salty, and spicy. Garnish with coriander.",
        tips: ["Add lime juice off heat to preserve its brightness."],
      },
    ],
  },
];
