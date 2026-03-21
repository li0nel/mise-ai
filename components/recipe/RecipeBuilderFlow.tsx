import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Pressable, Animated, Platform } from "react-native";
import { BackArrowIcon } from "../ui/Icons";
import { Button } from "../ui/Button";
import { useRecipeStore } from "../../lib/stores/recipeStore";
import { BuilderChat } from "../../lib/ai/builderChat";
import type { BuilderMessage } from "../../lib/ai/builderChat";
import { composeRecipeFromFullBlock } from "../../lib/ai/recipeComposer";
import type { FullRecipeBlock, QuickActionBlock } from "../../types/chat";
import {
  buildRecipeContext,
  searchRecipes,
  extractSourceMeta,
  buildAnalysisTrace,
} from "../../lib/exa/exaService";
import type { ExaSearchResponse } from "../../types/exa";

type Phase = "analyzing" | "conversing" | "ready";

interface RecipeBuilderFlowProps {
  dishName: string;
  onViewRecipe: (recipeId: string) => void;
  onBack: () => void;
}

interface WizardStep {
  content: string;
  questionTitle: string;
  questionHint: string;
  options: { label: string; chatMessage: string }[];
  answer: string | null;
}

/** Render markdown-style **bold** within a Text element */
function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={String(i)} className="font-bold text-text">
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={String(i)}>{part}</Text>;
      })}
    </Text>
  );
}

