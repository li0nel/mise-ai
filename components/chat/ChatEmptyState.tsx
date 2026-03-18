import { useMemo } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { SearchIcon, ChevronRightIcon } from "../ui/Icons";
import { getQuickPicks } from "../../lib/search/dishCatalogue";

interface ChatEmptyStateProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchSubmit: (query: string) => void;
  onDishSelect: (dishName: string) => void;
  onSearchFocus?: () => void;
}

export function ChatEmptyState({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onDishSelect,
  onSearchFocus,
}: ChatEmptyStateProps) {
  const quickPicks = useMemo(() => getQuickPicks(5), []);

  const handleSubmit = () => {
    const q = searchQuery.trim();
    if (q.length > 0) onSearchSubmit(q);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 pb-8 pt-6"
      keyboardShouldPersistTaps="handled"
    >
      {/* Tagline — matches nav-01 style */}
      <Text className="text-[22px] font-extrabold leading-tight tracking-tight text-text">
        Find any dish.{"\n"}
        <Text className="text-brand">Make it yours.</Text>
      </Text>

      {/* Search bar */}
      <View className="mt-5 h-12 flex-row items-center gap-2.5 rounded-full border-[1.5px] border-border bg-bg-surface px-4 shadow-sm">
        <SearchIcon size={18} color="#A8A09A" />
        <TextInput
          className="flex-1 text-[15px] text-text"
          placeholder="Search recipes, ingredients\u2026"
          placeholderTextColor="#A8A09A"
          value={searchQuery}
          onChangeText={onSearchChange}
          onSubmitEditing={handleSubmit}
          onFocus={onSearchFocus}
          returnKeyType="search"
          style={{ outlineStyle: "none" } as Record<string, unknown>}
        />
      </View>

      {/* Quick picks */}
      <Text className="mt-6 mb-3 text-[11px] font-bold uppercase tracking-wider text-brand">
        Quick picks
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {quickPicks.map((dish) => (
          <Pressable
            key={dish.name}
            onPress={() => onDishSelect(dish.name)}
            className="rounded-full border-[1.5px] border-border bg-bg-surface px-3.5 py-[7px] shadow-sm"
          >
            <Text className="text-[13px] font-medium text-text-2">
              {dish.emoji} {dish.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Recently searched */}
      <Text className="mt-7 mb-3 text-[11px] font-bold uppercase tracking-wider text-brand">
        Recently Searched
      </Text>
      {["Chicken curry", "Pasta carbonara", "Pad Thai"].map((search) => (
        <Pressable
          key={search}
          onPress={() => onDishSelect(search)}
          className="flex-row items-center gap-2.5 border-b border-border-subtle py-2.5"
        >
          <SearchIcon size={14} color="#C4BCB5" />
          <Text className="flex-1 text-sm text-text-2">{search}</Text>
          <ChevronRightIcon size={14} color="#C4BCB5" />
        </Pressable>
      ))}
    </ScrollView>
  );
}
