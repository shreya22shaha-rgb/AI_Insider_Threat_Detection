import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-bar">
      <input
        type="text"
        className="chat-input-field"
        placeholder="Ask about risk score, security health, dashboard..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        type="button"
        className="chat-send-btn"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <FaPaperPlane size={14} />
      </button>
    </div>
  );
}

export default ChatInput;