function formatTime(date) {
  if (!date) return "";
  const safeDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(safeDate.getTime())) return "";

  return safeDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatMessageBubble({ role, text, timestamp, isLoading, loadingText }) {
  const isUser = role === "user";

  return (
    <div className={`chat-msg-row ${isUser ? "chat-msg-row-user" : "chat-msg-row-bot"}`}>
      {!isUser && (
        <div className="chat-msg-avatar chat-msg-avatar-bot">AI</div>
      )}

      <div className={`chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-bot"}`}>
        {isLoading ? (
          <div className="chat-typing-wrap">
            <span className="chat-typing-label">
              {loadingText || "Analyzing security data..."}
            </span>

            <div className="chat-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="chat-bubble-time">{formatTime(timestamp)}</span>
          </div>
        ) : (
          <>
            <p className="chat-bubble-text">{text}</p>
            <span className="chat-bubble-time">{formatTime(timestamp)}</span>
          </>
        )}
      </div>

      {isUser && (
        <div className="chat-msg-avatar chat-msg-avatar-user">U</div>
      )}
    </div>
  );
}

export default ChatMessageBubble;