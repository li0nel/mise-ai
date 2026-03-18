import { View, Text } from "react-native";
import type { RecipeTag } from "../../types";

interface RecipeTagsProps {
  tags: RecipeTag[];
}

export function RecipeTags({ tags }: RecipeTagsProps) {
  if (tags.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2 px-5 py-3">
      {tags.map((tag) => {
        const isDietary = tag.tier === "dietary";
        const bgClass = isDietary ? "bg-success-bg" : "bg-bg-elevated";
        const textClass = isDietary ? "text-success" : "text-text-2";

        return (
          <View
            key={tag.label}
            className={`flex-row items-center rounded-full px-3 py-1.5 ${bgClass}`}
          >
            <Text className={`text-[13px] font-medium ${textClass}`}>
              {"\u2713"} {tag.label}
            </Text>
            {tag.detail ? (
              <Text className={`ml-1 text-[11px] ${textClass} opacity-70`}>
                {tag.detail}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
