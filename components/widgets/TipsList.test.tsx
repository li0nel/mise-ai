import React from "react";
import { render, screen } from "@testing-library/react-native";
import { TipsList } from "./TipsList";
import type { TipsBlock } from "../../types";

const sampleData: TipsBlock["data"] = {
  tips: [
    {
      icon: "🥩",
      label: "Dry the beef",
      text: "Pat every piece of beef completely dry before browning.",
    },
    {
      icon: "🍷",
      label: "Use good wine",
      text: "If you wouldn't drink it, don't cook with it.",
    },
    {
      icon: "🔥",
      label: "Brown in batches",
      text: "Never crowd the pan.",
    },
  ],
};

describe("TipsList", () => {
  it("renders all tips", () => {
    render(<TipsList data={sampleData} />);

    expect(screen.getByText("Dry the beef")).toBeTruthy();
    expect(screen.getByText("Use good wine")).toBeTruthy();
    expect(screen.getByText("Brown in batches")).toBeTruthy();
  });

  it("renders tip descriptions", () => {
    render(<TipsList data={sampleData} />);

    expect(screen.getByText("Pat every piece of beef completely dry before browning.")).toBeTruthy();
    expect(screen.getByText("If you wouldn't drink it, don't cook with it.")).toBeTruthy();
    expect(screen.getByText("Never crowd the pan.")).toBeTruthy();
  });

  it("renders emoji icons", () => {
    render(<TipsList data={sampleData} />);

    expect(screen.getByText("🥩")).toBeTruthy();
    expect(screen.getByText("🍷")).toBeTruthy();
    expect(screen.getByText("🔥")).toBeTruthy();
  });

  it("renders a single tip", () => {
    const singleTip: TipsBlock["data"] = {
      tips: [
        { icon: "💡", label: "Pro tip", text: "Always taste as you go." },
      ],
    };

    render(<TipsList data={singleTip} />);

    expect(screen.getByText("Pro tip")).toBeTruthy();
    expect(screen.getByText("Always taste as you go.")).toBeTruthy();
  });
});
