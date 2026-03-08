import React from "react";
import { render, screen } from "@testing-library/react-native";
import { CookMode } from "./CookMode";
import type { CookModeBlock } from "../../types";

const sampleData: CookModeBlock["data"] = {
  totalSteps: 3,
  steps: [
    {
      stepNumber: 1,
      title: "Prep ingredients",
      text: "Chop onions and mince garlic.",
      timerPill: "5 min",
    },
    {
      stepNumber: 2,
      title: "Cook the base",
      text: "Heat oil and saute onions until golden.",
      tips: "Low heat prevents burning.",
      warnings: [{ icon: "⚠️", text: "Hot oil may splatter." }],
    },
    {
      stepNumber: 3,
      title: "Simmer",
      text: "Add broth and simmer for 20 minutes.",
    },
  ],
};

describe("CookMode", () => {
  it("renders the Cook Mode header", () => {
    render(<CookMode data={sampleData} />);
    expect(screen.getByText("Cook Mode")).toBeTruthy();
  });

  it("displays the total step count in the header", () => {
    render(<CookMode data={sampleData} />);
    expect(screen.getByText("3 steps")).toBeTruthy();
  });

  it("renders all step numbers", () => {
    render(<CookMode data={sampleData} />);
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("renders all step titles", () => {
    render(<CookMode data={sampleData} />);
    expect(screen.getByText("Prep ingredients")).toBeTruthy();
    expect(screen.getByText("Cook the base")).toBeTruthy();
    expect(screen.getByText("Simmer")).toBeTruthy();
  });

  it("renders step text content", () => {
    render(<CookMode data={sampleData} />);
    expect(screen.getByText("Chop onions and mince garlic.")).toBeTruthy();
    expect(screen.getByText("Heat oil and saute onions until golden.")).toBeTruthy();
    expect(screen.getByText("Add broth and simmer for 20 minutes.")).toBeTruthy();
  });

  it("renders timer pill when present", () => {
    render(<CookMode data={sampleData} />);
    // Timer pill has stopwatch emoji prefix
    expect(screen.getByText(/5 min/)).toBeTruthy();
  });

  it("does not render timer pill when absent", () => {
    const dataWithoutTimers: CookModeBlock["data"] = {
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: "Step", text: "Do something." },
      ],
    };
    render(<CookMode data={dataWithoutTimers} />);
    // Should not have any timer-related content
    const timerElements = screen.queryAllByText(/remaining/);
    expect(timerElements).toHaveLength(0);
  });

  it("renders tips when present", () => {
    render(<CookMode data={sampleData} />);
    expect(screen.getByText("Low heat prevents burning.")).toBeTruthy();
  });

  it("renders warnings when present", () => {
    render(<CookMode data={sampleData} />);
    expect(screen.getByText("Hot oil may splatter.")).toBeTruthy();
    expect(screen.getByText("⚠️")).toBeTruthy();
  });
});
