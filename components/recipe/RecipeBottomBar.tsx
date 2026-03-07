import { View } from "react-native";
import { Button } from "../ui/Button";

interface RecipeBottomBarProps {
  onAddToShopping?: () => void;
}

export function RecipeBottomBar({ onAddToShopping }: RecipeBottomBarProps) {
  return (
    <View className="flex-row gap-2.5 border-t border-border-subtle bg-bg px-5 pb-[34px] pt-3">
      <Button variant="outline" className="flex-1">
        {"Cook Now \uD83D\uDC68\u200D\uD83C\uDF73"}
      </Button>
      <Button variant="primary" className="flex-1" onPress={onAddToShopping}>
        Add to Shopping List
      </Button>
    </View>
  );
}
