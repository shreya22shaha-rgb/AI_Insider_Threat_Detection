import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatQuickActions from "./ChatQuickActions";

function ChatWindow({ messages, isTyping, onSend, onClose }) {
  const showQuickActions = messages.length <= 1 && !isTyping;
  const showWelcomeCard = messages.length <= 1;

  return (
    <div className="chat-window">
      <ChatHeader onClose={onClose} />

      {showWelcomeCard && (
        <div className="chat-welcome-card">
          <div className="chat-welcome-badge">AI Assistant</div>
          <h3 className="chat-welcome-title">Hello! I’m your AI Security Assistant.</h3>
          <p className="chat-welcome-text">
            I can help you review dashboard activity, security health, dynamic
            risk scores, alerts, users, and reports.
          </p>
        </div>
      )}

      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatQuickActions onSelect={onSend} visible={showQuickActions} />
      <ChatInput onSend={onSend} disabled={isTyping} />

      <div className="chat-footer">
        Powered by AI Threat Detection Engine
      </div>
    </div>
  );
}

export default ChatWindow;