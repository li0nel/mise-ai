import type { Recipe } from "../types";

/** Seed recipe written to Firestore on first login when collection is empty */
export const SEED_RECIPE: Recipe = {
  id: "massaman-curry",
  title: "Massaman Curry",
  emoji: "\u{1F35B}",
  cuisines: ["Thai"],
  heroImage: {
    gradient: "linear-gradient(160deg, #F0D5A8 0%, #D4A050 40%, #8B5820 100%)",
    emoji: "\u{1F35B}",
  },
  prepTime: 20,
  cookTime: 100,
  servings: 4,
  difficulty: 3,
  liked: true,
  ingredientSections: [
    {
      name: "Curry Paste",
      ingredients: [
        {
          amount: "5",
          name: "Dried chillies",
          notes: "Soaked in warm water 20 min",
        },
        { amount: "1", unit: "tbsp", name: "Coriander seeds" },
        { amount: "1", unit: "tsp", name: "Cumin seeds" },
        { amount: "4", unit: "cloves", name: "Garlic" },
        {
          amount: "2",
          unit: "stalks",
          name: "Lemongrass",
          notes: "Tender parts only, sliced",
        },
        { amount: "3", name: "Shallots", notes: "Roughly chopped" },
        { amount: "2", unit: "cm", name: "Galangal", notes: "Sliced" },
        { amount: "1", unit: "tsp", name: "Roasted shrimp paste" },
        { amount: "1/2", unit: "tsp", name: "Salt" },
      ],
    },
    {
      name: "Curry",
      ingredients: [
        { amount: "800", unit: "ml", name: "Coconut milk", notes: "2 cans" },
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
        { amount: "2", name: "Bay leaves" },
      ],
    },
  ],
  instructions: [
    {
      stepNumber: 1,
      title: "Make the curry paste",
      text: '<b>Make the curry paste:</b> Drain the soaked <ingr>dried chillies</ingr>. Toast <ingr>coriander seeds</ingr> and <ingr>cumin seeds</ingr> in a dry pan over medium heat for <timer duration="2 min">2 min</timer> until fragrant. Let cool, then grind to a powder in a spice grinder or mortar.',
    },
    {
      stepNumber: 2,
      title: "Pound the paste",
      text: 'Combine all paste ingredients in a mortar or food processor: drained <ingr>chillies</ingr>, ground spices, <ingr>garlic</ingr>, <ingr>lemongrass</ingr>, <ingr>shallots</ingr>, <ingr>galangal</ingr>, <ingr>roasted shrimp paste</ingr>, and <ingr>salt</ingr>. Pound or blend until a smooth, fragrant paste forms. <timer duration="10 min">10\u201315 min</timer>',
      tips: [
        "A mortar and pestle gives a coarser, more texturally complex paste than a blender. If using a blender, add a splash of coconut milk to help it move.",
      ],
    },
    {
      stepNumber: 3,
      title: "Fry the paste",
      text: 'In a large heavy-bottomed pot or Dutch oven, heat 3 tbsp of the thick cream from the top of a coconut milk can over medium-high heat. Add the <ingr>curry paste</ingr> and fry, stirring constantly, for <timer duration="4 min">4\u20135 min</timer> until darkened, fragrant, and oil has separated from the paste.',
      warnings: [
        {
          icon: "\u26A0\uFE0F",
          text: "Don\u2019t skip frying the paste \u2014 raw paste tastes muddy. You want it to deepen in colour and the oil to visibly separate from the solids.",
        },
      ],
    },
    {
      stepNumber: 4,
      title: "Sear the beef",
      text: 'Add the <ingr>beef chuck</ingr> cubes to the pot. Stir to coat every piece in the paste. Sear for <timer duration="3 min">3 min</timer> until the outside of the beef is sealed and lightly coloured.',
    },
    {
      stepNumber: 5,
      title: "Add coconut milk and spices",
      text: "Pour in the remaining <ingr>coconut milk</ingr>. Add <ingr>cinnamon stick</ingr>, <ingr>cardamom pods</ingr>, and <ingr>bay leaves</ingr>. Stir to combine. Bring to a gentle simmer, then reduce heat to low.",
    },
    {
      stepNumber: 6,
      title: "Slow braise",
      text: 'Cover and simmer on the lowest possible heat for <timer duration="1 hour">1 hour</timer>. Stir every 15\u201320 minutes. The beef should begin to tenderise but is not yet ready.',
      tips: [
        "The curry deepens in flavour and colour during this time. Resist the urge to crank up the heat \u2014 low and slow is everything for this dish.",
      ],
    },
    {
      stepNumber: 7,
      title: "Add vegetables and season",
      text: 'Add the <ingr>baby potatoes</ingr> and <ingr>quartered onions</ingr>. Stir in <ingr>half the peanuts</ingr>, <ingr>fish sauce</ingr>, <ingr>palm sugar</ingr>, and <ingr>tamarind paste</ingr>. Continue to simmer uncovered for another <timer duration="45 min">45\u201360 min</timer> until beef is fork-tender and sauce has thickened.',
    },
    {
      stepNumber: 8,
      title: "Adjust the balance",
      text: "Taste and adjust the balance: more <ingr>fish sauce</ingr> for salt, <ingr>palm sugar</ingr> for sweetness, <ingr>tamarind</ingr> for sour. The flavour should be simultaneously rich, sweet, slightly sour, and deeply savoury \u2014 with the aromatic spices in the background.",
    },
    {
      stepNumber: 9,
      title: "Finish the curry",
      text: "Remove the <ingr>cinnamon stick</ingr>, <ingr>cardamom pods</ingr>, and <ingr>bay leaves</ingr>. Scatter the remaining <ingr>roasted peanuts</ingr> over the top. The curry should be thick enough to coat a spoon.",
    },
    {
      stepNumber: 10,
      title: "Serve",
      text: "Serve over jasmine rice or roti canai. Garnish with additional peanuts, a swirl of coconut cream, and fresh coriander. Provide extra fish sauce and chilli on the side.",
      tips: [
        "Massaman tastes dramatically better the next day. Make it ahead \u2014 the flavours bloom and deepen overnight in the fridge.",
      ],
    },
  ],
};
