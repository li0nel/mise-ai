import React from "react";
import { render, screen } from "@testing-library/react-native";
import { RescueWidget } from "./RescueWidget";
import type { RescueBlock } from "../../types";

const sampleData: RescueBlock["data"] = {
  icon: "🍷",
  title: "Sauce Recovery — Reduction Finish",
  steps: [
    { number: 1, text: "Remove beef with a slotted spoon and keep warm." },
    { number: 2, text: "Rapid boil the sauce uncovered for 12-15 minutes." },
    { number: 3, text: "Taste and adjust with salt and pepper." },
    { number: 4, text: "Finish with cold butter for glossy texture." },
  ],
};

describe("RescueWidget", () => {
  it("renders the rescue title", () => {
    render(<RescueWidget data={sampleData} />);
    expect(screen.getByText("Sauce Recovery — Reduction Finish")).toBeTruthy();
  });

  it("renders the icon", () => {
    render(<RescueWidget data={sampleData} />);
    expect(screen.getByText("🍷")).toBeTruthy();
  });

  it("renders all numbered steps", () => {
    render(<RescueWidget data={sampleData} />);

    // Step numbers
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
  });

  it("renders step text content", () => {
    render(<RescueWidget data={sampleData} />);

    expect(screen.getByText("Remove beef with a slotted spoon and keep warm.")).toBeTruthy();
    expect(screen.getByText("Rapid boil the sauce uncovered for 12-15 minutes.")).toBeTruthy();
    expect(screen.getByText("Taste and adjust with salt and pepper.")).toBeTruthy();
    expect(screen.getByText("Finish with cold butter for glossy texture.")).toBeTruthy();
  });

  it("renders a single step rescue", () => {
    const singleStepData: RescueBlock["data"] = {
      icon: "⚠️",
      title: "Quick Fix",
      steps: [{ number: 1, text: "Add more salt to balance the flavor." }],
    };

    render(<RescueWidget data={singleStepData} />);

    expect(screen.getByText("Quick Fix")).toBeTruthy();
    expect(screen.getByText("Add more salt to balance the flavor.")).toBeTruthy();
  });
});
