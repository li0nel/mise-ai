import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import { BackArrowIcon, SendIcon } from "../ui/Icons";
import { UserBubble } from "../chat/UserBubble";
import { Button } from "../ui/Button";
import {
  MOCK_VERDICT,
  MOCK_QUESTIONS,
  MOCK_WRAPUP,
  createMockRecipe,
} from "../../lib/mocks/massamanCurryMock";
import { useRecipeStore } from "../../lib/stores/recipeStore";

/** Chain-of-thought trace lines shown during the analyzing phase */
const MOCK_COT_LINES: string[] = [
  "Searching the web for massaman curry recipes\u2026",
  "Found 47 sources across the web",
  "Reading bonappetit.com \u2026 seriouseats.com \u2026 hot-thai-kitchen.com \u2026",
  "12 detailed recipes with full ingredient lists",
  "Comparing proteins: beef (traditional in 9 of 12), chicken, tofu",
  "Paste methods: 2 approaches \u2014 homemade from scratch vs store-bought",
  "Processing ~85,000 tokens of recipe data",
  "Spice levels vary widely \u2014 some use 8 dried chillies, some use 2",
  "Cook times range from 35 min to 2.5 hrs",
  "joshuaweissman.com \u2026 epicurious.com \u2026 9 more",
  "Deep analysis complete in 4.2s",
];

type Phase = "analyzing" | "conversing" | "ready";

interface RecipeBuilderFlowProps {
  dishName: string;
  onViewRecipe: (recipeId: string) => void;
  onBack: () => void;
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
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showCotDetails, setShowCotDetails] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing dot animation
  useEffect(() => {
    if (phase !== "analyzing") return;
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
  }, [phase, pulseAnim]);

  // Stream CoT lines during analyzing phase
  useEffect(() => {
    if (phase !== "analyzing") return;

    const interval = setInterval(() => {
      setVisibleLines((v) => {
        if (v >= MOCK_COT_LINES.length) {
          clearInterval(interval);
          // Auto-transition to conversing after last line
          setTimeout(() => setPhase("conversing"), 400);
          return v;
        }
        return v + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [phase]);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (phase === "conversing" || phase === "ready") {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [phase, currentStep, answers.length]);

  const handleQuickReply = useCallback(
    (label: string) => {
      const newAnswers = [...answers, label];
      setAnswers(newAnswers);

      if (currentStep + 1 < MOCK_QUESTIONS.length) {
        setCurrentStep((s) => s + 1);
      } else {
        // All questions answered
        setTimeout(() => setPhase("ready"), 300);
      }
    },
    [answers, currentStep],
  );

  const handleChatSend = useCallback(() => {
    const text = chatInput.trim();
    if (text.length === 0) return;
    setChatInput("");
    handleQuickReply(text);
  }, [chatInput, handleQuickReply]);

  const handleViewRecipe = useCallback(() => {
    const id = `mock-${Date.now().toString(36)}`;
    const recipe = createMockRecipe(id);
    const store = useRecipeStore.getState();
    store.setRecipes([...store.recipes, recipe]);
    onViewRecipe(id);
  }, [onViewRecipe]);

  // ─── Analyzing Phase ───
  if (phase === "analyzing") {
    const progress =
      MOCK_COT_LINES.length > 0
        ? Math.min((visibleLines / MOCK_COT_LINES.length) * 78, 78)
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
            {MOCK_COT_LINES.slice(0, visibleLines).map((line, i) => {
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
  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-border-subtle px-4 pt-3 pb-2">
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

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="px-4 py-4 gap-4"
        keyboardShouldPersistTaps="handled"
      >
        {/* Search divider */}
        <View className="flex-row items-center gap-2">
          <View className="h-px flex-1 bg-border-subtle" />
          <Text className="text-[11px] font-medium text-text-4">
            Search: &ldquo;{dishName}&rdquo;
          </Text>
          <View className="h-px flex-1 bg-border-subtle" />
        </View>

        {/* Collapsed CoT card */}
        <Pressable
          onPress={() => setShowCotDetails(!showCotDetails)}
          className="rounded-lg bg-bg-elevated px-3.5 py-2.5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-sm">{"\u2726"}</Text>
              <Text className="text-xs font-medium text-text-2">
                Analyzed 47 sources in 4.2s
              </Text>
            </View>
            <Text className="text-[11px] font-medium text-text-3">
              {showCotDetails ? "Hide details \u25B4" : "Show details \u25BE"}
            </Text>
          </View>
          {showCotDetails ? (
            <View className="mt-2">
              {MOCK_COT_LINES.map((line, i) => (
                <Text key={String(i)} className="text-xs leading-5 text-text-3">
                  {line}
                </Text>
              ))}
            </View>
          ) : null}
        </Pressable>

        {/* AI verdict */}
        <View>
          {MOCK_VERDICT.split("\n\n").map((paragraph, i) => (
            <RichText
              key={String(i)}
              text={paragraph}
              className={`text-sm leading-relaxed text-text ${i > 0 ? "mt-2.5" : ""}`}
            />
          ))}
        </View>

        {/* Questions & answers */}
        {MOCK_QUESTIONS.slice(0, currentStep + 1).map((q, qIndex) => {
          const answered = qIndex < answers.length;
          return (
            <View key={String(qIndex)} className="gap-2.5">
              {/* AI question text */}
              <View>
                {q.aiText.split("\n\n").map((p, pi) => (
                  <RichText
                    key={String(pi)}
                    text={p}
                    className={`text-sm leading-relaxed text-text ${pi > 0 ? "mt-2" : ""}`}
                  />
                ))}
              </View>

              {/* Quick reply buttons or user answer */}
              {answered ? (
                <UserBubble content={answers[qIndex] ?? ""} />
              ) : (
                <View className="flex-row flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <Pressable
                      key={opt.label}
                      onPress={() => handleQuickReply(opt.label)}
                      className="rounded-full border border-brand/30 bg-brand-50 px-4 py-2.5"
                    >
                      <Text className="text-[13px] font-semibold text-brand">
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Ready phase: wrap-up + CTA */}
        {phase === "ready" ? (
          <>
            <View>
              <Text className="text-sm leading-relaxed text-text">
                {MOCK_WRAPUP}
              </Text>
            </View>

            {/* Recipe CTA card */}
            <View className="items-center rounded-xl border border-border bg-bg-surface p-6 shadow-md">
              <Text className="text-[40px]">{"\uD83C\uDF89"}</Text>
              <Text className="mt-2 text-[17px] font-bold text-text">
                Your recipe is ready
              </Text>
              <View className="mt-4 w-full">
                <Button variant="primary" onPress={handleViewRecipe}>
                  {"View Recipe \u2192"}
                </Button>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Simple chat input bar */}
      <View className="border-t border-border-subtle bg-bg px-4 pb-8 pt-2">
        <View className="flex-row items-center gap-2">
          <TextInput
            className="h-11 flex-1 rounded-full border border-border bg-bg-surface px-4 text-sm text-text"
            placeholder="Ask about recipes..."
            placeholderTextColor="#A8A09A"
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={handleChatSend}
            returnKeyType="send"
            style={{ outlineStyle: "none" } as Record<string, unknown>}
          />
          <Pressable
            onPress={handleChatSend}
            className="h-9 w-9 items-center justify-center rounded-full bg-brand"
          >
            <SendIcon size={16} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
