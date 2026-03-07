import { View, Text, Pressable } from "react-native";
import type { CookStepBlock } from "../../types";

interface CookStepProps {
  data: CookStepBlock["data"];
}

export function CookStep({ data }: CookStepProps) {
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
        <Text className="mb-3 text-base leading-relaxed text-text">
          {data.text}
        </Text>

        {/* Timer pill */}
        {data.timerPill ? (
          <View className="mb-3 self-start rounded-full bg-warning-bg px-2 py-[3px]">
            <Text className="text-[11px] font-semibold text-warning">
              {"\u23F1"} {data.timerPill}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Action buttons */}
      {data.actions && data.actions.length > 0 ? (
        <View className="flex-row gap-2 px-4 pb-4">
          {data.actions.map((action) => {
            if (action.type === "primary") {
              return (
                <Pressable
                  key={action.label}
                  disabled={action.disabled}
                  className={`flex-1 items-center justify-center rounded-md bg-brand px-4 py-2.5 ${action.disabled ? "opacity-50" : ""}`}
                >
                  <Text className="text-[13px] font-bold text-text-inv">
                    {action.label}
                  </Text>
                </Pressable>
              );
            }
            return (
              <Pressable
                key={action.label}
                disabled={action.disabled}
                className={`flex-1 items-center justify-center rounded-md border border-border bg-transparent px-4 py-2.5 ${action.disabled ? "opacity-50" : ""}`}
              >
                <Text className="text-[13px] font-semibold text-text">
                  {action.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
