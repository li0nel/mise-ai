import React from "react";
import { render, screen } from "@testing-library/react-native";
import { BlockRenderer } from "./BlockRenderer";
import type { Block } from "../../types";

// Mock expo-router to prevent navigation errors
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the chat store — use module-level refs so assertions are possible
const mockSendMessage = jest.fn();
jest.mock("../../lib/stores/chatStore", () => ({
  useChatStore: {
    getState: jest.fn(() => ({
      sendMessage: mockSendMessage,
    })),
  },
}));

// Mock the shopping store
const mockAddItems = jest.fn();
jest.mock("../../lib/stores/shoppingStore", () => ({
  useShoppingStore: {
    getState: jest.fn(() => ({
      addItems: mockAddItems,
    })),
  },
}));

describe("BlockRenderer", () => {
  it("renders a tips block", () => {
    const block: Block = {
      type: "tips",
      data: {
        tips: [
          { icon: "💡", label: "Quick Tip", text: "Always preheat your oven." },
        ],
      },
    };

    render(<BlockRenderer block={block} />);
    expect(screen.getByText("Quick Tip")).toBeTruthy();
    expect(screen.getByText("Always preheat your oven.")).toBeTruthy();
  });

  it("renders a rescue block", () => {
    const block: Block = {
      type: "rescue",
      data: {
        icon: "⚠️",
        title: "Too Salty",
        steps: [
          { number: 1, text: "Add a potato to absorb salt." },
          { number: 2, text: "Add more liquid to dilute." },
        ],
      },
    };

    render(<BlockRenderer block={block} />);
    expect(screen.getByText("Too Salty")).toBeTruthy();
    expect(screen.getByText("Add a potato to absorb salt.")).toBeTruthy();
  });

  it("renders a cook-mode block", () => {
    const block: Block = {
      type: "cook-mode",
      data: {
        totalSteps: 2,
        steps: [
          { stepNumber: 1, title: "Prep", text: "Chop vegetables." },
          { stepNumber: 2, title: "Cook", text: "Heat and stir." },
        ],
      },
    };

    render(<BlockRenderer block={block} />);
    expect(screen.getByText("Cook Mode")).toBeTruthy();
    expect(screen.getByText("Prep")).toBeTruthy();
    expect(screen.getByText("Cook")).toBeTruthy();
  });

  it("renders a cook-step block", () => {
    const block: Block = {
      type: "cook-step",
      data: {
        stepNumber: 1,
        totalSteps: 3,
        text: "Boil water in a large pot.",
        progressPercent: 33,
      },
    };

    render(<BlockRenderer block={block} />);
    expect(screen.getByText("Step 1 of 3")).toBeTruthy();
    expect(screen.getByText("Boil water in a large pot.")).toBeTruthy();
    expect(screen.getByText("33%")).toBeTruthy();
  });

  it("renders a recipe-card block", () => {
    const block: Block = {
      type: "recipe-card",
      data: {
        id: "test-recipe",
        title: "Test Pasta",
        emoji: "🍝",
        rating: 4,
        time: "30 min",
        servings: 4,
        cuisine: "Italian",
        description: "A simple pasta dish.",
        actions: [
          { label: "Cook Now", type: "primary" },
        ],
      },
    };

    render(<BlockRenderer block={block} />);
    expect(screen.getByText("Test Pasta")).toBeTruthy();
    expect(screen.getByText("A simple pasta dish.")).toBeTruthy();
    expect(screen.getByText("Cook Now")).toBeTruthy();
  });

  it("renders an ingredients block", () => {
    const block: Block = {
      type: "ingredients",
      data: {
        recipeTitle: "Test Recipe",
        servings: 4,
        totalItems: 2,
        items: [
          { amount: "2", unit: "cups", name: "Flour" },
          { amount: "1", unit: "tsp", name: "Salt" },
        ],
      },
    };

    render(<BlockRenderer block={block} />);
    expect(screen.getByText("Flour")).toBeTruthy();
    expect(screen.getByText("Salt")).toBeTruthy();
  });
});
