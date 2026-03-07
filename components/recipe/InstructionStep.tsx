import { View, Text } from "react-native";
import type { StepWarning, StepTimer } from "../../types";

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
  return (
    <View className="mb-5 flex-row px-5">
      {/* Step number circle */}
      <View className="mr-3 h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-border bg-bg-elevated">
        <Text className="text-xs font-bold text-text-2">{stepNumber}</Text>
      </View>

      {/* Step content */}
      <View className="flex-1 pt-0.5">
        <Text className="text-[15px] leading-[22px] text-text">{text}</Text>

        {/* Timer pills */}
        {timers && timers.length > 0 ? (
          <View className="mt-2 flex-row flex-wrap gap-2">
            {timers.map((timer) => (
              <View
                key={`${timer.activity}-${timer.duration}`}
                className="rounded-full bg-brand-light px-3 py-1"
              >
                <Text className="text-xs font-semibold text-brand">
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
                className="mt-2.5 flex-row rounded-sm border border-[#FDE68A] bg-warning-bg p-2"
              >
                <Text className="mr-2 text-sm">{warning.icon}</Text>
                <Text className="flex-1 text-xs leading-[18px] text-warning">
                  {warning.text}
                </Text>
              </View>
            ))
          : null}
      </View>
    </View>
  );
}
