import { useState, useCallback, useRef, useEffect } from "react";
import { Text, Pressable } from "react-native";
import type { WidgetAction } from "../../types";

interface ActionButtonProps {
  action: WidgetAction;
  onPress?: () => void;
  /** Additional className for the outer Pressable */
  className?: string;
}

/**
 * Reusable action button for widgets.
 * For direct actions, shows "Added!" feedback for 2 seconds after press.
 */
export function ActionButton({ action, onPress, className }: ActionButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePress = useCallback(() => {
    onPress?.();

    if (action.actionType === "direct") {
      setShowFeedback(true);
      timerRef.current = setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  }, [action.actionType, onPress]);

  const label = showFeedback ? "Added!" : action.label;

  const isPrimary = action.type === "primary";

  const baseClass = isPrimary
    ? "flex-1 items-center justify-center rounded-md bg-brand px-4 py-2.5"
    : "flex-1 items-center justify-center rounded-md border border-border bg-transparent px-4 py-2.5";

  const disabledClass = action.disabled ? " opacity-50" : "";
  const feedbackClass = showFeedback ? " bg-success" : "";

  const textClass = isPrimary || showFeedback
    ? "text-[13px] font-bold text-text-inv"
    : "text-[13px] font-semibold text-text";

  return (
    <Pressable
      onPress={handlePress}
      disabled={action.disabled || showFeedback}
      className={`${baseClass}${disabledClass}${isPrimary ? feedbackClass : ""}${className ? ` ${className}` : ""}`}
    >
      <Text className={textClass}>{label}</Text>
    </Pressable>
  );
}
