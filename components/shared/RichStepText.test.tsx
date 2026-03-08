import React from "react";
import { render, screen } from "@testing-library/react-native";
import { RichStepText } from "./RichStepText";

describe("RichStepText", () => {
  it("renders plain text without markup", () => {
    render(<RichStepText text="Heat oil in a pan." />);
    expect(screen.getByText("Heat oil in a pan.")).toBeTruthy();
  });

  it("renders bold text", () => {
    render(<RichStepText text="<b>Make the paste:</b> First step." />);
    expect(screen.getByText("Make the paste:")).toBeTruthy();
    expect(screen.getByText(" First step.")).toBeTruthy();
  });

  it("renders ingredient highlights", () => {
    render(<RichStepText text="Add <ingr>garlic</ingr> to the pan." />);
    expect(screen.getByText("garlic")).toBeTruthy();
    expect(screen.getByText("Add ")).toBeTruthy();
    expect(screen.getByText(" to the pan.")).toBeTruthy();
  });

  it("renders timer pills", () => {
    render(
      <RichStepText text='Toast for <timer duration="2 min">2 min</timer>.' />,
    );
    expect(screen.getByText(/2 min/)).toBeTruthy();
  });

  it("renders mixed content with all tag types", () => {
    render(
      <RichStepText text='<b>Sear:</b> Heat <ingr>oil</ingr> for <timer duration="1 min">1 min</timer>.' />,
    );
    expect(screen.getByText("Sear:")).toBeTruthy();
    expect(screen.getByText("oil")).toBeTruthy();
    expect(screen.getByText(/1 min/)).toBeTruthy();
  });

  it("passes className to root Text", () => {
    render(<RichStepText text="Plain text" className="text-base text-text" />);
    expect(screen.getByText("Plain text")).toBeTruthy();
  });
});
