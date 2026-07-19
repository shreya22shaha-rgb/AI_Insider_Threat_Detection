import { FaShieldAlt, FaTimes } from "react-icons/fa";

function ChatHeader({ onClose }) {
  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <div className="chat-header-icon">
          <FaShieldAlt size={15} />
        </div>
        <div>
          <p className="chat-header-title">AI Security Assistant</p>
          <p className="chat-header-subtitle">
            <span className="chat-online-dot"></span>
            Online
          </p>
        </div>
      </div>

      <button
        type="button"
        className="chat-close-btn"
        onClick={onClose}
        aria-label="Close chat"
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
}

export default ChatHeader;