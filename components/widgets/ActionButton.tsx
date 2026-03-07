import { useState, useCallback } from "react";
import { Text, Pressable, View } from "react-native";
import type { WidgetAction } from "../../types";

interface ActionButtonProps {
  action: WidgetAction;
  onPress?: () => void;
  /** Additional className for the outer Pressable */
  className?: string;
}

/**
 * Reusable action button for widgets.
 * For direct actions, permanently shows "Added to shopping list" after press.
 */
export function ActionButton({ action, onPress, className }: ActionButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  const handlePress = useCallback(() => {
    onPress?.();

    if (action.actionType === "direct") {
      setShowFeedback(true);
    }
  }, [action.actionType, onPress]);

  if (showFeedback) {
    return (
      <View className={`flex-1 items-center justify-center px-4 py-2.5${className ? ` ${className}` : ""}`}>
        <Text className="text-[13px] font-semibold text-text-2">{"\u2713"} Added to shopping list</Text>
      </View>
    );
  }

  const isPrimary = action.type === "primary";

  const baseClass = isPrimary
    ? "flex-1 items-center justify-center rounded-md bg-brand px-4 py-2.5"
    : "flex-1 items-center justify-center rounded-md border border-border bg-transparent px-4 py-2.5";

  const disabledClass = action.disabled ? " opacity-50" : "";

  const textClass = isPrimary
    ? "text-[13px] font-bold text-text-inv"
    : "text-[13px] font-semibold text-text";

  return (
    <Pressable
      onPress={handlePress}
      disabled={action.disabled}
      className={`${baseClass}${disabledClass}${className ? ` ${className}` : ""}`}
    >
      <Text className={textClass}>{action.label}</Text>
    </Pressable>
  );
}
