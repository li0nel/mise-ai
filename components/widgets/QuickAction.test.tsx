import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { QuickAction } from "./QuickAction";
import type { QuickActionBlock } from "../../types";

const mockSendMessage = jest.fn();
jest.mock("../../lib/stores/chatStore", () => ({
  useChatStore: {
    getState: jest.fn(() => ({
      sendMessage: mockSendMessage,
    })),
  },
}));

describe("QuickAction", () => {
  beforeEach(() => {
    mockSendMessage.mockClear();
  });

  it("renders label and arrow", () => {
    const data: QuickActionBlock["data"] = {
      label: "Show me a variation",
      actionType: "chat",
      chatMessage: "Show me a variation",
    };
    render(<QuickAction data={data} />);
    expect(screen.getByText("Show me a variation")).toBeTruthy();
    expect(screen.getByText("\u2192")).toBeTruthy();
  });

  it("renders icon when provided", () => {
    const data: QuickActionBlock["data"] = {
      label: "Wine pairing",
      icon: "🍷",
      actionType: "chat",
      chatMessage: "What wine pairs best?",
    };
    render(<QuickAction data={data} />);
    expect(screen.getByText("🍷")).toBeTruthy();
  });

  it("sends chat message on press for chat action", () => {
    const data: QuickActionBlock["data"] = {
      label: "Show me a variation",
      actionType: "chat",
      chatMessage: "Show me a lactose-free version",
    };
    render(<QuickAction data={data} />);
    fireEvent.press(screen.getByText("Show me a variation"));
    expect(mockSendMessage).toHaveBeenCalledWith(
      "Show me a lactose-free version",
    );
  });

  it("shows feedback for direct action", () => {
    const data: QuickActionBlock["data"] = {
      label: "Add to shopping list",
      actionType: "direct",
      directAction: "add-to-shopping",
    };
    render(<QuickAction data={data} />);
    fireEvent.press(screen.getByText("Add to shopping list"));
    expect(screen.getByText(/Done/)).toBeTruthy();
  });
});
