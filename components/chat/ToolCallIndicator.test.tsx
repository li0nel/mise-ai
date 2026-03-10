import React from "react";
import { render, screen } from "@testing-library/react-native";
import { ToolCallIndicator } from "./ToolCallIndicator";
import { useRecipeStore } from "../../lib/stores/recipeStore";

describe("ToolCallIndicator", () => {
  it("shows search description with query", () => {
    render(
      <ToolCallIndicator name="searchMyRecipes" args={{ query: "chicken" }} />,
    );
    expect(screen.getByText("Searching your chicken recipes...")).toBeTruthy();
  });

  it("shows generic search description without query", () => {
    render(<ToolCallIndicator name="searchMyRecipes" args={{}} />);
    expect(screen.getByText("Searching your recipes...")).toBeTruthy();
  });

  it("shows list description", () => {
    render(<ToolCallIndicator name="listMyRecipes" args={{}} />);
    expect(screen.getByText("Looking through your recipes...")).toBeTruthy();
  });

  it("shows recipe title for getMyRecipe when recipe exists in store", () => {
    useRecipeStore.setState({
      recipes: [
        {
          id: "abc",
          title: "Massaman Curry",
          emoji: "\u{1F35B}",
          cuisines: ["Thai"],
          prepTime: 20,
          cookTime: 100,
          servings: 4,
          difficulty: 3,
          ingredientSections: [],
          instructions: [],
        },
      ],
    });

    render(<ToolCallIndicator name="getMyRecipe" args={{ recipeId: "abc" }} />);
    expect(
      screen.getByText("Retrieving your Massaman Curry recipe..."),
    ).toBeTruthy();
  });

  it("shows generic description for getMyRecipe when recipe not in store", () => {
    useRecipeStore.setState({ recipes: [] });
    render(
      <ToolCallIndicator name="getMyRecipe" args={{ recipeId: "unknown" }} />,
    );
    expect(screen.getByText("Retrieving your recipe...")).toBeTruthy();
  });

  it("shows fallback for unknown tool", () => {
    render(<ToolCallIndicator name="unknownTool" args={{}} />);
    expect(screen.getByText("Working...")).toBeTruthy();
  });
});
