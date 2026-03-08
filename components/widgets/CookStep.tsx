import { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import type { CookStepBlock, WidgetAction } from "../../types";
import { ActionButton } from "./ActionButton";
import { useChatStore } from "../../lib/stores/chatStore";
import { parseDurationToSeconds, formatRemaining } from "../../lib/duration";
import { RichStepText } from "../shared/RichStepText";

interface CookStepProps {
  data: CookStepBlock["data"];
}

export function CookStep({ data }: CookStepProps) {
  const [timerState, setTimerState] = useState<"idle" | "running" | "done">(
    "idle",
  );
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = useCallback(() => {
    if (!data.timerPill) return;
    const totalSeconds = parseDurationToSeconds(data.timerPill);
    if (totalSeconds <= 0) return;

    setRemaining(totalSeconds);
    setTimerState("running");

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimerState("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [data.timerPill]);

  const handleAction = useCallback((action: WidgetAction) => {
    if (action.actionType === "chat") {
      useChatStore.getState().sendMessage(action.chatMessage ?? action.label);
    }
  }, []);

  const timerPillText =
    timerState === "running"
      ? formatRemaining(remaining)
      : timerState === "done"
        ? "Timer done!"
        : data.timerPill;

  const timerPillBgClass =
    timerState === "done" ? "bg-success-bg" : "bg-warning-bg";

  const timerPillTextClass =
    timerState === "done"
      ? "text-[11px] font-semibold text-success"
      : "text-[11px] font-semibold text-warning";

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-surface shadow-sm">
      {/* Header bar with brand background */}
      <View className="flex-row items-center justify-between bg-brand px-4 py-3">
        <Text className="text-[11px] font-medium text-white/75">
          Step {data.stepNumber} of {data.totalSteps}
        </Text>
        <Text className="text-[13px] font-bold text-white">
          {data.progressPercent}%
        </Text>
      </View>

      {/* Progress bar */}
      <View className="mx-4 mt-1 h-[3px] overflow-hidden rounded-full bg-border">
        <View
          className="h-full rounded-full bg-brand"
          style={{ width: `${data.progressPercent}%` }}
        />
      </View>

      {/* Body */}
      <View className="px-4 pb-3.5 pt-4">
        <RichStepText
          text={data.text}
          className="mb-3 text-base leading-relaxed text-text"
        />

        {/* Timer pill */}
        {data.timerPill ? (
          <Pressable
            onPress={timerState === "idle" ? startTimer : undefined}
            className={`mb-3 self-start rounded-full px-2 py-[3px] ${timerPillBgClass}`}
          >
            <Text className={timerPillTextClass}>
              {"\u23F1"} {timerPillText}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Action buttons */}
      {data.actions && data.actions.length > 0 ? (
        <View className="flex-row gap-2 px-4 pb-4">
          {data.actions.map((action) => (
            <ActionButton
              key={action.label}
              action={action}
              onPress={() => handleAction(action)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
