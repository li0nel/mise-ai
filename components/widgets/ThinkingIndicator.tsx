import { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

/**
 * Animated thinking dots indicator, shown while the AI is generating a response.
 * Three dots pulse in sequence with staggered delays.
 */
export function ThinkingIndicator() {
  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    function createPulse(dot: Animated.Value, delay: number) {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
          // Pad remaining cycle time so the total loop is ~1400ms
          Animated.delay(600 - delay),
        ])
      );
    }

    const a1 = createPulse(dot1, 0);
    const a2 = createPulse(dot2, 180);
    const a3 = createPulse(dot3, 360);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View>
      <View className="flex-row items-center gap-[5px] py-0.5">
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            className="h-[7px] w-[7px] rounded-full bg-text-3"
            style={{ opacity: dot, transform: [{ scale: dot }] }}
          />
        ))}
      </View>
      <View className="mt-0.5 flex-row items-center gap-[5px] py-0.5">
        <Text className="text-[11px] text-text-3">Loading...</Text>
      </View>
    </View>
  );
}
