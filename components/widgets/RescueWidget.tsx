import { View, Text } from "react-native";
import type { RescueBlock } from "../../types";

interface RescueWidgetProps {
  data: RescueBlock["data"];
}

export function RescueWidget({ data }: RescueWidgetProps) {
  return (
    <View className="rounded-xl border-[1.5px] border-[#F59E0B] bg-warning-bg p-4">
      {/* Header */}
      <View className="mb-3 flex-row items-center gap-2">
        <Text className="text-xl">{data.icon}</Text>
        <Text className="flex-1 text-[15px] font-bold text-warning">
          {data.title}
        </Text>
      </View>

      {/* Numbered steps */}
      {data.steps.map((step, index) => {
        const isLast = index === data.steps.length - 1;
        return (
          <View
            key={step.number}
            className={`flex-row gap-2.5 ${isLast ? "" : "mb-2.5"}`}
          >
            {/* Number circle */}
            <View className="h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-warning">
              <Text className="text-[11px] font-bold text-white">
                {step.number}
              </Text>
            </View>

            {/* Step text */}
            <Text className="flex-1 pt-0.5 text-[13px] leading-relaxed text-text">
              {step.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
