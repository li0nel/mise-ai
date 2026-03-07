import { View } from "react-native";

interface SkeletonBoxProps {
  className?: string;
}

/** Rectangular skeleton placeholder with pulse animation */
export function SkeletonBox({ className }: SkeletonBoxProps) {
  return (
    <View className={`animate-pulse rounded-lg bg-bg-elevated${className ? ` ${className}` : ""}`} />
  );
}

interface SkeletonLineProps {
  className?: string;
}

/** Text-line-shaped skeleton placeholder with pulse animation */
export function SkeletonLine({ className }: SkeletonLineProps) {
  return (
    <View className={`h-3 animate-pulse rounded-full bg-bg-elevated${className ? ` ${className}` : ""}`} />
  );
}

/** Skeleton matching RecipeCard shape */
export function SkeletonRecipeCard() {
  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-surface">
      {/* Hero image placeholder */}
      <View className="aspect-video w-full animate-pulse rounded-t-xl bg-bg-elevated" />

      {/* Body */}
      <View className="px-4 pb-4 pt-3.5">
        <SkeletonLine className="mb-2 w-3/4" />
        <SkeletonLine className="mb-3.5 w-1/2" />
        {/* Meta row */}
        <View className="mb-3.5 flex-row gap-3.5">
          <SkeletonLine className="w-16" />
          <SkeletonLine className="w-20" />
          <SkeletonLine className="w-14" />
        </View>
        {/* Description lines */}
        <SkeletonLine className="mb-1.5 w-full" />
        <SkeletonLine className="mb-3.5 w-4/5" />
        {/* Action buttons */}
        <View className="flex-row gap-2">
          <SkeletonBox className="h-10 flex-1" />
          <SkeletonBox className="h-10 flex-1" />
        </View>
      </View>
    </View>
  );
}

/** Skeleton matching ShoppingItem shape */
export function SkeletonShoppingItem() {
  return (
    <View className="flex-row items-center gap-3 border-b border-border-subtle px-4 py-2.5">
      {/* Checkbox */}
      <SkeletonBox className="h-5 w-5 rounded-xs" />
      {/* Name */}
      <View className="flex-1">
        <SkeletonLine className="w-2/3" />
      </View>
      {/* Amount */}
      <SkeletonLine className="w-12" />
    </View>
  );
}
