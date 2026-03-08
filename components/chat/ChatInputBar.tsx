import { useEffect, useRef } from "react";
import { View, TextInput, Pressable } from "react-native";
import { SearchIcon, SendIcon } from "../ui/Icons";
import { useUrlPreviewStore } from "../../lib/stores/urlPreviewStore";

interface ChatInputBarProps {
  onSend: (text: string) => void;
  onSearchToggle: () => void;
  isSearchMode: boolean;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  isSendDisabled?: boolean;
}

export function ChatInputBar({
  onSend,
  onSearchToggle,
  isSearchMode,
  searchText,
  onSearchTextChange,
  isSendDisabled = false,
}: ChatInputBarProps) {
  const inputText = searchText.trim();
  const hasText = !isSearchMode && inputText.length > 0;
  const canSend = hasText && !isSendDisabled;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced URL detection
  useEffect(() => {
    if (isSearchMode) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      useUrlPreviewStore.getState().detectAndExtract(searchText);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText, isSearchMode]);

  function handleSend() {
    if (!canSend) return;
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
          onPress={canSend ? handleSend : hasText ? undefined : onSearchToggle}
          className={`h-9 w-9 items-center justify-center rounded-full ${
            isSearchMode
              ? "bg-brand"
              : canSend
                ? "bg-brand"
                : hasText
                  ? "bg-brand/50"
                  : ""
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
