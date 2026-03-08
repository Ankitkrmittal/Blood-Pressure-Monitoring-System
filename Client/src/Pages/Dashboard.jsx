import React, { useState } from "react";
import { bpApi } from "../api/bpApi";
import ChatBot from "../components/ChatBot";
import useAuth from "../context/authContext";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await bpApi.updateBP({
        userId: user.id,
        systolic: Number(systolic),
        diastolic: Number(diastolic),
      });

      setMessage("BP Saved Successfully ✅");

      setSystolic("");
      setDiastolic("");

    } catch (error) {
      setMessage("Failed to update BP");
    }
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>Health Monitoring Dashboard</h1>
        <p>Welcome {user?.name}</p>
      </div>

      <div className="dashboard-grid">

        {/* BP Update Card */}
        <div className="card">

          <h2>Update Blood Pressure</h2>

          <form onSubmit={submitHandler}>

            <input
              type="number"
              placeholder="Systolic"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
            />

            <input
              type="number"
              placeholder="Diastolic"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
            />

            <button type="submit">Save BP</button>

          </form>

          {message && <p className="message">{message}</p>}

        </div>

        {/* Chatbot */}
        <ChatBot />

      </div>

    </div>
  );
};

export default Dashboard;