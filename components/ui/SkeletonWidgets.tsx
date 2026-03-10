import { View, Text, ScrollView } from "react-native";
import { SkeletonBox, SkeletonLine, SkeletonRecipeCard } from "./Skeleton";
import { RichStepText } from "../shared/RichStepText";

interface SkeletonWidgetProps {
  partialData?: Record<string, unknown> | null;
}

/** Skeleton for text content — replaces ThinkingIndicator */
export function SkeletonText() {
  return (
    <View className="gap-2 py-1">
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-4/5" />
      <SkeletonLine className="w-3/5" />
    </View>
  );
}

/** Skeleton matching FullRecipe layout */
export function SkeletonFullRecipe({ partialData }: SkeletonWidgetProps) {
  const title =
    typeof partialData?.title === "string" ? partialData.title : null;
  const emoji =
    typeof partialData?.emoji === "string" ? partialData.emoji : null;
  const time = typeof partialData?.time === "string" ? partialData.time : null;
  const servings =
    typeof partialData?.servings === "number" ? partialData.servings : null;
  const cuisine =
    typeof partialData?.cuisine === "string" ? partialData.cuisine : null;
  const description =
    typeof partialData?.description === "string"
      ? partialData.description
      : null;

  const ingredients = partialData?.ingredients as
    | { items?: unknown[] }
    | undefined;
  const ingredientCount = Array.isArray(ingredients?.items)
    ? ingredients.items.length
    : 3;

  const steps = Array.isArray(partialData?.steps) ? partialData.steps : null;
  const stepCount = steps ? steps.length : 3;

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-surface">
      {/* Hero header */}
      <View className="items-center border-b border-border bg-bg-elevated px-4 py-5">
        {emoji ? (
          <Text className="text-[40px]">{emoji}</Text>
        ) : (
          <SkeletonBox className="h-12 w-12 rounded-full" />
        )}
        {title ? (
          <Text className="mt-2 text-center text-[17px] font-bold text-text">
            {title}
          </Text>
        ) : (
          <SkeletonLine className="mt-2 w-2/3" />
        )}
        <View className="mt-2 flex-row items-center gap-3">
          {time ? (
            <Text className="text-[11px] text-text-3">{time}</Text>
          ) : (
            <SkeletonLine className="w-12" />
          )}
          {servings !== null ? (
            <Text className="text-[11px] text-text-3">{servings} servings</Text>
          ) : (
            <SkeletonLine className="w-16" />
          )}
          {cuisine ? (
            <Text className="text-[11px] text-text-3">{cuisine}</Text>
          ) : (
            <SkeletonLine className="w-14" />
          )}
        </View>
        {description ? (
          <Text className="mt-2.5 text-center text-[13px] leading-relaxed text-text-2">
            {description}
          </Text>
        ) : (
          <View className="mt-2.5 w-full items-center gap-1">
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-4/5" />
          </View>
        )}
      </View>

      {/* Ingredients section */}
      <View className="border-b border-border px-3.5 py-3">
        <Text className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand">
          Ingredients
        </Text>
        {Array.from({ length: ingredientCount }).map((_, i) => {
          const item =
            ingredients?.items && Array.isArray(ingredients.items)
              ? (ingredients.items[i] as
                  | { name?: string; amount?: string; unit?: string }
                  | undefined)
              : undefined;
          return (
            <View
              key={i}
              className={`flex-row items-center gap-3 py-2.5 ${i < ingredientCount - 1 ? "border-b border-border-subtle" : ""}`}
            >
              {item?.name ? (
                <Text className="flex-1 text-[13px] text-text">
                  {item.name}
                </Text>
              ) : (
                <SkeletonLine className="flex-1 w-2/3" />
              )}
              {item?.amount ? (
                <Text className="text-[13px] font-semibold text-text-2">
                  {item.amount}
                  {item.unit ? ` ${item.unit}` : ""}
                </Text>
              ) : (
                <SkeletonLine className="w-12" />
              )}
            </View>
          );
        })}
      </View>

      {/* Steps section */}
      <View className="px-3.5 py-3">
        <Text className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand">
          Steps
        </Text>
        {Array.from({ length: stepCount }).map((_, i) => {
          const step = steps
            ? (steps[i] as
                | { stepNumber?: number; title?: string; text?: string }
                | undefined)
            : undefined;
          return (
            <View
              key={i}
              className={`py-[13px] ${i < stepCount - 1 ? "border-b border-border" : ""}`}
            >
              <View className="mb-2 flex-row items-center gap-2">
                <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-brand">
                  <Text className="text-[11px] font-bold text-white">
                    {step?.stepNumber ?? i + 1}
                  </Text>
                </View>
                {step?.title ? (
                  <Text className="text-[13px] font-semibold text-text">
                    {step.title}
                  </Text>
                ) : (
                  <SkeletonLine className="w-1/3" />
                )}
              </View>
              {step?.text ? (
                <RichStepText
                  text={step.text}
                  className="text-[13px] leading-relaxed text-text"
                />
              ) : (
                <View className="gap-1">
                  <SkeletonLine className="w-full" />
                  <SkeletonLine className="w-4/5" />
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Save button placeholder */}
      <View className="border-t border-border px-3.5 py-3">
        <SkeletonBox className="h-10" />
      </View>
    </View>
  );
}

/** Skeleton matching RecipeCarousel layout (3 cards) */
export function SkeletonRecipeCarousel({ partialData }: SkeletonWidgetProps) {
  const cards = Array.isArray(partialData?.cards) ? partialData.cards : null;
  const cardCount = cards ? Math.max(cards.length, 3) : 3;

  return (
    <View className="-mx-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4 pb-2 pt-1"
      >
        {Array.from({ length: cardCount }).map((_, i) => {
          const card = cards
            ? (cards[i] as
                | {
                    title?: string;
                    time?: string;
                    tag?: string;
                    emoji?: string;
                  }
                | undefined)
            : undefined;
          return (
            <View
              key={i}
              className="w-[158px] overflow-hidden rounded-lg border border-border bg-bg-surface"
            >
              {card?.emoji ? (
                <View
                  className="w-full items-center justify-center bg-bg-elevated"
                  style={{ aspectRatio: 1 }}
                >
                  <Text style={{ fontSize: 36 }}>{card.emoji}</Text>
                </View>
              ) : (
                <View
                  className="w-full animate-pulse rounded-lg bg-bg-elevated"
                  style={{ aspectRatio: 1 }}
                />
              )}
              <View className="px-[11px] pb-3 pt-2.5">
                {card?.title ? (
                  <Text
                    className="mb-[5px] text-[13px] font-semibold leading-tight text-text"
                    numberOfLines={2}
                  >
                    {card.title}
                  </Text>
                ) : (
                  <SkeletonLine className="mb-[5px] w-4/5" />
                )}
                {card?.time ? (
                  <Text className="text-[11px] text-text-3">{card.time}</Text>
                ) : (
                  <SkeletonLine className="w-1/2" />
                )}
                <View className="mt-1.5">
                  {card?.tag ? (
                    <View className="self-start rounded-full bg-bg-elevated px-[7px] py-[2px]">
                      <Text className="text-[10px] font-medium text-text-2">
                        {card.tag}
                      </Text>
                    </View>
                  ) : (
                    <SkeletonLine className="w-2/3" />
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/** Skeleton matching IngredientsWidget layout */
export function SkeletonIngredients({ partialData }: SkeletonWidgetProps) {
  const recipeTitle =
    typeof partialData?.recipeTitle === "string"
      ? partialData.recipeTitle
      : null;
  const servings =
    typeof partialData?.servings === "number" ? partialData.servings : null;
  const items = Array.isArray(partialData?.items) ? partialData.items : null;
  const itemCount = items ? items.length : 3;

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-surface shadow-xs">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border-subtle px-4 py-3.5">
        <View>
          {recipeTitle ? (
            <Text className="text-[15px] font-semibold text-text">
              {"\uD83E\uDDC2"} Ingredients
            </Text>
          ) : (
            <SkeletonLine className="w-32" />
          )}
          {servings !== null ? (
            <Text className="mt-0.5 text-[11px] text-text-3">
              {servings} servings
            </Text>
          ) : (
            <SkeletonLine className="mt-1 w-20" />
          )}
        </View>
        <SkeletonBox className="h-6 w-20 rounded-full" />
      </View>

      {/* Items */}
      <View>
        {Array.from({ length: itemCount }).map((_, i) => {
          const item = items
            ? (items[i] as
                | { name?: string; amount?: string; unit?: string }
                | undefined)
            : undefined;
          return (
            <View
              key={i}
              className={`flex-row items-center gap-3 px-4 py-2.5 ${i < itemCount - 1 ? "border-b border-border-subtle" : ""}`}
            >
              <SkeletonBox className="h-5 w-5 rounded-xs" />
              {item?.name ? (
                <Text className="flex-1 text-[13px] text-text">
                  {item.name}
                </Text>
              ) : (
                <SkeletonLine className="flex-1 w-2/3" />
              )}
              {item?.amount ? (
                <Text className="text-[13px] font-semibold text-text-2">
                  {item.amount}
                  {item.unit ? ` ${item.unit}` : ""}
                </Text>
              ) : (
                <SkeletonLine className="w-12" />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** Skeleton matching CookMode layout */
export function SkeletonCookMode({ partialData }: SkeletonWidgetProps) {
  const steps = Array.isArray(partialData?.steps) ? partialData.steps : null;
  const stepCount = steps ? steps.length : 3;
  const totalSteps =
    typeof partialData?.totalSteps === "number" ? partialData.totalSteps : null;

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-surface">
      {/* Header bar */}
      <View className="flex-row items-center justify-between border-b border-border bg-bg-elevated px-3.5 py-[11px]">
        <Text className="text-[11px] font-bold uppercase tracking-wider text-brand">
          Cook Mode
        </Text>
        {totalSteps !== null ? (
          <Text className="text-[11px] text-text-3">{totalSteps} steps</Text>
        ) : (
          <SkeletonLine className="w-14" />
        )}
      </View>

      {/* Steps */}
      {Array.from({ length: stepCount }).map((_, i) => {
        const step = steps
          ? (steps[i] as
              | { stepNumber?: number; title?: string; text?: string }
              | undefined)
          : undefined;
        return (
          <View
            key={i}
            className={`px-3.5 py-[13px] ${i < stepCount - 1 ? "border-b border-border" : ""}`}
          >
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-brand">
                <Text className="text-[11px] font-bold text-white">
                  {step?.stepNumber ?? i + 1}
                </Text>
              </View>
              {step?.title ? (
                <Text className="text-[13px] font-semibold text-text">
                  {step.title}
                </Text>
              ) : (
                <SkeletonLine className="w-1/3" />
              )}
            </View>
            {step?.text ? (
              <RichStepText
                text={step.text}
                className="text-[13px] leading-relaxed text-text"
              />
            ) : (
              <View className="gap-1">
                <SkeletonLine className="w-full" />
                <SkeletonLine className="w-4/5" />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

/** Skeleton matching QuickAction pill shape */
export function SkeletonQuickAction({ partialData }: SkeletonWidgetProps) {
  const label =
    typeof partialData?.label === "string" ? partialData.label : null;
  const icon = typeof partialData?.icon === "string" ? partialData.icon : null;

  if (label) {
    return (
      <View className="self-start flex-row items-center gap-1.5 rounded-xl border border-brand/30 bg-brand-50 px-4 py-2.5">
        {icon ? <Text className="text-[13px]">{icon}</Text> : null}
        <Text className="text-[13px] font-semibold text-brand">{label}</Text>
        <Text className="text-[13px] text-brand/50">{"\u2192"}</Text>
      </View>
    );
  }

  return (
    <View className="self-start rounded-xl border border-border bg-bg-elevated px-4 py-2.5">
      <SkeletonLine className="w-28" />
    </View>
  );
}

/** Skeleton matching TipsList layout */
export function SkeletonTips({ partialData }: SkeletonWidgetProps) {
  const tips = Array.isArray(partialData?.tips) ? partialData.tips : null;
  const tipCount = tips ? tips.length : 2;

  return (
    <View className="gap-2">
      {Array.from({ length: tipCount }).map((_, i) => {
        const tip = tips
          ? (tips[i] as
              | { icon?: string; label?: string; text?: string }
              | undefined)
          : undefined;
        return (
          <View
            key={i}
            className="flex-row gap-[11px] rounded-lg border border-border bg-bg-surface px-3.5 py-3"
          >
            {tip?.icon ? (
              <Text className="shrink-0 text-lg leading-snug">{tip.icon}</Text>
            ) : (
              <SkeletonBox className="h-5 w-5 rounded-sm" />
            )}
            <View className="flex-1">
              {tip?.label ? (
                <Text className="mb-[3px] text-[11px] font-bold uppercase tracking-wider text-brand">
                  {tip.label}
                </Text>
              ) : (
                <SkeletonLine className="mb-1 w-1/4" />
              )}
              {tip?.text ? (
                <Text className="text-[13px] leading-relaxed text-text">
                  {tip.text}
                </Text>
              ) : (
                <View className="gap-1">
                  <SkeletonLine className="w-full" />
                  <SkeletonLine className="w-3/4" />
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/** Skeleton matching RescueWidget layout */
export function SkeletonRescue({ partialData }: SkeletonWidgetProps) {
  const icon = typeof partialData?.icon === "string" ? partialData.icon : null;
  const title =
    typeof partialData?.title === "string" ? partialData.title : null;
  const steps = Array.isArray(partialData?.steps) ? partialData.steps : null;
  const stepCount = steps ? steps.length : 3;

  return (
    <View className="rounded-xl border-[1.5px] border-[#F59E0B] bg-warning-bg p-4">
      {/* Header */}
      <View className="mb-3 flex-row items-center gap-2">
        {icon ? (
          <Text className="text-xl">{icon}</Text>
        ) : (
          <SkeletonBox className="h-6 w-6 rounded-sm" />
        )}
        {title ? (
          <Text className="flex-1 text-[15px] font-bold text-warning">
            {title}
          </Text>
        ) : (
          <SkeletonLine className="flex-1 w-2/3" />
        )}
      </View>

      {/* Steps */}
      {Array.from({ length: stepCount }).map((_, i) => {
        const step = steps
          ? (steps[i] as { number?: number; text?: string } | undefined)
          : undefined;
        return (
          <View
            key={i}
            className={`flex-row gap-2.5 ${i < stepCount - 1 ? "mb-2.5" : ""}`}
          >
            <View className="h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-warning">
              <Text className="text-[11px] font-bold text-white">
                {step?.number ?? i + 1}
              </Text>
            </View>
            {step?.text ? (
              <Text className="flex-1 pt-0.5 text-[13px] leading-relaxed text-text">
                {step.text}
              </Text>
            ) : (
              <View className="flex-1 gap-1 pt-0.5">
                <SkeletonLine className="w-full" />
                <SkeletonLine className="w-3/4" />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

export { SkeletonRecipeCard };