export function RecipeBuilderFlow({
  dishName,
  onViewRecipe,
  onBack,
}: RecipeBuilderFlowProps) {
  const [phase, setPhase] = useState<Phase>("analyzing");
  const [visibleLines, setVisibleLines] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Exa search state
  const [exaResponse, setExaResponse] = useState<ExaSearchResponse | null>(
    null,
  );
  const [traceLines, setTraceLines] = useState<string[]>([]);

  // Wizard state
  const [steps, setSteps] = useState<WizardStep[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [recipeResult, setRecipeResult] = useState<
    FullRecipeBlock["data"] | null
  >(null);
  const chatRef = useRef<BuilderChat | null>(null);
  const cancelledRef = useRef(false);

  // Cleanup effect
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  // Fetch Exa data on mount
  useEffect(() => {
    let cancelled = false;
    void searchRecipes(dishName).then((response) => {
      if (cancelled) return;
      setExaResponse(response);
      const sources = extractSourceMeta(response);
      const lines = buildAnalysisTrace(sources);
      setTraceLines(lines.map((l) => l.text));
    });
    return () => {
      cancelled = true;
    };
  }, [dishName]);

  // D2. processGeminiResponse
  const processGeminiResponse = useCallback((response: BuilderMessage) => {
    setIsLoading(false);
    const fullRecipeBlock = response.blocks.find(
      (b): b is FullRecipeBlock => b.type === "full-recipe",
    );
    if (fullRecipeBlock) {
      setRecipeResult(fullRecipeBlock.data);
      setPhase("ready");
      return;
    }
    const quickActions = response.blocks.filter(
      (b): b is QuickActionBlock => b.type === "quick-action",
    );
    const newStep: WizardStep = {
      content: response.content,
      questionTitle: response.questionTitle ?? "Question",
      questionHint: response.questionHint ?? "",
      options: quickActions.map((qa) => ({
        label: qa.data.label,
        chatMessage: qa.data.chatMessage ?? qa.data.label,
      })),
      answer: null,
    };
    setSteps((prev) => [...prev, newStep]);
    setActiveStepIndex((prev) => prev + 1);
  }, []);

  // D1. startConversation
  const startConversation = useCallback(async () => {
    if (!exaResponse) {
      setPhase("conversing");
      return;
    }
    const context = buildRecipeContext(exaResponse);
    chatRef.current = new BuilderChat(dishName, context);
    setIsLoading(true);
    setPhase("conversing");
    try {
      const response = await chatRef.current.sendReply(
        "Build a recipe for " + dishName,
      );
      if (cancelledRef.current) return;
      processGeminiResponse(response);
    } catch (err: unknown) {
      if (cancelledRef.current) return;
      setIsLoading(false);
      const message = err instanceof Error ? err.message : String(err);
      setSteps([
        {
          content: "Something went wrong: " + message,
          questionTitle: "Error",
          questionHint: "",
          options: [],
          answer: null,
        },
      ]);
      setActiveStepIndex(0);
    }
  }, [dishName, exaResponse, processGeminiResponse]);

  // Pulsing dot animation
  useEffect(() => {
    if (phase !== "analyzing" && !isLoading) return;
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
  }, [phase, pulseAnim, isLoading]);

  // Stream CoT lines during analyzing phase (wait for traceLines to load)
  useEffect(() => {
    if (phase !== "analyzing" || traceLines.length === 0) return;

    const interval = setInterval(() => {
      setVisibleLines((v) => {
        if (v >= traceLines.length) {
          clearInterval(interval);
          // Auto-transition to conversing after last line
          setTimeout(() => {
            void startConversation();
          }, 400);
          return v;
        }
        return v + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [phase, traceLines, startConversation]);

  // D3. handleOptionSelect
  const handleOptionSelect = useCallback(
    async (
      stepIndex: number,
      option: { label: string; chatMessage: string },
    ) => {
      setSteps((prev) =>
        prev.map((s, i) =>
          i === stepIndex ? { ...s, answer: option.label } : s,
        ),
      );
      setIsLoading(true);
      if (!chatRef.current) return;
      try {
        const response = await chatRef.current.sendReply(option.chatMessage);
        if (cancelledRef.current) return;
        processGeminiResponse(response);
      } catch (err: unknown) {
        if (cancelledRef.current) return;
        setIsLoading(false);
        const message = err instanceof Error ? err.message : String(err);
        setSteps((prev) => [
          ...prev,
          {
            content: "Something went wrong: " + message,
            questionTitle: "Error",
            questionHint: "",
            options: [],
            answer: null,
          },
        ]);
        setActiveStepIndex((prev) => prev + 1);
      }
    },
    [processGeminiResponse],
  );

  // D4. handleViewRecipe
  const handleViewRecipe = useCallback(() => {
    if (!recipeResult) return;
    try {
      const recipe = composeRecipeFromFullBlock(recipeResult);
      const store = useRecipeStore.getState();
      store.setRecipes([...store.recipes, recipe]);
      onViewRecipe(recipe.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[mise] Failed to compose recipe:", message);
    }
  }, [recipeResult, onViewRecipe]);

  // ─── Analyzing Phase ───
  if (phase === "analyzing") {
    const progress =
      traceLines.length > 0
        ? Math.min((visibleLines / traceLines.length) * 78, 78)
        : 0;

    return (
      <View className="flex-1 bg-bg">
        {/* Header */}
        <View className="flex-row items-center gap-3 px-4 pt-3 pb-2">
          <Pressable
            onPress={onBack}
            className="h-9 w-9 items-center justify-center"
          >
            <BackArrowIcon size={22} color="#3D3329" />
          </Pressable>
          <Text className="text-[22px] font-extrabold tracking-tight text-text">
            mise
            <Text className="text-brand">.</Text>
          </Text>
        </View>

        <View className="flex-1 px-5 pt-6">
          {/* Big dish title */}
          <Text className="text-[26px] font-extrabold tracking-tight text-text">
            {dishName}
          </Text>

          {/* Pulsing status line */}
          <View className="mt-3 flex-row items-center gap-2.5">
            <Animated.View
              className="h-2.5 w-2.5 rounded-full bg-brand"
              style={{ transform: [{ scale: pulseAnim }] }}
            />
            <Text className="text-sm font-medium text-text-2">
              Analyzing variations{"\u2026"}
            </Text>
          </View>

          {/* Progress bar */}
          <View className="mt-3 h-1 rounded-full bg-brand-light">
            <View
              className="h-full rounded-full bg-brand"
              style={{
                width:
                  `${String(Math.round(progress))}%` as unknown as `${number}%`,
              }}
            />
          </View>

          {/* CoT trace lines */}
          <View className="mt-5">
            {traceLines.slice(0, visibleLines).map((line, i) => {
              const fadeStart = 6;
              const opacity =
                i >= fadeStart ? Math.max(0.35, 1 - (i - fadeStart) * 0.15) : 1;
              return (
                <Text
                  key={String(i)}
                  className="text-[13px] leading-6 text-text-3"
                  style={{ opacity }}
                >
                  {line}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    );
  }

  // ─── Conversing / Ready Phase ───
  const answeredSteps = steps.filter((s) => s.answer !== null);
  const progressPercent =
    phase === "ready" ? 100 : Math.min(15 + answeredSteps.length * 17, 95);
  const activeStep = activeStepIndex >= 0 ? steps[activeStepIndex] : undefined;

  const summaryParts: string[] = [];
  if (recipeResult?.tags) {
    summaryParts.push(...recipeResult.tags.map((t) => t.label));
  }
  if (recipeResult) {
    summaryParts.push(recipeResult.time);
    summaryParts.push("serves " + String(recipeResult.servings));
  }
  const summaryText = summaryParts.join(", ");

  return (
    <View className="flex-1 bg-bg">
      {/* Header - NO border-b */}
      <View className="flex-row items-center gap-3 px-4 pt-3 pb-2">
        <Pressable
          onPress={onBack}
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

      {/* Content area */}
      <View className="flex-1 px-5 pt-4">
        {/* Analysis chip */}
        <View className="flex-row flex-wrap gap-1.5">
          <View className="rounded-full bg-bg-elevated border border-border px-3 py-1.5 flex-row items-center gap-1.5 shadow-sm">
            <Text className="text-xs">{"\uD83C\uDF5B"}</Text>
            <Text className="text-xs font-medium text-text-2">
              {dishName} · {exaResponse?.results.length ?? 0} sources
            </Text>
          </View>
        </View>

        {/* Answer chips */}
        {answeredSteps.length > 0 ? (
          <View className="flex-row flex-wrap gap-2 mt-2">
            {answeredSteps.map((step, i) => (
              <View
                key={String(i)}
                className="rounded-full border border-border px-3 py-1"
              >
                <Text className="text-xs font-medium text-text-2">
                  {step.answer}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Question card / Loading / Celebration */}
        {phase === "ready" && recipeResult ? (
          <View className="rounded-2xl bg-bg-elevated p-5 shadow-md border border-border-subtle items-center mt-4">
            <Text className="text-[32px]">{"\uD83C\uDF89"}</Text>
            <Text className="mt-2 text-lg font-bold text-text">
              Your recipe is ready
            </Text>
            <Text className="mt-1 text-[15px] font-semibold text-brand">
              {recipeResult.title}
            </Text>
            <Text className="mt-1.5 text-xs text-text-2">{summaryText}</Text>
            <Pressable onPress={onBack} className="mt-2.5">
              <Text className="text-xs font-medium text-text-3">
                Start Over
              </Text>
            </Pressable>
          </View>
        ) : isLoading ? (
          <View className="rounded-2xl bg-bg-elevated p-5 shadow-md border border-border-subtle items-center justify-center mt-4">
            <Animated.View
              className="h-2.5 w-2.5 rounded-full bg-brand"
              style={{ transform: [{ scale: pulseAnim }] }}
            />
            <Text className="mt-2 text-sm font-medium text-text-2">
              Thinking...
            </Text>
          </View>
        ) : activeStep ? (
          <View className="rounded-2xl bg-bg-elevated p-5 shadow-md border border-border-subtle mt-4">
            <Text className="text-lg font-bold text-text">
              {activeStep.questionTitle}
            </Text>
            {activeStep.questionHint ? (
              <Text className="text-sm text-text-2 mt-1">
                {activeStep.questionHint}
              </Text>
            ) : null}
            {activeStep.content ? (
              <RichText
                text={activeStep.content}
                className="text-sm leading-relaxed text-text mt-3"
              />
            ) : null}
            {activeStep.options.length > 0 ? (
              <View className="mt-4 gap-2.5">
                {activeStep.options.map((opt) => (
                  <Pressable
                    key={opt.label}
                    onPress={() =>
                      void handleOptionSelect(activeStepIndex, opt)
                    }
                    className="rounded-full border-[1.5px] border-border bg-transparent px-4 py-2.5"
                  >
                    <Text className="text-[13px] font-medium text-text">
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Pinned CTA - ready phase only */}
      {phase === "ready" ? (
        <View className="px-5 pb-8 pt-3 bg-bg border-t border-border-subtle">
          <Button variant="primary" onPress={handleViewRecipe}>
            {"View Recipe \u2192"}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
