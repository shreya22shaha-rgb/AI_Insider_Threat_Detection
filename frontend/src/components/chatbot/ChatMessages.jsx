import { useEffect, useRef } from "react";
import ChatMessageBubble from "./ChatMessageBubble";

function ChatMessages({ messages, isTyping }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  return (
    <div className="chat-messages" ref={containerRef}>
      {messages.map((msg) => (
        <ChatMessageBubble
          key={msg.id}
          role={msg.role}
          text={msg.text}
          timestamp={msg.timestamp}
        />
      ))}

      {isTyping && (
        <ChatMessageBubble
          role="bot"
          isLoading
          loadingText="Analyzing security data..."
          timestamp={new Date()}
        />
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;