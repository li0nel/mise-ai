import { View, Text, Pressable } from "react-native";

interface ServingsStepperProps {
  servings: number;
  onServingsChange: (servings: number) => void;
}

export function ServingsStepper({ servings, onServingsChange }: ServingsStepperProps) {
  const decrement = () => onServingsChange(Math.max(1, servings - 1));
  const increment = () => onServingsChange(Math.min(20, servings + 1));

  return (
    <View className="flex-row items-center px-5 py-3">
      <Pressable
        onPress={decrement}
        className="h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-border-strong"
      >
        <Text className="text-lg leading-none text-text">{"\u2212"}</Text>
      </Pressable>
      <Text className="flex-1 text-center text-[15px] font-semibold text-text">
        {servings} serving{servings !== 1 ? "s" : ""}
      </Text>
      <Pressable
        onPress={increment}
        className="h-8 w-8 items-center justify-center rounded-full bg-brand"
      >
        <Text className="text-lg leading-none text-text-inv">+</Text>
      </Pressable>
    </View>
  );
}
