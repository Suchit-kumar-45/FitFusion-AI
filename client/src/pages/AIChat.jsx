import { useState, useRef, useEffect } from "react";
import { askAI } from "../services/aiChatService";
import "../styles/aichat.css";

function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI fitness coach. Ask me anything about fitness, workouts, or nutrition!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) {
      setError("Message cannot be empty");
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await askAI(inputMessage);

      const botMessage = {
        id: messages.length + 2,
        text: response.reply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error sending message");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aichat-container">
      <div className="aichat-header">
        <h1>AI Fitness Coach</h1>
        <p>Your personal fitness companion</p>
      </div>

      <div className="aichat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
          >
            <div className="message-content">{msg.text}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="aichat-input-section">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSendMessage} className="aichat-form">
          <input
            type="text"
            placeholder="Ask me anything about fitness..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            className="aichat-input"
          />

          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="aichat-send-btn"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIChat;
