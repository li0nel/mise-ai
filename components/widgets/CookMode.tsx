import { View, Text } from "react-native";
import type { CookModeBlock } from "../../types";

interface CookModeProps {
  data: CookModeBlock["data"];
}

export function CookMode({ data }: CookModeProps) {
  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-surface">
      {/* Header bar */}
      <View className="flex-row items-center justify-between border-b border-border bg-bg-elevated px-3.5 py-[11px]">
        <Text className="text-[11px] font-bold uppercase tracking-wider text-brand">
          Cook Mode
        </Text>
        <Text className="text-[11px] text-text-3">
          {data.totalSteps} steps
        </Text>
      </View>

      {/* Steps */}
      {data.steps.map((step, index) => {
        const isLast = index === data.steps.length - 1;
        return (
          <View
            key={step.stepNumber}
            className={`px-3.5 py-[13px] ${isLast ? "" : "border-b border-border"}`}
          >
            {/* Step number + title row */}
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-brand">
                <Text className="text-[11px] font-bold text-white">
                  {step.stepNumber}
                </Text>
              </View>
              <Text className="text-[13px] font-semibold text-text">
                {step.title}
              </Text>
            </View>

            {/* Step text */}
            <Text className="text-[13px] leading-relaxed text-text">
              {step.text}
            </Text>

            {/* Timer pill */}
            {step.timerPill ? (
              <View className="mt-2 self-start rounded-full bg-warning-bg px-2 py-[3px]">
                <Text className="text-[11px] font-semibold text-warning">
                  {"\u23F1"} {step.timerPill}
                </Text>
              </View>
            ) : null}

            {/* Tips hint */}
            {step.tips ? (
              <View className="mt-2.5 flex-row items-start gap-2 rounded-lg bg-bg-elevated p-[11px]">
                <Text className="text-[13px]">{"\uD83D\uDCA1"}</Text>
                <Text className="flex-1 text-[13px] leading-snug text-text-2">
                  {step.tips}
                </Text>
              </View>
            ) : null}

            {/* Warnings */}
            {step.warnings?.map((warning, wIndex) => (
              <View
                key={wIndex}
                className="mt-2.5 flex-row items-start gap-[7px] rounded-md border border-[#FDE68A] bg-warning-bg px-3 py-[9px]"
              >
                <Text className="text-[11px]">{warning.icon}</Text>
                <Text className="flex-1 text-[11px] leading-snug text-warning">
                  {warning.text}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}
