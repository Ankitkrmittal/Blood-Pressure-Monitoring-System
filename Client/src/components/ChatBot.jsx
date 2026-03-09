import React, { useState } from "react";
import { mlApi } from "../api/mlApi";
import "../styles/dashboard.css";

const questions = [
  "Enter your age",
  "Enter your systolic BP",
  "Enter your diastolic BP",
  "Do you smoke? (yes/no)",
  "What is your body weight?",
  "Do you exercise daily? (yes/no)"
];

const ChatBot = () => {

  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    { sender: "bot", text: questions[0] }
  ]);

  const [data, setData] = useState({
    age: "",
    systolic: "",
    diastolic: "",
    smoking: "",
    weight: "",
    exercise: ""
  });

  const convertYesNo = (value) => {
    return value.toLowerCase() === "yes" ? 1 : 0;
  };

  const resetChat = () => {

    setStep(0);
    setInput("");

    setMessages([
      { sender: "bot", text: questions[0] }
    ]);

    setData({
      age: "",
      systolic: "",
      diastolic: "",
      smoking: "",
      weight: "",
      exercise: ""
    });

  };

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    let updatedData = { ...data };

    if (step === 0) updatedData.age = Number(input);
    if (step === 1) updatedData.systolic = Number(input);
    if (step === 2) updatedData.diastolic = Number(input);
    if (step === 3) updatedData.smoking = convertYesNo(input);
    if (step === 4) updatedData.weight = Number(input);
    if (step === 5) updatedData.exercise = convertYesNo(input);

    setData(updatedData);

    let newMessages = [...messages, userMessage];

    if (step < questions.length - 1) {

      const botMessage = {
        sender: "bot",
        text: questions[step + 1]
      };

      newMessages.push(botMessage);

      setMessages(newMessages);
      setStep(step + 1);

    } else {

      try {

        const result = await mlApi.getRecommendation(updatedData);

        const recs = result.data.recommendations;
        const risk = result.data.risk_level;

        const botMessage = {
          sender: "bot",
          risk: risk,
          recommendations: recs
        };

        setMessages([...newMessages, botMessage]);

      } catch (error) {

        console.error("API Error:", error);

        const botMessage = {
          sender: "bot",
          text: "Error getting recommendation. Please try again."
        };

        setMessages([...newMessages, botMessage]);

      }

    }

    setInput("");

  };

  return (

    <div className="chatbot">

      <div className="chat-header">
        <h2>Health Assistant</h2>
        <button className="reset-btn" onClick={resetChat}>
          Reset Chat
        </button>
      </div>

      <div className="chat-window">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "bot" ? "bot-msg" : "user-msg"}
          >

            {msg.text && <p>{msg.text}</p>}

            {msg.recommendations && (
              <div>

                <h4
                  style={{
                    color:
                      msg.risk === "High"
                        ? "red"
                        : msg.risk === "Medium"
                        ? "orange"
                        : "green"
                  }}
                >
                  Risk Level: {msg.risk}
                </h4>

                <ul>
                  {msg.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>

              </div>
            )}

          </div>
        ))}

      </div>

      <div className="chat-input">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
        />

        <button onClick={sendMessage}>Send</button>

      </div>

    </div>
  );
};

export default ChatBot;