import { View, Text } from "react-native";
import type { ChatMessage } from "../../types";
import { BlockRenderer } from "../widgets/BlockRenderer";
import { StreamingBlockRenderer } from "../widgets/StreamingBlockRenderer";
import { SkeletonText } from "../ui/SkeletonWidgets";

interface AiMessageProps {
  message: ChatMessage;
}

export function AiMessage({ message }: AiMessageProps) {
  return (
    <View>
      {/* State 1: Streaming with no content yet — show skeleton text */}
      {message.isStreaming && !message.content ? <SkeletonText /> : null}

      {/* State 2: Content exists — show real text */}
      {message.content ? (
        <Text className="text-sm leading-relaxed text-text">
          {message.content}
        </Text>
      ) : null}

      {/* State 3: Streaming blocks — show skeleton/progressive widgets */}
      {message.streamingBlocks?.map((block, index) => (
        <View key={index} className="mt-3">
          <StreamingBlockRenderer block={block} />
        </View>
      ))}

      {/* State 4: Final blocks — show real widgets */}
      {message.blocks?.map((block, index) => (
        <View key={index} className="mt-3">
          <BlockRenderer block={block} />
        </View>
      ))}
    </View>
  );
}
