import { useState, useCallback, useMemo } from "react";
import { View, ScrollView } from "react-native";
import { PageHeader } from "../../components/ui/PageHeader";
import { ShoppingProgress } from "../../components/shopping/ShoppingProgress";
import { ShoppingSection } from "../../components/shopping/ShoppingSection";
import { ShoppingItem } from "../../components/shopping/ShoppingItem";
import { MOCK_SHOPPING_ITEMS } from "../../data/mockShopping";
import type {
  ShoppingItem as ShoppingItemType,
  ShoppingAisleGroup,
  ShoppingRecipeGroup,
  ShoppingSortMode,
} from "../../types";

/** Aisle icons lookup */
const AISLE_ICONS: Record<string, string> = {
  "Meat & Seafood": "\uD83E\uDD69",
  Produce: "\uD83E\uDD6C",
  Dairy: "\uD83E\uDDC8",
  Pantry: "\uD83E\uDD6B",
  "Condiments & Sauces": "\uD83C\uDF76",
  Alcohol: "\uD83C\uDF77",
};

/** Recipe emoji lookup */
const RECIPE_EMOJIS: Record<string, string> = {
  "boeuf-bourguignon": "\uD83E\uDD69",
  "pad-thai": "\uD83C\uDF5C",
};

function groupByAisle(items: ShoppingItemType[]): ShoppingAisleGroup[] {
  const map = new Map<string, { icon: string; items: ShoppingItemType[] }>();

  for (const item of items) {
    const aisle = item.aisle ?? "Other";
    const existing = map.get(aisle);
    if (existing) {
      existing.items.push(item);
    } else {
      map.set(aisle, { icon: AISLE_ICONS[aisle] ?? "\uD83D\uDCE6", items: [item] });
    }
  }

  return Array.from(map.entries()).map(([aisle, value]) => ({
    aisle,
    icon: value.icon,
    items: value.items,
  }));
}

function groupByRecipe(items: ShoppingItemType[]): ShoppingRecipeGroup[] {
  const map = new Map<
    string,
    { recipeName: string; emoji: string; items: ShoppingItemType[] }
  >();

  for (const item of items) {
    const recipeId = item.recipeId ?? "unknown";
    const existing = map.get(recipeId);
    if (existing) {
      existing.items.push(item);
    } else {
      map.set(recipeId, {
        recipeName: item.recipeName ?? "Other",
        emoji: RECIPE_EMOJIS[recipeId] ?? "\uD83C\uDF73",
        items: [item],
      });
    }
  }

  return Array.from(map.entries()).map(([recipeId, value]) => ({
    recipeId,
    recipeName: value.recipeName,
    emoji: value.emoji,
    items: value.items,
  }));
}

export default function ShoppingScreen() {
  const [items, setItems] = useState<ShoppingItemType[]>(() =>
    MOCK_SHOPPING_ITEMS.map((item) => ({ ...item })),
  );
  const [sortMode, setSortMode] = useState<ShoppingSortMode>("aisle");

  const checkedCount = useMemo(
    () => items.filter((i) => i.checked).length,
    [items],
  );

  const handleToggle = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }, []);

  const aisleGroups = useMemo(() => groupByAisle(items), [items]);
  const recipeGroups = useMemo(() => groupByRecipe(items), [items]);

  return (
    <View className="flex-1 bg-bg">
      <PageHeader title="Shopping List" />

      <ScrollView className="flex-1" contentContainerClassName="pb-32">
        <ShoppingProgress
          checkedCount={checkedCount}
          totalCount={items.length}
          sortMode={sortMode}
          onSortChange={setSortMode}
        />

        <View className="px-4 pt-3">
          {sortMode === "aisle"
            ? aisleGroups.map((group) => (
                <View key={group.aisle} className="mb-6">
                  <ShoppingSection
                    icon={group.icon}
                    name={group.aisle}
                    itemCount={group.items.length}
                  />
                  {group.items.map((item) => (
                    <ShoppingItem
                      key={item.id}
                      item={item}
                      onToggle={handleToggle}
                    />
                  ))}
                </View>
              ))
            : recipeGroups.map((group) => (
                <View key={group.recipeId} className="mb-6">
                  <ShoppingSection
                    icon={group.emoji ?? "\uD83C\uDF73"}
                    name={group.recipeName}
                    itemCount={group.items.length}
                  />
                  {group.items.map((item) => (
                    <ShoppingItem
                      key={item.id}
                      item={item}
                      onToggle={handleToggle}
                    />
                  ))}
                </View>
              ))}
        </View>
      </ScrollView>
    </View>
  );
}
