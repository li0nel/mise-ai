import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ServingsStepper } from "./ServingsStepper";

describe("ServingsStepper", () => {
  it("displays the current serving count", () => {
    render(<ServingsStepper servings={4} onServingsChange={jest.fn()} />);
    expect(screen.getByText("4 servings")).toBeTruthy();
  });

  it("displays singular 'serving' for count of 1", () => {
    render(<ServingsStepper servings={1} onServingsChange={jest.fn()} />);
    expect(screen.getByText("1 serving")).toBeTruthy();
  });

  it("increments servings when plus button is pressed", () => {
    const onChange = jest.fn();
    render(<ServingsStepper servings={4} onServingsChange={onChange} />);

    fireEvent.press(screen.getByText("+"));

    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("decrements servings when minus button is pressed", () => {
    const onChange = jest.fn();
    render(<ServingsStepper servings={4} onServingsChange={onChange} />);

    // The minus sign is unicode \u2212
    fireEvent.press(screen.getByText("\u2212"));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("does not go below 1 serving", () => {
    const onChange = jest.fn();
    render(<ServingsStepper servings={1} onServingsChange={onChange} />);

    fireEvent.press(screen.getByText("\u2212"));

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("does not go above 20 servings", () => {
    const onChange = jest.fn();
    render(<ServingsStepper servings={20} onServingsChange={onChange} />);

    fireEvent.press(screen.getByText("+"));

    expect(onChange).toHaveBeenCalledWith(20);
  });
});
