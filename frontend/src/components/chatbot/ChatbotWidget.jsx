import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";
import "./chatbot.css";
import { getChatbotReply } from "../../services/chatbotApi";

function ChatbotWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "bot",
      text: "👋 Welcome, Admin!\n",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text) => {
    const userMsg = { id: `user-${Date.now()}`, role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const result = await getChatbotReply(text);

    const botMsg = { id: `bot-${Date.now()}`, role: "bot", text: result.reply, timestamp: new Date() };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);

    if (result.navigateTo) {
      setTimeout(() => navigate(result.navigateTo), 600);
    }
  };

  return (
    <>
      <div className={`chat-window-wrapper ${isOpen ? "chat-window-open" : ""}`}>
        {isOpen && (
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            onSend={handleSend}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
    </>
  );
}

export default ChatbotWidget;