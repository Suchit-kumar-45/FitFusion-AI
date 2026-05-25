import { useState } from "react";

import { askAI } from "../services/aiChatService";

import "../styles/sections.css";

function AIChatSection() {
  const [message, setMessage] =
    useState("");

  const [reply, setReply] = useState("");

  const handleAsk = async () => {
    const response = await askAI(message);

    setReply(response.reply);
  };

  return (
    <div className="section-card">
      <h2>AI Fitness Coach</h2>

      <input
        type="text"
        placeholder="Ask anything about fitness"
        onChange={(e) =>
          setMessage(e.target.value)
        }
      />

      <button onClick={handleAsk}>
        Ask AI
      </button>

      <p>{reply}</p>
    </div>
  );
}

export default AIChatSection;