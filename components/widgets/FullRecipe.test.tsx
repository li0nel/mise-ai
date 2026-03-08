import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { FullRecipe } from "./FullRecipe";
import type { FullRecipeBlock } from "../../types";

const mockAddRecipe = jest.fn();
jest.mock("../../lib/stores/recipeStore", () => ({
  useRecipeStore: {
    getState: jest.fn(() => ({
      addRecipe: mockAddRecipe,
    })),
  },
}));

const sampleData: FullRecipeBlock["data"] = {
  id: "classic-potato-puree",
  title: "Classic Potato Puree",
  emoji: "🥔",
  time: "30 min",
  servings: 4,
  cuisine: "French",
  description: "Silky smooth mashed potatoes.",
  ingredients: {
    items: [
      { amount: "1", unit: "kg", name: "Potatoes" },
      { amount: "100", unit: "g", name: "Butter" },
    ],
  },
  steps: [
    {
      stepNumber: 1,
      title: "Boil potatoes",
      text: "Peel and boil for 20 min.",
      timerPill: "20 min",
    },
    {
      stepNumber: 2,
      title: "Mash",
      text: "Mash with butter.",
      tips: "Use a ricer for best texture.",
    },
  ],
};

describe("FullRecipe", () => {
  beforeEach(() => {
    mockAddRecipe.mockClear();
  });

  it("renders recipe header", () => {
    render(<FullRecipe data={sampleData} />);
    expect(screen.getByText("Classic Potato Puree")).toBeTruthy();
    expect(screen.getByText("30 min")).toBeTruthy();
    expect(screen.getByText("4 servings")).toBeTruthy();
    expect(screen.getByText("French")).toBeTruthy();
  });

  it("renders ingredients", () => {
    render(<FullRecipe data={sampleData} />);
    expect(screen.getByText("Ingredients")).toBeTruthy();
    expect(screen.getByText("Potatoes")).toBeTruthy();
    expect(screen.getByText("Butter")).toBeTruthy();
  });

  it("renders steps", () => {
    render(<FullRecipe data={sampleData} />);
    expect(screen.getByText("Steps")).toBeTruthy();
    expect(screen.getByText("Boil potatoes")).toBeTruthy();
    expect(screen.getByText("Mash")).toBeTruthy();
  });

  it("renders save button and shows feedback on press", () => {
    render(<FullRecipe data={sampleData} />);
    const saveButton = screen.getByText("Save to My Recipes");
    expect(saveButton).toBeTruthy();

    fireEvent.press(saveButton);
    expect(mockAddRecipe).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Saved to My Recipes/)).toBeTruthy();
  });
});
