import { View, TextInput, Pressable } from "react-native";
import { SearchIcon, SendIcon } from "../ui/Icons";

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
  const hasText = !isSearchMode && inputText.length > 0;

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
            style={{ outlineStyle: "none" } as Record<string, unknown>}
          />
        </View>

        {/* Single icon button: search or send depending on state */}
        <Pressable
          onPress={hasText ? handleSend : onSearchToggle}
          className={`h-9 w-9 items-center justify-center rounded-full ${
            isSearchMode || hasText ? "bg-brand" : ""
          }`}
        >
          {hasText ? (
            <SendIcon size={18} color="#FFFFFF" />
          ) : (
            <SearchIcon
              size={18}
              color={isSearchMode ? "#FFFFFF" : "#A8A09A"}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
