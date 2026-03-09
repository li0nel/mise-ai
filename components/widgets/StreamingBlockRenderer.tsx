import { View } from "react-native";
import type { StreamingBlock, Block } from "../../types";
import { BlockRenderer } from "./BlockRenderer";
import {
  SkeletonFullRecipe,
  SkeletonRecipeCard,
  SkeletonRecipeCarousel,
  SkeletonIngredients,
  SkeletonCookMode,
  SkeletonQuickAction,
  SkeletonTips,
  SkeletonRescue,
} from "../ui/SkeletonWidgets";

interface StreamingBlockRendererProps {
  block: StreamingBlock;
}

export function StreamingBlockRenderer({ block }: StreamingBlockRendererProps) {
  // If complete with data, render the real widget
  if (block.complete && block.data) {
    const realBlock = { type: block.type, data: block.data } as Block;
    return <BlockRenderer block={realBlock} />;
  }

  // Otherwise render the skeleton variant with partial data
  return (
    <View>
      <SkeletonContent type={block.type} partialData={block.data} />
    </View>
  );
}

interface SkeletonContentProps {
  type: StreamingBlock["type"];
  partialData: Record<string, unknown> | null;
}

function SkeletonContent({ type, partialData }: SkeletonContentProps) {
  switch (type) {
    case "full-recipe":
      return <SkeletonFullRecipe partialData={partialData} />;
    case "recipe-card":
      return <SkeletonRecipeCard />;
    case "recipe-carousel":
      return <SkeletonRecipeCarousel partialData={partialData} />;
    case "ingredients":
      return <SkeletonIngredients partialData={partialData} />;
    case "cook-mode":
      return <SkeletonCookMode partialData={partialData} />;
    case "quick-action":
      return <SkeletonQuickAction partialData={partialData} />;
    case "tips":
      return <SkeletonTips partialData={partialData} />;
    case "rescue":
      return <SkeletonRescue partialData={partialData} />;
  }
}
