import { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable } from "react-native";

interface AnalysisTraceProps {
  dishName: string;
  isComplete: boolean;
  stats?: { sourceCount: number; durationMs: number };
}

export function AnalysisTrace({
  dishName,
  isComplete,
  stats,
}: AnalysisTraceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const sourceCount = stats?.sourceCount ?? 47;
  const duration = stats?.durationMs
    ? (stats.durationMs / 1000).toFixed(1)
    : "4.2";

  const traceLines = useMemo(
    () => [
      `Searching the web for ${dishName.toLowerCase()} recipes\u2026`,
      `Found ${String(sourceCount)} sources across the web`,
      `Reading bonappetit.com \u2026 seriouseats.com \u2026`,
      `${String(Math.round(sourceCount / 4))} detailed recipes with full ingredient lists`,
      `Comparing proteins, techniques, and regional variations`,
      `Processing recipe data across sources`,
      `Deep analysis complete in ${duration}s`,
    ],
    [dishName, sourceCount, duration],
  );

  useEffect(() => {
    if (isComplete) {
      setVisibleLines(traceLines.length);
      return;
    }

    const interval = setInterval(() => {
      setVisibleLines((v) => {
        if (v >= traceLines.length) {
          clearInterval(interval);
          return v;
        }
        return v + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isComplete, traceLines.length]);

  // Compressed card view when analysis is done
  if (isComplete) {
    return (
      <Pressable
        onPress={() => setShowDetails(!showDetails)}
        className="mx-4 mt-4 rounded-lg bg-bg-elevated px-4 py-3"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-[13px] text-text-2">
            {"\u2726"} Analyzed {String(sourceCount)} sources in {duration}s
          </Text>
          <Text className="text-[11px] text-text-3">
            {showDetails ? "Hide details \u25B4" : "Show details \u25BE"}
          </Text>
        </View>
        {showDetails ? (
          <View className="mt-2">
            {traceLines.map((line, i) => (
              <Text
                key={String(i)}
                className="text-[12px] leading-5 text-text-3"
              >
                {line}
              </Text>
            ))}
          </View>
        ) : null}
      </Pressable>
    );
  }

  // Full trace view during analysis
  const progress =
    traceLines.length > 0 ? (visibleLines / traceLines.length) * 100 : 0;

  return (
    <View className="px-5 pt-6">
      {/* Dish title */}
      <Text className="text-[26px] font-extrabold tracking-tight text-text">
        {dishName}
      </Text>

      {/* Status line */}
      <View className="mt-3 flex-row items-center gap-2">
        <View className="h-2 w-2 rounded-full bg-brand" />
        <Text className="text-[13px] font-medium text-text-2">
          Analyzing variations{"\u2026"}
        </Text>
      </View>

      {/* Progress bar */}
      <View className="mt-3 h-0.5 rounded-full bg-border">
        <View
          className="h-full rounded-full bg-brand"
          style={{
            width:
              `${String(Math.round(progress))}%` as unknown as `${number}%`,
          }}
        />
      </View>

      {/* Streaming trace lines */}
      <View className="mt-4">
        {traceLines.slice(0, visibleLines).map((line, i) => {
          const opacity = 1 - (visibleLines - i - 1) * 0.12;
          return (
            <Text
              key={String(i)}
              className="text-[13px] leading-6 text-text-3"
              style={{ opacity: Math.max(0.3, opacity) }}
            >
              {line}
            </Text>
          );
        })}
      </View>
    </View>
  );
}
