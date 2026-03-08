import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ActionButton } from "./ActionButton";
import type { WidgetAction } from "../../types";

describe("ActionButton", () => {
  it("renders the action label", () => {
    const action: WidgetAction = {
      label: "Cook Now",
      type: "primary",
    };

    render(<ActionButton action={action} />);
    expect(screen.getByText("Cook Now")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const action: WidgetAction = {
      label: "Start",
      type: "primary",
    };
    const onPress = jest.fn();

    render(<ActionButton action={action} onPress={onPress} />);
    fireEvent.press(screen.getByText("Start"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows feedback text for direct action type after press", () => {
    const action: WidgetAction = {
      label: "Add to Shopping List",
      type: "primary",
      actionType: "direct",
      directAction: "add-to-shopping",
    };
    const onPress = jest.fn();

    render(<ActionButton action={action} onPress={onPress} />);
    fireEvent.press(screen.getByText("Add to Shopping List"));

    // After pressing a direct action, feedback should show
    expect(screen.getByText(/Added to shopping list/)).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not show feedback for chat action type", () => {
    const action: WidgetAction = {
      label: "View Recipe",
      type: "outline",
      actionType: "chat",
      chatMessage: "Show me the recipe",
    };
    const onPress = jest.fn();

    render(<ActionButton action={action} onPress={onPress} />);
    fireEvent.press(screen.getByText("View Recipe"));

    // Chat actions should not show feedback
    expect(screen.getByText("View Recipe")).toBeTruthy();
    expect(screen.queryByText(/Added to shopping list/)).toBeNull();
  });

  it("does not call onPress when disabled", () => {
    const action: WidgetAction = {
      label: "Disabled",
      type: "primary",
      disabled: true,
    };
    const onPress = jest.fn();

    render(<ActionButton action={action} onPress={onPress} />);
    fireEvent.press(screen.getByText("Disabled"));

    expect(onPress).not.toHaveBeenCalled();
  });
});
