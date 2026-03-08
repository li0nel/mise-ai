import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ShoppingProgress } from "./ShoppingProgress";

describe("ShoppingProgress", () => {
  it("displays the checked and total counts", () => {
    render(
      <ShoppingProgress
        checkedCount={3}
        totalCount={10}
        sortMode="aisle"
        onSortChange={jest.fn()}
      />
    );

    expect(screen.getByText(/3 of 10 items/)).toBeTruthy();
  });

  it("displays sort toggle buttons", () => {
    render(
      <ShoppingProgress
        checkedCount={0}
        totalCount={5}
        sortMode="aisle"
        onSortChange={jest.fn()}
      />
    );

    expect(screen.getByText("By Recipe")).toBeTruthy();
    expect(screen.getByText("By Aisle")).toBeTruthy();
  });

  it("calls onSortChange with 'recipe' when By Recipe is pressed", () => {
    const onSortChange = jest.fn();
    render(
      <ShoppingProgress
        checkedCount={0}
        totalCount={5}
        sortMode="aisle"
        onSortChange={onSortChange}
      />
    );

    fireEvent.press(screen.getByText("By Recipe"));
    expect(onSortChange).toHaveBeenCalledWith("recipe");
  });

  it("calls onSortChange with 'aisle' when By Aisle is pressed", () => {
    const onSortChange = jest.fn();
    render(
      <ShoppingProgress
        checkedCount={0}
        totalCount={5}
        sortMode="recipe"
        onSortChange={onSortChange}
      />
    );

    fireEvent.press(screen.getByText("By Aisle"));
    expect(onSortChange).toHaveBeenCalledWith("aisle");
  });

  it("handles zero total count without division errors", () => {
    render(
      <ShoppingProgress
        checkedCount={0}
        totalCount={0}
        sortMode="aisle"
        onSortChange={jest.fn()}
      />
    );

    expect(screen.getByText(/0 of 0 items/)).toBeTruthy();
  });

  it("handles all items checked", () => {
    render(
      <ShoppingProgress
        checkedCount={5}
        totalCount={5}
        sortMode="aisle"
        onSortChange={jest.fn()}
      />
    );

    expect(screen.getByText(/5 of 5 items/)).toBeTruthy();
  });
});
