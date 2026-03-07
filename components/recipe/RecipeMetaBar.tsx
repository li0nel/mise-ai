import { View, Text } from "react-native";

interface RecipeMetaBarProps {
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: number;
}

/** Format minutes into a human-readable string: "30" for <60, "2h 30" for >=60 */
function formatTime(minutes: number): string {
  if (minutes < 60) return String(minutes);
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}` : `${hours}h`;
}

/** Render difficulty as star characters */
function formatDifficulty(level: number): string {
  return "\u2B50".repeat(Math.min(level, 5));
}

export function RecipeMetaBar({
  prepTime,
  cookTime,
  servings,
  difficulty,
}: RecipeMetaBarProps) {
  const columns: { value: string; label: string }[] = [
    { value: formatTime(prepTime), label: "MIN PREP" },
    { value: formatTime(cookTime), label: "MIN COOK" },
    { value: String(servings), label: "SERVES" },
    { value: formatDifficulty(difficulty), label: "LEVEL" },
  ];

  return (
    <View className="flex-row items-center border-b border-border-subtle px-2 py-4">
      {columns.map((col, index) => (
        <View
          key={col.label}
          className={`flex-1 items-center ${index < columns.length - 1 ? "border-r border-border-subtle" : ""}`}
        >
          <Text className="text-xl font-extrabold tracking-tight text-text">{col.value}</Text>
          <Text className="mt-[3px] text-[11px] uppercase tracking-wider text-text-3">
            {col.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
