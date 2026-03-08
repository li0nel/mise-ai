import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { CookStep } from "./CookStep";
import type { CookStepBlock } from "../../types";

// Mock the chat store to prevent Firebase dependency issues
jest.mock("../../lib/stores/chatStore", () => ({
  useChatStore: {
    getState: jest.fn(() => ({
      sendMessage: jest.fn(),
    })),
  },
}));

const sampleData: CookStepBlock["data"] = {
  stepNumber: 2,
  totalSteps: 5,
  text: "Heat oil in a large skillet over medium-high heat.",
  timerPill: "5 min",
  progressPercent: 40,
  actions: [
    {
      label: "Next Step",
      type: "primary",
      actionType: "chat",
      chatMessage: "Show next step",
    },
    {
      label: "Previous",
      type: "outline",
      actionType: "chat",
      chatMessage: "Show previous step",
    },
  ],
};

describe("CookStep", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("displays the step number and total", () => {
    render(<CookStep data={sampleData} />);
    expect(screen.getByText("Step 2 of 5")).toBeTruthy();
  });

  it("displays the progress percentage", () => {
    render(<CookStep data={sampleData} />);
    expect(screen.getByText("40%")).toBeTruthy();
  });

  it("renders the instruction text", () => {
    render(<CookStep data={sampleData} />);
    expect(
      screen.getByText("Heat oil in a large skillet over medium-high heat."),
    ).toBeTruthy();
  });

  it("renders the timer pill when present", () => {
    render(<CookStep data={sampleData} />);
    expect(screen.getByText(/5 min/)).toBeTruthy();
  });

  it("renders action buttons", () => {
    render(<CookStep data={sampleData} />);
    expect(screen.getByText("Next Step")).toBeTruthy();
    expect(screen.getByText("Previous")).toBeTruthy();
  });

  it("does not render timer pill when absent", () => {
    const noTimerData: CookStepBlock["data"] = {
      stepNumber: 1,
      totalSteps: 3,
      text: "Chop the vegetables.",
      progressPercent: 33,
    };

    render(<CookStep data={noTimerData} />);
    expect(screen.getByText("Chop the vegetables.")).toBeTruthy();
    // No timer-related text should appear
    expect(screen.queryByText(/remaining/)).toBeNull();
  });

  it("does not render action buttons section when no actions", () => {
    const noActionsData: CookStepBlock["data"] = {
      stepNumber: 1,
      totalSteps: 1,
      text: "Serve and enjoy.",
      progressPercent: 100,
    };

    render(<CookStep data={noActionsData} />);
    expect(screen.getByText("Serve and enjoy.")).toBeTruthy();
    // No action buttons should be rendered
    expect(screen.queryByText("Next Step")).toBeNull();
  });

  it("starts the timer when timer pill is pressed", () => {
    jest.useFakeTimers();

    render(<CookStep data={sampleData} />);

    // Press the timer pill
    fireEvent.press(screen.getByText(/5 min/));

    // After pressing, it should show remaining time (5 min = 300 seconds => "5:00 remaining")
    expect(screen.getByText(/5:00 remaining/)).toBeTruthy();
  });

  it("renders rich text markup in instruction text", () => {
    const markupData: CookStepBlock["data"] = {
      stepNumber: 1,
      totalSteps: 3,
      text: '<b>Sear:</b> Heat <ingr>olive oil</ingr> for <timer duration="1 min">1 min</timer>.',
      progressPercent: 33,
    };

    render(<CookStep data={markupData} />);
    expect(screen.getByText("Sear:")).toBeTruthy();
    expect(screen.getByText("olive oil")).toBeTruthy();
    expect(screen.getByText(/1 min/)).toBeTruthy();
  });
});
