import { View, Text } from "react-native";
import type { ChatMessage } from "../../types";

interface AiMessageProps {
  message: ChatMessage;
}

export function AiMessage({ message }: AiMessageProps) {
  return (
    <View>
      <Text className="text-sm leading-relaxed text-text">
        {message.content}
      </Text>
      {/* BlockRenderer will be added by a later bead */}
    </View>
  );
}
