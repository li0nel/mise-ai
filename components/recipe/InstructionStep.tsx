import { View, Text } from "react-native";
import type { StepWarning, StepTimer } from "../../types";
import { RichStepText } from "../shared/RichStepText";

interface InstructionStepProps {
  stepNumber: number;
  text: string;
  timers?: StepTimer[];
  warnings?: StepWarning[];
}

export function InstructionStep({
  stepNumber,
  text,
  timers,
  warnings,
}: InstructionStepProps) {
  // Skip separate timer pills when inline <timer> tags handle them
  const hasInlineTimers = text.includes("<timer");

  return (
    <View className="mb-[22px] flex-row gap-[14px] px-5">
      {/* Step number circle */}
      <View className="mt-0.5 h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-border bg-bg-elevated">
        <Text className="text-[11px] font-bold text-text-2">{stepNumber}</Text>
      </View>

      {/* Step content */}
      <View className="flex-1 pt-1">
        <RichStepText
          text={text}
          className="text-[13px] leading-relaxed text-text"
        />

        {/* Timer pills — only when text has no inline timers */}
        {!hasInlineTimers && timers && timers.length > 0 ? (
          <View className="mt-2 flex-row flex-wrap gap-2">
            {timers.map((timer) => (
              <View
                key={`${timer.activity}-${timer.duration}`}
                className="rounded-full bg-warning-bg px-2 py-[3px]"
              >
                <Text className="text-[11px] font-semibold text-warning">
                  {"\u23F1"} {timer.duration}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Warning boxes */}
        {warnings && warnings.length > 0
          ? warnings.map((warning) => (
              <View
                key={warning.text}
                className="mt-2.5 flex-row gap-2 rounded-sm border border-[#FDE68A] bg-warning-bg px-2.5 py-2"
              >
                <Text className="text-sm">{warning.icon}</Text>
                <Text className="flex-1 text-[11px] leading-normal text-warning">
                  {warning.text}
                </Text>
              </View>
            ))
          : null}
      </View>
    </View>
  );
}
