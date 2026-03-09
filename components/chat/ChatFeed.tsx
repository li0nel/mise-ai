import { useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import type { ChatMessage } from "../../types";
import { UserBubble } from "./UserBubble";
import { AiMessage } from "./AiMessage";
import { useChatStore } from "../../lib/stores/chatStore";

interface ChatFeedProps {
  messages: ChatMessage[];
}

export function ChatFeed({ messages }: ChatFeedProps) {
  const scrollRef = useRef<ScrollView>(null);
  const isStreaming = useChatStore((s) => s.isStreaming);

  // Compute a scroll trigger that reacts to content growth
  const lastMessage = messages[messages.length - 1];
  const lastContentLength = lastMessage?.content.length ?? 0;
  const lastBlockCount =
    (lastMessage?.streamingBlocks?.length ?? 0) +
    (lastMessage?.blocks?.length ?? 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length, isStreaming, lastContentLength, lastBlockCount]);

  return (
    <ScrollView
      ref={scrollRef}
      className="flex-1 px-4 pt-3"
      contentContainerClassName="pb-4"
      keyboardShouldPersistTaps="handled"
    >
      {messages.map((message) => (
        <View key={message.id} className="mb-4">
          {message.role === "user" ? (
            <UserBubble content={message.content} />
          ) : (
            <AiMessage message={message} />
          )}
        </View>
      ))}
    </ScrollView>
  );
}
