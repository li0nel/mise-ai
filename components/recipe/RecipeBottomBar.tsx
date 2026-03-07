import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../ui/Button";
import { useChatStore } from "../../lib/stores/chatStore";

interface RecipeBottomBarProps {
  onAddToShopping?: () => void;
  recipeName: string;
  addedToShopping?: boolean;
}

export function RecipeBottomBar({ onAddToShopping, recipeName, addedToShopping }: RecipeBottomBarProps) {
  const router = useRouter();

  function handleCookNow() {
    useChatStore.getState().sendMessage(`Cook ${recipeName} now`);
    router.push("/");
  }

  return (
    <View className="flex-row gap-2.5 border-t border-border-subtle bg-bg px-5 pb-[34px] pt-3">
      <Button variant="outline" className="flex-1" onPress={handleCookNow}>
        {"Cook Now \uD83D\uDC68\u200D\uD83C\uDF73"}
      </Button>
      {addedToShopping ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-[13px] font-medium text-text-2">{"\u2713"} Added to shopping list</Text>
        </View>
      ) : (
        <Button variant="primary" className="flex-1" onPress={onAddToShopping}>
          Add to Shopping List
        </Button>
      )}
    </View>
  );
}
