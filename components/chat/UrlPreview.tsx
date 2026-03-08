import { View, Text, Pressable } from "react-native";
import { SkeletonLine } from "../ui/Skeleton";
import { LinkIcon, XIcon } from "../ui/Icons";

interface UrlPreviewProps {
  url: string;
  status: "loading" | "success" | "not_recipe" | "error";
  recipeTitle?: string;
  recipeDescription?: string;
  recipeEmoji?: string;
  message?: string;
  onDismiss: () => void;
}

/** Truncate a URL for display */
function truncateUrl(url: string, maxLen = 40): string {
  const clean = url.replace(/^https?:\/\//, "");
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen) + "…";
}

export function UrlPreview({
  url,
  status,
  recipeTitle,
  recipeDescription,
  recipeEmoji,
  message,
  onDismiss,
}: UrlPreviewProps) {
  return (
    <View className="mb-1 overflow-hidden rounded-t-xl border border-b-0 border-border bg-bg">
      <View className="flex-row items-start gap-3 px-4 py-3">
        {/* Left icon area */}
        <View className="mt-0.5">
          {status === "loading" && <LinkIcon size={18} color="#A8A09A" />}
          {status === "success" && (
            <Text className="text-lg">{recipeEmoji ?? "🍽️"}</Text>
          )}
          {(status === "not_recipe" || status === "error") && (
            <Text className="text-lg">⚠️</Text>
          )}
        </View>

        {/* Content area */}
        <View className="flex-1">
          {status === "loading" && (
            <>
              <Text className="mb-1.5 text-xs text-text-3" numberOfLines={1}>
                {truncateUrl(url)}
              </Text>
              <SkeletonLine className="mb-1.5 w-3/4" />
              <SkeletonLine className="w-1/2" />
              <Text className="mt-2 text-xs text-text-3">
                Extracting recipe…
              </Text>
            </>
          )}

          {status === "success" && (
            <>
              <Text
                className="text-sm font-semibold text-text"
                numberOfLines={1}
              >
                {recipeTitle}
              </Text>
              {recipeDescription ? (
                <Text className="mt-0.5 text-xs text-text-2" numberOfLines={2}>
                  {recipeDescription}
                </Text>
              ) : null}
              <Text className="mt-1 text-xs text-text-3" numberOfLines={1}>
                {truncateUrl(url)}
              </Text>
            </>
          )}

          {(status === "not_recipe" || status === "error") && (
            <>
              <Text className="text-sm font-medium text-text">
                {status === "not_recipe"
                  ? "Not a recipe page"
                  : "Couldn't extract recipe"}
              </Text>
              {message ? (
                <Text className="mt-0.5 text-xs text-text-2" numberOfLines={2}>
                  {message}
                </Text>
              ) : null}
              <Text className="mt-1 text-xs text-text-3" numberOfLines={1}>
                {truncateUrl(url)}
              </Text>
            </>
          )}
        </View>

        {/* Dismiss button */}
        <Pressable
          onPress={onDismiss}
          className="mt-0.5 h-6 w-6 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <XIcon size={14} color="#A8A09A" />
        </Pressable>
      </View>
    </View>
  );
}
