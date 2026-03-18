/** A dish entry in the search catalogue */
export interface DishEntry {
  name: string;
  emoji: string;
  cuisine: string;
}

/** Hardcoded catalogue of 200+ traditional dishes for search suggestions */
export const DISH_CATALOGUE: DishEntry[] = [
  // Thai
  { name: "Pad Thai", emoji: "\uD83C\uDF5C", cuisine: "Thai" },
  { name: "Green Curry", emoji: "\uD83C\uDF5B", cuisine: "Thai" },
  { name: "Massaman Curry", emoji: "\uD83C\uDF5B", cuisine: "Thai" },
  { name: "Tom Yum Soup", emoji: "\uD83C\uDF72", cuisine: "Thai" },
  { name: "Tom Kha Gai", emoji: "\uD83C\uDF72", cuisine: "Thai" },
  { name: "Pad See Ew", emoji: "\uD83C\uDF5C", cuisine: "Thai" },
  { name: "Khao Soi", emoji: "\uD83C\uDF5C", cuisine: "Thai" },
  { name: "Larb", emoji: "\uD83E\uDD57", cuisine: "Thai" },
  { name: "Som Tum", emoji: "\uD83E\uDD57", cuisine: "Thai" },
  { name: "Panang Curry", emoji: "\uD83C\uDF5B", cuisine: "Thai" },
  { name: "Thai Basil Chicken", emoji: "\uD83C\uDF57", cuisine: "Thai" },
  { name: "Mango Sticky Rice", emoji: "\uD83E\uDD6D", cuisine: "Thai" },

  // Japanese
  { name: "Ramen", emoji: "\uD83C\uDF5C", cuisine: "Japanese" },
  { name: "Tonkotsu Ramen", emoji: "\uD83C\uDF5C", cuisine: "Japanese" },
  { name: "Miso Ramen", emoji: "\uD83C\uDF5C", cuisine: "Japanese" },
  { name: "Sushi", emoji: "\uD83C\uDF63", cuisine: "Japanese" },
  { name: "Gyoza", emoji: "\uD83E\uDD5F", cuisine: "Japanese" },
  { name: "Teriyaki Chicken", emoji: "\uD83C\uDF57", cuisine: "Japanese" },
  { name: "Katsu Curry", emoji: "\uD83C\uDF5B", cuisine: "Japanese" },
  { name: "Okonomiyaki", emoji: "\uD83E\uDD5E", cuisine: "Japanese" },
  { name: "Takoyaki", emoji: "\uD83E\uDDC0", cuisine: "Japanese" },
  { name: "Udon", emoji: "\uD83C\uDF5C", cuisine: "Japanese" },
  { name: "Tempura", emoji: "\uD83C\uDF64", cuisine: "Japanese" },
  { name: "Chirashi Bowl", emoji: "\uD83C\uDF63", cuisine: "Japanese" },

  // Chinese
  { name: "Kung Pao Chicken", emoji: "\uD83C\uDF36\uFE0F", cuisine: "Chinese" },
  { name: "Mapo Tofu", emoji: "\uD83C\uDF36\uFE0F", cuisine: "Chinese" },
  { name: "Sweet and Sour Pork", emoji: "\uD83C\uDF56", cuisine: "Chinese" },
  { name: "Char Siu", emoji: "\uD83C\uDF56", cuisine: "Chinese" },
  { name: "Dan Dan Noodles", emoji: "\uD83C\uDF5C", cuisine: "Chinese" },
  { name: "Xiaolongbao", emoji: "\uD83E\uDD5F", cuisine: "Chinese" },
  { name: "Hot Pot", emoji: "\uD83C\uDF72", cuisine: "Chinese" },
  { name: "Fried Rice", emoji: "\uD83C\uDF5A", cuisine: "Chinese" },
  { name: "Chow Mein", emoji: "\uD83C\uDF5C", cuisine: "Chinese" },
  { name: "Peking Duck", emoji: "\uD83E\uDD86", cuisine: "Chinese" },
  { name: "Wonton Soup", emoji: "\uD83C\uDF72", cuisine: "Chinese" },
  { name: "Congee", emoji: "\uD83C\uDF5A", cuisine: "Chinese" },

  // Korean
  { name: "Bibimbap", emoji: "\uD83C\uDF5A", cuisine: "Korean" },
  { name: "Kimchi Jjigae", emoji: "\uD83C\uDF72", cuisine: "Korean" },
  { name: "Bulgogi", emoji: "\uD83E\uDD69", cuisine: "Korean" },
  { name: "Japchae", emoji: "\uD83C\uDF5C", cuisine: "Korean" },
  { name: "Korean Fried Chicken", emoji: "\uD83C\uDF57", cuisine: "Korean" },
  { name: "Tteokbokki", emoji: "\uD83C\uDF36\uFE0F", cuisine: "Korean" },
  { name: "Sundubu Jjigae", emoji: "\uD83C\uDF72", cuisine: "Korean" },
  { name: "Kimbap", emoji: "\uD83C\uDF63", cuisine: "Korean" },
  { name: "Galbi", emoji: "\uD83E\uDD69", cuisine: "Korean" },
  { name: "Kimchi Fried Rice", emoji: "\uD83C\uDF5A", cuisine: "Korean" },

  // Vietnamese
  { name: "Pho", emoji: "\uD83C\uDF5C", cuisine: "Vietnamese" },
  { name: "Banh Mi", emoji: "\uD83E\uDD56", cuisine: "Vietnamese" },
  { name: "Bun Bo Hue", emoji: "\uD83C\uDF5C", cuisine: "Vietnamese" },
  { name: "Spring Rolls", emoji: "\uD83E\uDD6C", cuisine: "Vietnamese" },
  { name: "Com Tam", emoji: "\uD83C\uDF5A", cuisine: "Vietnamese" },
  { name: "Bun Cha", emoji: "\uD83C\uDF5C", cuisine: "Vietnamese" },
  { name: "Cao Lau", emoji: "\uD83C\uDF5C", cuisine: "Vietnamese" },

  // Indian
  { name: "Butter Chicken", emoji: "\uD83C\uDF5B", cuisine: "Indian" },
  { name: "Chicken Tikka Masala", emoji: "\uD83C\uDF5B", cuisine: "Indian" },
  { name: "Palak Paneer", emoji: "\uD83E\uDD6C", cuisine: "Indian" },
  { name: "Biryani", emoji: "\uD83C\uDF5A", cuisine: "Indian" },
  { name: "Dal Makhani", emoji: "\uD83C\uDF5B", cuisine: "Indian" },
  { name: "Chole", emoji: "\uD83C\uDF5B", cuisine: "Indian" },
  { name: "Samosa", emoji: "\uD83E\uDD5F", cuisine: "Indian" },
  { name: "Naan", emoji: "\uD83C\uDF5E", cuisine: "Indian" },
  { name: "Aloo Gobi", emoji: "\uD83E\uDD55", cuisine: "Indian" },
  { name: "Rogan Josh", emoji: "\uD83C\uDF5B", cuisine: "Indian" },
  { name: "Vindaloo", emoji: "\uD83C\uDF36\uFE0F", cuisine: "Indian" },
  { name: "Dosa", emoji: "\uD83E\uDD5E", cuisine: "Indian" },
  { name: "Tandoori Chicken", emoji: "\uD83C\uDF57", cuisine: "Indian" },
  { name: "Korma", emoji: "\uD83C\uDF5B", cuisine: "Indian" },

  // Italian
  { name: "Carbonara", emoji: "\uD83C\uDF5D", cuisine: "Italian" },
  { name: "Cacio e Pepe", emoji: "\uD83C\uDF5D", cuisine: "Italian" },
  { name: "Bolognese", emoji: "\uD83C\uDF5D", cuisine: "Italian" },
  { name: "Margherita Pizza", emoji: "\uD83C\uDF55", cuisine: "Italian" },
  { name: "Risotto", emoji: "\uD83C\uDF5A", cuisine: "Italian" },
  { name: "Lasagna", emoji: "\uD83C\uDF5D", cuisine: "Italian" },
  { name: "Osso Buco", emoji: "\uD83E\uDD69", cuisine: "Italian" },
  { name: "Aglio e Olio", emoji: "\uD83C\uDF5D", cuisine: "Italian" },
  { name: "Tiramisu", emoji: "\uD83C\uDF70", cuisine: "Italian" },
  { name: "Focaccia", emoji: "\uD83C\uDF5E", cuisine: "Italian" },
  { name: "Arancini", emoji: "\uD83C\uDF5A", cuisine: "Italian" },
  { name: "Pesto Pasta", emoji: "\uD83C\uDF5D", cuisine: "Italian" },
  { name: "Eggplant Parmigiana", emoji: "\uD83C\uDF46", cuisine: "Italian" },

  // Mexican
  { name: "Birria Tacos", emoji: "\uD83C\uDF2E", cuisine: "Mexican" },
  { name: "Al Pastor Tacos", emoji: "\uD83C\uDF2E", cuisine: "Mexican" },
  { name: "Carnitas", emoji: "\uD83C\uDF56", cuisine: "Mexican" },
  { name: "Enchiladas", emoji: "\uD83C\uDF2F", cuisine: "Mexican" },
  { name: "Mole Poblano", emoji: "\uD83C\uDF36\uFE0F", cuisine: "Mexican" },
  { name: "Pozole", emoji: "\uD83C\uDF72", cuisine: "Mexican" },
  { name: "Tamales", emoji: "\uD83E\uDED4", cuisine: "Mexican" },
  { name: "Chilaquiles", emoji: "\uD83C\uDF2E", cuisine: "Mexican" },
  { name: "Guacamole", emoji: "\uD83E\uDD51", cuisine: "Mexican" },
  { name: "Elote", emoji: "\uD83C\uDF3D", cuisine: "Mexican" },
  { name: "Churros", emoji: "\uD83E\uDD64", cuisine: "Mexican" },
  { name: "Ceviche", emoji: "\uD83E\uDD90", cuisine: "Mexican" },

  // French
  { name: "Coq au Vin", emoji: "\uD83C\uDF57", cuisine: "French" },
  { name: "Boeuf Bourguignon", emoji: "\uD83E\uDD69", cuisine: "French" },
  { name: "Ratatouille", emoji: "\uD83E\uDD6C", cuisine: "French" },
  { name: "French Onion Soup", emoji: "\uD83C\uDF72", cuisine: "French" },
  { name: "Cr\u00eApes", emoji: "\uD83E\uDD5E", cuisine: "French" },
  { name: "Quiche Lorraine", emoji: "\uD83E\uDD67", cuisine: "French" },
  { name: "Bouillabaisse", emoji: "\uD83C\uDF72", cuisine: "French" },
  { name: "Cassoulet", emoji: "\uD83C\uDF72", cuisine: "French" },
  { name: "Croque Monsieur", emoji: "\uD83E\uDDC0", cuisine: "French" },
  { name: "Tarte Tatin", emoji: "\uD83E\uDD67", cuisine: "French" },

  // Mediterranean / Middle Eastern
  { name: "Falafel", emoji: "\uD83E\uDDC6", cuisine: "Middle Eastern" },
  { name: "Hummus", emoji: "\uD83E\uDDC6", cuisine: "Middle Eastern" },
  { name: "Shawarma", emoji: "\uD83E\uDD59", cuisine: "Middle Eastern" },
  { name: "Shakshuka", emoji: "\uD83C\uDF73", cuisine: "Middle Eastern" },
  { name: "Fattoush", emoji: "\uD83E\uDD57", cuisine: "Middle Eastern" },
  { name: "Moussaka", emoji: "\uD83C\uDF46", cuisine: "Greek" },
  { name: "Souvlaki", emoji: "\uD83C\uDF56", cuisine: "Greek" },
  { name: "Spanakopita", emoji: "\uD83E\uDD6C", cuisine: "Greek" },
  { name: "Tzatziki", emoji: "\uD83E\uDD6C", cuisine: "Greek" },
  { name: "Baklava", emoji: "\uD83C\uDF6C", cuisine: "Middle Eastern" },
  { name: "Tabbouleh", emoji: "\uD83E\uDD57", cuisine: "Middle Eastern" },
  { name: "Baba Ganoush", emoji: "\uD83C\uDF46", cuisine: "Middle Eastern" },

  // American
  { name: "Smash Burger", emoji: "\uD83C\uDF54", cuisine: "American" },
  { name: "Mac and Cheese", emoji: "\uD83E\uDDC0", cuisine: "American" },
  { name: "BBQ Ribs", emoji: "\uD83C\uDF56", cuisine: "American" },
  { name: "Pulled Pork", emoji: "\uD83C\uDF56", cuisine: "American" },
  { name: "Clam Chowder", emoji: "\uD83C\uDF72", cuisine: "American" },
  { name: "Fried Chicken", emoji: "\uD83C\uDF57", cuisine: "American" },
  { name: "Cornbread", emoji: "\uD83C\uDF5E", cuisine: "American" },
  { name: "Jambalaya", emoji: "\uD83C\uDF5A", cuisine: "American" },
  { name: "Gumbo", emoji: "\uD83C\uDF72", cuisine: "American" },
  { name: "Biscuits and Gravy", emoji: "\uD83C\uDF5E", cuisine: "American" },

  // Spanish
  { name: "Paella", emoji: "\uD83E\uDD58", cuisine: "Spanish" },
  { name: "Patatas Bravas", emoji: "\uD83E\uDD54", cuisine: "Spanish" },
  { name: "Gazpacho", emoji: "\uD83C\uDF72", cuisine: "Spanish" },
  { name: "Tortilla Espa\u00F1ola", emoji: "\uD83E\uDD5A", cuisine: "Spanish" },
  { name: "Churros con Chocolate", emoji: "\uD83C\uDF6B", cuisine: "Spanish" },

  // Caribbean / Latin
  { name: "Jerk Chicken", emoji: "\uD83C\uDF57", cuisine: "Caribbean" },
  { name: "Mofongo", emoji: "\uD83C\uDF4C", cuisine: "Caribbean" },
  { name: "Empanadas", emoji: "\uD83E\uDD5F", cuisine: "Latin American" },
  { name: "Arepas", emoji: "\uD83C\uDF3D", cuisine: "Latin American" },
  { name: "Lomo Saltado", emoji: "\uD83E\uDD69", cuisine: "Peruvian" },
  { name: "Aji de Gallina", emoji: "\uD83C\uDF5B", cuisine: "Peruvian" },

  // Ethiopian / African
  { name: "Doro Wat", emoji: "\uD83C\uDF5B", cuisine: "Ethiopian" },
  { name: "Injera", emoji: "\uD83C\uDF5E", cuisine: "Ethiopian" },
  { name: "Jollof Rice", emoji: "\uD83C\uDF5A", cuisine: "West African" },
  { name: "Bobotie", emoji: "\uD83C\uDF5B", cuisine: "South African" },
  { name: "Tagine", emoji: "\uD83C\uDF72", cuisine: "Moroccan" },
  { name: "Couscous", emoji: "\uD83C\uDF5A", cuisine: "Moroccan" },

  // Southeast Asian
  { name: "Nasi Goreng", emoji: "\uD83C\uDF5A", cuisine: "Indonesian" },
  { name: "Satay", emoji: "\uD83C\uDF62", cuisine: "Indonesian" },
  { name: "Rendang", emoji: "\uD83E\uDD69", cuisine: "Indonesian" },
  { name: "Laksa", emoji: "\uD83C\uDF5C", cuisine: "Malaysian" },
  {
    name: "Hainanese Chicken Rice",
    emoji: "\uD83C\uDF57",
    cuisine: "Singaporean",
  },
  { name: "Adobo", emoji: "\uD83C\uDF57", cuisine: "Filipino" },
  { name: "Sinigang", emoji: "\uD83C\uDF72", cuisine: "Filipino" },

  // Georgian / Central Asian
  { name: "Khachapuri", emoji: "\uD83E\uDDC0", cuisine: "Georgian" },
  { name: "Khinkali", emoji: "\uD83E\uDD5F", cuisine: "Georgian" },
  { name: "Plov", emoji: "\uD83C\uDF5A", cuisine: "Central Asian" },
  { name: "Manti", emoji: "\uD83E\uDD5F", cuisine: "Turkish" },

  // Turkish
  { name: "Kebab", emoji: "\uD83C\uDF56", cuisine: "Turkish" },
  { name: "Lahmacun", emoji: "\uD83C\uDF55", cuisine: "Turkish" },
  { name: "Iskender Kebab", emoji: "\uD83E\uDD69", cuisine: "Turkish" },
  { name: "Pide", emoji: "\uD83C\uDF55", cuisine: "Turkish" },

  // British / Irish
  { name: "Fish and Chips", emoji: "\uD83C\uDF5F", cuisine: "British" },
  { name: "Shepherd\u2019s Pie", emoji: "\uD83E\uDD69", cuisine: "British" },
  { name: "Bangers and Mash", emoji: "\uD83C\uDF2D", cuisine: "British" },
  { name: "Beef Wellington", emoji: "\uD83E\uDD69", cuisine: "British" },
  { name: "Irish Stew", emoji: "\uD83C\uDF72", cuisine: "Irish" },
  { name: "Scones", emoji: "\uD83E\uDDC1", cuisine: "British" },

  // Eastern European
  { name: "Pierogi", emoji: "\uD83E\uDD5F", cuisine: "Polish" },
  { name: "Borscht", emoji: "\uD83C\uDF72", cuisine: "Ukrainian" },
  { name: "Stroganoff", emoji: "\uD83E\uDD69", cuisine: "Russian" },
  { name: "Goulash", emoji: "\uD83C\uDF72", cuisine: "Hungarian" },
  { name: "Schnitzel", emoji: "\uD83C\uDF56", cuisine: "Austrian" },
  {
    name: "Stuffed Cabbage Rolls",
    emoji: "\uD83E\uDD6C",
    cuisine: "Eastern European",
  },

  // Baking & Desserts
  {
    name: "Chocolate Chip Cookies",
    emoji: "\uD83C\uDF6A",
    cuisine: "American",
  },
  { name: "Banana Bread", emoji: "\uD83C\uDF5E", cuisine: "American" },
  { name: "Cinnamon Rolls", emoji: "\uD83C\uDF6E", cuisine: "Scandinavian" },
  { name: "Sourdough Bread", emoji: "\uD83C\uDF5E", cuisine: "American" },
  { name: "Macarons", emoji: "\uD83C\uDF6A", cuisine: "French" },
  { name: "Croissants", emoji: "\uD83E\uDD50", cuisine: "French" },
  { name: "Pavlova", emoji: "\uD83C\uDF53", cuisine: "Australian" },
  { name: "Mochi", emoji: "\uD83C\uDF61", cuisine: "Japanese" },
  { name: "Panna Cotta", emoji: "\uD83C\uDF6E", cuisine: "Italian" },
  {
    name: "Cr\u00E8me Br\u00FBl\u00E9e",
    emoji: "\uD83C\uDF6E",
    cuisine: "French",
  },

  // Breakfast
  { name: "Eggs Benedict", emoji: "\uD83C\uDF73", cuisine: "American" },
  { name: "Shakshuka", emoji: "\uD83C\uDF73", cuisine: "Middle Eastern" },
  { name: "French Toast", emoji: "\uD83C\uDF5E", cuisine: "French" },
  { name: "Pancakes", emoji: "\uD83E\uDD5E", cuisine: "American" },
  { name: "Acai Bowl", emoji: "\uD83C\uDFB6", cuisine: "Brazilian" },

  // Salads & Light
  { name: "Caesar Salad", emoji: "\uD83E\uDD57", cuisine: "American" },
  { name: "Nicoise Salad", emoji: "\uD83E\uDD57", cuisine: "French" },
  { name: "Poke Bowl", emoji: "\uD83C\uDF63", cuisine: "Hawaiian" },
  { name: "Grain Bowl", emoji: "\uD83C\uDF5A", cuisine: "American" },

  // Comfort Food
  { name: "Chicken Pot Pie", emoji: "\uD83E\uDD67", cuisine: "American" },
  { name: "Beef Stew", emoji: "\uD83C\uDF72", cuisine: "American" },
  { name: "Chili con Carne", emoji: "\uD83C\uDF36\uFE0F", cuisine: "American" },
  { name: "Grilled Cheese", emoji: "\uD83E\uDDC0", cuisine: "American" },
  { name: "Tomato Soup", emoji: "\uD83C\uDF72", cuisine: "American" },
  { name: "Chicken Noodle Soup", emoji: "\uD83C\uDF5C", cuisine: "American" },
  { name: "Meatloaf", emoji: "\uD83E\uDD69", cuisine: "American" },
];

/**
 * Search dishes by name. Returns matching entries sorted by relevance.
 * Case-insensitive, matches any substring.
 */
export function searchDishes(query: string, limit = 20): DishEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];

  const matches = DISH_CATALOGUE.filter((dish) =>
    dish.name.toLowerCase().includes(q),
  );

  // Sort: prefix matches first, then alphabetical
  matches.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
    const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return a.name.localeCompare(b.name);
  });

  return matches.slice(0, limit);
}

/** Get a random selection of dishes for quick-pick suggestions */
export function getQuickPicks(count = 5): DishEntry[] {
  const popular = [
    "Pad Thai",
    "Carbonara",
    "Birria Tacos",
    "Ramen",
    "Massaman Curry",
    "Butter Chicken",
    "Bibimbap",
    "Pho",
    "Shakshuka",
    "Paella",
  ];

  const picks = popular
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((name) => DISH_CATALOGUE.find((d) => d.name === name))
    .filter((d): d is DishEntry => d !== undefined);

  return picks;
}
