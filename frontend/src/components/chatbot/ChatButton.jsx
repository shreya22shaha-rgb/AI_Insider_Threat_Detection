import { FaRobot, FaTimes, FaShieldAlt } from "react-icons/fa";

function ChatButton({ isOpen, onClick }) {
  return (
    <div className="chat-fab-container">
      {!isOpen && (
        <div className="chat-fab-tooltip" role="status" aria-live="polite">
          <div className="chat-fab-tooltip-icon">
            <FaShieldAlt size={14} />
          </div>

          <div className="chat-fab-tooltip-content">
            <div className="chat-fab-tooltip-title">AI Security Assistant</div>
            <div className="chat-fab-tooltip-text">
              Hi! I&apos;m online and ready to help.
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`chat-fab ${!isOpen ? "chat-fab-pulse" : ""}`}
        onClick={onClick}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
      >
        <span className="chat-fab-ring" />
        <span className="chat-fab-inner">
          {isOpen ? <FaTimes size={20} /> : <FaRobot size={22} />}
        </span>
      </button>
    </div>
  );
}

export default ChatButton;