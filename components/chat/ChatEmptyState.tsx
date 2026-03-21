import { View, Text, TextInput, ScrollView } from "react-native";
import { SearchIcon } from "../ui/Icons";

interface ChatEmptyStateProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchSubmit: (query: string) => void;
  onSearchFocus?: () => void;
}

export function ChatEmptyState({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSearchFocus,
}: ChatEmptyStateProps) {
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
      {/* Tagline */}
      <Text className="text-[22px] font-extrabold leading-tight tracking-tight text-text">
        Find any dish.{"\n"}
        <Text className="text-brand">Make it yours.</Text>
      </Text>

      {/* Search bar */}
      <View className="mt-5 h-12 flex-row items-center gap-2.5 rounded-full border-[1.5px] border-border bg-bg-surface px-4 shadow-sm">
        <SearchIcon size={18} color="#A8A09A" />
        <TextInput
          className="flex-1 text-[15px] text-text"
          placeholder="Paste a recipe URL\u2026"
          placeholderTextColor="#A8A09A"
          value={searchQuery}
          onChangeText={onSearchChange}
          onSubmitEditing={handleSubmit}
          onFocus={onSearchFocus}
          returnKeyType="go"
          style={{ outlineStyle: "none" } as Record<string, unknown>}
        />
      </View>
    </ScrollView>
  );
}
