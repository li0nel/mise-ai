import { View, Text } from "react-native";
import type { ChatMessage } from "../../types";
import { BlockRenderer } from "../widgets/BlockRenderer";

interface AiMessageProps {
  message: ChatMessage;
}

export function AiMessage({ message }: AiMessageProps) {
  return (
    <View>
      {message.content ? (
        <Text className="text-sm leading-relaxed text-text">
          {message.content}
        </Text>
      ) : null}
      {message.blocks?.map((block, index) => (
        <View key={index} className="mt-3">
          <BlockRenderer block={block} />
        </View>
      ))}
    </View>
  );
}
