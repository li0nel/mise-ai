import { useMemo } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { SearchIcon, ClockIcon } from "../ui/Icons";
import { getQuickPicks } from "../../lib/search/dishCatalogue";

interface ChatEmptyStateProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchSubmit: (query: string) => void;
  onDishSelect: (dishName: string) => void;
}

export function ChatEmptyState({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onDishSelect,
}: ChatEmptyStateProps) {
  const quickPicks = useMemo(() => getQuickPicks(5), []);

  const handleSubmit = () => {
    const q = searchQuery.trim();
    if (q.length > 0) onSearchSubmit(q);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-8"
      keyboardShouldPersistTaps="handled"
    >
      {/* Search bar */}
      <View className="mx-4 mt-3">
        <View className="h-12 flex-row items-center gap-3 rounded-2xl border border-border px-4">
          <SearchIcon size={18} color="#A8A09A" />
          <TextInput
            className="flex-1 text-sm text-text"
            placeholder="Search a recipe or paste a URL..."
            placeholderTextColor="#A8A09A"
            value={searchQuery}
            onChangeText={onSearchChange}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            style={{ outlineStyle: "none" } as Record<string, unknown>}
          />
        </View>
      </View>

      {/* Tagline */}
      <Text className="mt-4 text-center text-[15px] text-text-2">
        Find any dish. Make it yours.
      </Text>

      {/* Quick pick chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-5"
        contentContainerClassName="gap-2 px-4"
      >
        {quickPicks.map((dish) => (
          <Pressable
            key={dish.name}
            onPress={() => onDishSelect(dish.name)}
            className="rounded-full border border-border px-4 py-2"
          >
            <Text className="text-[13px] text-text-2">
              {dish.emoji} {dish.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Recent searches */}
      <View className="mt-8 px-4">
        <Text className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-3">
          Recent Searches
        </Text>
        {["Chicken curry", "Pasta carbonara", "Pad Thai"].map((search) => (
          <Pressable
            key={search}
            onPress={() => onDishSelect(search)}
            className="flex-row items-center gap-3 py-2.5"
          >
            <ClockIcon size={16} color="#A8A09A" />
            <Text className="text-sm text-text">{search}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
