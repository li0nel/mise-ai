import { View, TextInput, Pressable, Text } from "react-native";

interface ChatInputBarProps {
  onSend: (text: string) => void;
  onSearchToggle: () => void;
  isSearchMode: boolean;
  searchText: string;
  onSearchTextChange: (text: string) => void;
}

export function ChatInputBar({
  onSend,
  onSearchToggle,
  isSearchMode,
  searchText,
  onSearchTextChange,
}: ChatInputBarProps) {
  const inputText = searchText.trim();
  const showSend = !isSearchMode && inputText.length > 0;

  function handleSend() {
    if (inputText.length === 0) return;
    onSend(inputText);
    onSearchTextChange("");
  }

  return (
    <View className="bg-bg px-4 pb-6 pt-2">
      <View className="flex-row items-center gap-2">
        <View
          className={`h-11 flex-1 flex-row items-center rounded-2xl border px-4 ${
            isSearchMode ? "border-brand" : "border-border"
          }`}
        >
          <TextInput
            className="flex-1 text-sm text-text"
            placeholder={
              isSearchMode ? "Search recipes..." : "Ask about recipes..."
            }
            placeholderTextColor="#A8A09A"
            value={searchText}
            onChangeText={onSearchTextChange}
            onSubmitEditing={handleSend}
            returnKeyType={isSearchMode ? "search" : "send"}
          />
        </View>

        {/* Search toggle button */}
        <Pressable
          onPress={onSearchToggle}
          className={`h-9 w-9 items-center justify-center rounded-full ${
            isSearchMode ? "bg-brand" : ""
          }`}
        >
          <Text className={isSearchMode ? "text-text-inv" : "text-text-3"}>
            {"\u{1F50D}"}
          </Text>
        </Pressable>

        {/* Send button — only visible when text entered in chat mode */}
        {showSend && (
          <Pressable
            onPress={handleSend}
            className="h-9 w-9 items-center justify-center rounded-full bg-brand"
          >
            <Text className="text-sm font-bold text-text-inv">
              {"\u2191"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
