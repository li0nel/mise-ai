import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { IngredientsWidget } from "./IngredientsWidget";
import type { IngredientsBlock } from "../../types";

// Mock stores to prevent Firebase dependency issues
jest.mock("../../lib/stores/chatStore", () => ({
  useChatStore: {
    getState: jest.fn(() => ({
      sendMessage: jest.fn(),
    })),
  },
}));

const mockAddItems = jest.fn();
jest.mock("../../lib/stores/shoppingStore", () => ({
  useShoppingStore: {
    getState: jest.fn(() => ({
      addItems: mockAddItems,
    })),
  },
}));

const sampleData: IngredientsBlock["data"] = {
  recipeTitle: "Boeuf Bourguignon",
  servings: 6,
  totalItems: 3,
  items: [
    { amount: "2", unit: "cups", name: "Flour" },
    { amount: "1", unit: "tsp", name: "Salt" },
    { amount: "3", name: "Eggs", notes: "large" },
  ],
};

describe("IngredientsWidget", () => {
  beforeEach(() => {
    mockAddItems.mockClear();
  });

  it("renders the ingredients header", () => {
    render(<IngredientsWidget data={sampleData} />);
    expect(screen.getByText(/Ingredients/)).toBeTruthy();
  });

  it("displays servings and item count", () => {
    render(<IngredientsWidget data={sampleData} />);
    // "6 servings" appears in both the header subtitle and the servings pill,
    // so we use getAllByText to verify it is rendered
    expect(screen.getAllByText(/6 servings/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/3 items/)).toBeTruthy();
  });

  it("renders all ingredient names", () => {
    render(<IngredientsWidget data={sampleData} />);
    expect(screen.getByText("Flour")).toBeTruthy();
    expect(screen.getByText("Salt")).toBeTruthy();
    expect(screen.getByText("Eggs")).toBeTruthy();
  });

  it("renders ingredient amounts and units", () => {
    render(<IngredientsWidget data={sampleData} />);
    expect(screen.getByText("2 cups")).toBeTruthy();
    expect(screen.getByText("1 tsp")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("renders ingredient notes when present", () => {
    render(<IngredientsWidget data={sampleData} />);
    expect(screen.getByText("large")).toBeTruthy();
  });

  it("toggles ingredient checkbox on press", () => {
    render(<IngredientsWidget data={sampleData} />);

    // Find and press the Flour item (accessible as checkbox)
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(3);

    // Initially unchecked
    expect(checkboxes[0]).toHaveProp("accessibilityState", { checked: false });

    // Press to check
    fireEvent.press(checkboxes[0]!);

    // Now it should be checked
    const updatedCheckboxes = screen.getAllByRole("checkbox");
    expect(updatedCheckboxes[0]).toHaveProp("accessibilityState", { checked: true });
  });

  it("renders action buttons when present", () => {
    const dataWithActions: IngredientsBlock["data"] = {
      ...sampleData,
      actions: [
        {
          label: "Add All to Shopping List",
          type: "primary",
          actionType: "direct",
          directAction: "add-to-shopping",
        },
      ],
    };

    render(<IngredientsWidget data={dataWithActions} />);
    expect(screen.getByText("Add All to Shopping List")).toBeTruthy();
  });

  it("calls addItems on shopping store when add-to-shopping action is pressed", () => {
    const dataWithActions: IngredientsBlock["data"] = {
      ...sampleData,
      actions: [
        {
          label: "Add All to Shopping List",
          type: "primary",
          actionType: "direct",
          directAction: "add-to-shopping",
        },
      ],
    };

    render(<IngredientsWidget data={dataWithActions} />);
    fireEvent.press(screen.getByText("Add All to Shopping List"));

    expect(mockAddItems).toHaveBeenCalledTimes(1);
    const addedItems = mockAddItems.mock.calls[0]?.[0];
    expect(addedItems).toHaveLength(3);
    expect(addedItems[0].name).toBe("Flour");
    expect(addedItems[0].amount).toBe("2");
    expect(addedItems[0].unit).toBe("cups");
    expect(addedItems[0].recipeName).toBe("Boeuf Bourguignon");
    expect(addedItems[0].checked).toBe(false);
  });

  it("renders section headers when present", () => {
    const dataWithSections: IngredientsBlock["data"] = {
      ...sampleData,
      sections: [{ name: "Main" }, { name: "Garnish" }],
    };

    render(<IngredientsWidget data={dataWithSections} />);
    expect(screen.getByText("Main")).toBeTruthy();
    expect(screen.getByText("Garnish")).toBeTruthy();
  });

  it("does not render action buttons when none present", () => {
    render(<IngredientsWidget data={sampleData} />);
    expect(screen.queryByText("Add All to Shopping List")).toBeNull();
  });
});
