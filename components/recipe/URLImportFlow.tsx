import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Pressable, Animated, Platform } from "react-native";
import { BackArrowIcon } from "../ui/Icons";
import { useRecipeStore } from "../../lib/stores/recipeStore";
import { composeRecipeFromFullBlock } from "../../lib/ai/recipeComposer";
import { importRecipeFromUrl } from "../../lib/ai/importRecipe";
import type { ImportProgress } from "../../lib/ai/importRecipe";

interface URLImportFlowProps {
  url: string;
  onComplete: (recipeId: string) => void;
  onBack: () => void;
  onError: (message: string) => void;
}

/** Extract domain from URL for display */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^(www\.|m\.)/, "");
  } catch {
    return url;
  }
}

export function URLImportFlow({
  url,
  onComplete,
  onBack,
  onError,
}: URLImportFlowProps) {
  const [statusText, setStatusText] = useState("Starting import\u2026");
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const abortRef = useRef<AbortController | null>(null);

  const domain = extractDomain(url);

  // Pulsing dot animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 800,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  // Shimmer animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const handleComplete = useCallback(
    (lastProgress: ImportProgress) => {
      if (!lastProgress.recipeData) return;
      try {
        const recipe = composeRecipeFromFullBlock(lastProgress.recipeData);
        const store = useRecipeStore.getState();
        store.setRecipes([...store.recipes, recipe]);
        onComplete(recipe.id);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[mise] Failed to compose imported recipe:", message);
        onError(message);
      }
    },
    [onComplete, onError],
  );

  // Run the import pipeline
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    void (async () => {
      for await (const event of importRecipeFromUrl(url, controller.signal)) {
        if (controller.signal.aborted) return;
        setProgress(event);
        setStatusText(event.message);

        if (event.step === "complete") {
          handleComplete(event);
          return;
        }
        if (event.step === "error") {
          onError(event.error ?? "Unknown error");
          return;
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [url, handleComplete, onError]);

  const handleBack = useCallback(() => {
    abortRef.current?.abort();
    onBack();
  }, [onBack]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  // Compute progress bar width from step
  const progressPercent =
    progress?.step === "fetching"
      ? 15
      : progress?.step === "searching"
        ? 35
        : progress?.step === "found_similar"
          ? 55
          : progress?.step === "enriching"
            ? 75
            : progress?.step === "complete"
              ? 100
              : 5;

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-3 pb-2">
        <Pressable
          onPress={handleBack}
          className="h-9 w-9 items-center justify-center"
        >
          <BackArrowIcon size={22} color="#3D3329" />
        </Pressable>
        <Text className="text-[22px] font-extrabold tracking-tight text-text">
          mise
          <Text className="text-brand">.</Text>
        </Text>
      </View>

      {/* Progress bar */}
      <View className="mx-5 mt-1 h-1 rounded-full bg-brand-light">
        <View
          className="h-full rounded-full bg-brand"
          style={{
            width:
              `${String(Math.round(progressPercent))}%` as unknown as `${number}%`,
          }}
        />
      </View>

      {/* Centered loading content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Emoji */}
        <Text className="text-[48px]">{"\uD83C\uDF73"}</Text>

        {/* Title */}
        <Text className="mt-3 text-lg font-bold text-text">
          Importing recipe{"\u2026"}
        </Text>

        {/* Domain */}
        <Text className="mt-1 text-sm text-text-3">{domain}</Text>

        {/* Pulsing dot */}
        <Animated.View
          className="mt-4 h-2.5 w-2.5 rounded-full bg-brand"
          style={{ transform: [{ scale: pulseAnim }] }}
        />

        {/* Shimmer lines */}
        <View className="mt-6 w-full gap-2.5">
          <Animated.View
            className="h-3 rounded-full bg-brand-light"
            style={{ opacity: shimmerOpacity, width: "90%" }}
          />
          <Animated.View
            className="h-3 rounded-full bg-brand-light"
            style={{ opacity: shimmerOpacity, width: "70%" }}
          />
          <Animated.View
            className="h-3 rounded-full bg-brand-light"
            style={{ opacity: shimmerOpacity, width: "80%" }}
          />
        </View>
      </View>

      {/* Bottom status text */}
      <View className="items-center px-5 pb-8">
        <Text className="text-xs font-medium text-text-3">{statusText}</Text>
      </View>
    </View>
  );
}
