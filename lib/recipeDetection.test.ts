import { detectRecipeContent } from "./recipeDetection";

describe("detectRecipeContent", () => {
  it('returns type "url" when text contains a URL', () => {
    const result = detectRecipeContent("https://www.allrecipes.com/recipe/12345");
    expect(result.type).toBe("url");
    expect(result.urls).toBeDefined();
    expect(result.urls?.length).toBeGreaterThan(0);
  });

  it("extracts all URLs from text", () => {
    const result = detectRecipeContent(
      "Check https://example.com/recipe1 and http://example.com/recipe2"
    );
    expect(result.type).toBe("url");
    expect(result.urls).toHaveLength(2);
  });

  it('returns type "text" for long text with recipe patterns', () => {
    const recipeText = `
      Classic Pancakes

      Ingredients:
      2 cups all-purpose flour
      2 tablespoons sugar
      1 teaspoon baking powder
      1/2 teaspoon salt
      2 large eggs
      1.5 cups milk
      3 tablespoons melted butter

      Instructions:
      1. Whisk dry ingredients in a large bowl.
      2. Mix wet ingredients separately.
      3. Combine and stir until just combined.
      4. Heat a skillet and cook pancakes until bubbles form.
      5. Serve with maple syrup.
    `;
    const result = detectRecipeContent(recipeText);
    expect(result.type).toBe("text");
    expect(result.urls).toBeUndefined();
  });

  it('returns type "none" for a short plain text message', () => {
    const result = detectRecipeContent("What's for dinner tonight?");
    expect(result.type).toBe("none");
    expect(result.urls).toBeUndefined();
  });

  it('returns type "none" for empty string', () => {
    const result = detectRecipeContent("");
    expect(result.type).toBe("none");
  });

  it("prioritizes URL detection over recipe text detection", () => {
    // A URL in recipe-like text should be detected as URL
    const text =
      "Check this recipe https://example.com/recipe " +
      "A".repeat(200) +
      " 2 cups flour and mix together then bake";
    const result = detectRecipeContent(text);
    expect(result.type).toBe("url");
  });
});
