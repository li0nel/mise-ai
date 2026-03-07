import type { Block } from "../../types";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { RecipeCard } from "./RecipeCard";
import { RecipeCarousel } from "./RecipeCarousel";
import { IngredientsWidget } from "./IngredientsWidget";
import { CookStep } from "./CookStep";
import { CookMode } from "./CookMode";
import { TipsList } from "./TipsList";
import { RescueWidget } from "./RescueWidget";

interface BlockRendererProps {
  block: Block;
}

function BlockContent({ block }: BlockRendererProps) {
  switch (block.type) {
    case "recipe-card":
      return <RecipeCard data={block.data} />;
    case "recipe-carousel":
      return <RecipeCarousel data={block.data} />;
    case "ingredients":
      return <IngredientsWidget data={block.data} />;
    case "cook-step":
      return <CookStep data={block.data} />;
    case "cook-mode":
      return <CookMode data={block.data} />;
    case "tips":
      return <TipsList data={block.data} />;
    case "rescue":
      return <RescueWidget data={block.data} />;
  }
}

export function BlockRenderer({ block }: BlockRendererProps) {
  return (
    <ErrorBoundary>
      <BlockContent block={block} />
    </ErrorBoundary>
  );
}
