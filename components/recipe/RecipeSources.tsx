import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { GlobeIcon, ChevronDownIcon } from "../ui/Icons";
import type { RecipeSource, AnalysisStats } from "../../types";

interface RecipeSourcesProps {
  sources: RecipeSource[];
  analysisStats?: AnalysisStats;
}

export function RecipeSources({ sources, analysisStats }: RecipeSourcesProps) {
  const [expanded, setExpanded] = useState(false);

  if (sources.length === 0) return null;

  const siteCount = new Set(sources.map((s) => s.domain)).size;
  const sourceCount = analysisStats?.sourceCount ?? sources.length;

  return (
    <View className="px-5 pb-5 pt-2">
      {/* Section header */}
      <Text className="text-[11px] font-bold uppercase tracking-wider text-text-3">
        Sources
      </Text>

      {/* Summary line */}
      <Text className="mt-1.5 text-[13px] text-text-2">
        Based on {sourceCount} variations from {siteCount}{" "}
        {siteCount === 1 ? "site" : "sites"}
      </Text>

      {/* Toggle */}
      <Pressable
        className="mt-3 flex-row items-center"
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel={expanded ? "Hide sources" : "Show sources"}
      >
        <Text className="text-[13px] font-medium text-text-2">
          {expanded ? "Hide sources" : "Show sources"}
        </Text>
        <View
          style={expanded ? { transform: [{ rotate: "180deg" }] } : undefined}
        >
          <ChevronDownIcon size={14} color="#A8A09A" />
        </View>
      </Pressable>

      {/* Expanded source list */}
      {expanded ? (
        <View className="mt-3">
          {sources.map((source, index) => (
            <Pressable
              key={`${source.domain}-${source.url}`}
              className={`flex-row items-center gap-2.5 py-2.5 ${
                index < sources.length - 1
                  ? "border-b border-border-subtle"
                  : ""
              }`}
              accessibilityRole="link"
              accessibilityLabel={`${source.domain}: ${source.title}`}
            >
              <GlobeIcon size={14} color="#A8A09A" />
              <View className="flex-1">
                <Text className="text-[13px] font-medium text-text">
                  {source.domain}
                </Text>
                <Text className="text-[13px] text-text-2" numberOfLines={1}>
                  {source.title}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
