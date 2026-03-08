import { useState, useRef, useEffect, useCallback } from "react";
import { Text, Pressable } from "react-native";
import { parseRichText } from "../../lib/richText";
import { parseDurationToSeconds, formatRemaining } from "../../lib/duration";

interface RichStepTextProps {
  text: string;
  className?: string;
}

interface TimerState {
  status: "idle" | "running" | "done";
  remaining: number;
}

/**
 * Renders recipe instruction text with inline markup:
 *   <b>bold</b>, <ingr>ingredient</ingr>, <timer duration="5 min">5 min</timer>
 *
 * Plain text (no tags) renders identically to a plain <Text>.
 */
export function RichStepText({ text, className }: RichStepTextProps) {
  const segments = parseRichText(text);
  const [timers, setTimers] = useState<Record<number, TimerState>>({});
  const intervalsRef = useRef<Record<number, ReturnType<typeof setInterval>>>(
    {},
  );

  useEffect(() => {
    return () => {
      for (const id of Object.values(intervalsRef.current)) {
        clearInterval(id);
      }
    };
  }, []);

  const startTimer = useCallback((index: number, duration: string) => {
    const totalSeconds = parseDurationToSeconds(duration);
    if (totalSeconds <= 0) return;

    setTimers((prev) => ({
      ...prev,
      [index]: { status: "running", remaining: totalSeconds },
    }));

    intervalsRef.current[index] = setInterval(() => {
      setTimers((prev) => {
        const current = prev[index];
        if (!current || current.remaining <= 1) {
          clearInterval(intervalsRef.current[index]);
          delete intervalsRef.current[index];
          return { ...prev, [index]: { status: "done", remaining: 0 } };
        }
        return {
          ...prev,
          [index]: { ...current, remaining: current.remaining - 1 },
        };
      });
    }, 1000);
  }, []);

  // Fast path: single text segment means no markup — render plain
  if (segments.length === 1 && segments[0]?.type === "text") {
    return <Text className={className}>{segments[0].content}</Text>;
  }

  return (
    <Text className={className}>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case "text":
            return <Text key={i}>{seg.content}</Text>;
          case "bold":
            return (
              <Text key={i} className="font-bold">
                {seg.content}
              </Text>
            );
          case "ingredient":
            return (
              <Text
                key={i}
                className="font-semibold text-brand"
                style={{
                  backgroundColor: "#FCE9E2",
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                }}
              >
                {seg.content}
              </Text>
            );
          case "timer": {
            const state = timers[i];
            const isRunning = state?.status === "running";
            const isDone = state?.status === "done";
            const label = isRunning
              ? formatRemaining(state.remaining)
              : isDone
                ? "Done!"
                : seg.content;
            const pillBg = isDone ? "bg-success-bg" : "bg-warning-bg";
            const pillText = isDone
              ? "font-semibold text-success"
              : "font-semibold text-warning";

            return (
              <Pressable
                key={i}
                onPress={
                  !isRunning && !isDone
                    ? () => startTimer(i, seg.duration)
                    : undefined
                }
              >
                <Text className={`rounded-full px-1.5 ${pillBg} ${pillText}`}>
                  {"\u23F1"} {label}
                </Text>
              </Pressable>
            );
          }
        }
      })}
    </Text>
  );
}
