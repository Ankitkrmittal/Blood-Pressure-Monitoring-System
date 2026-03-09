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

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {

    setLoading(true);

    try {

      const res = await bpApi.getBPHistory();

      setHistory(res.data);

      setShowHistory(true);

    } catch (error) {

      console.error("Failed to fetch BP history", error);

    } finally {

      setLoading(false);

    }

  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      await bpApi.updateBP({
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
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

      {/* Fetch BP History Button */}

      <div style={{ marginTop: "30px" }}>

        <button onClick={fetchHistory}>
          View Previous BP Readings
        </button>

      </div>

      {/* BP History Table */}

      {showHistory && (

        <div className="card history-card">

          <h2>Previous BP Readings</h2>

          {loading ? (
            <p>Loading...</p>
          ) : history.length === 0 ? (
            <p>No readings found</p>
          ) : (

            <table>

              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Systolic</th>
                  <th>Diastolic</th>
                  <th>BP</th>
                </tr>
              </thead>

              <tbody>

                {history.map((bp) => (

                  <tr key={bp.id}>
                    <td>{formatDate(bp.createdAt)}</td>
                    <td>{bp.systolic}</td>
                    <td>{bp.diastolic}</td>
                    <td>{bp.systolic}/{bp.diastolic}</td>
                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      )}

    </div>
  );
};

export default Dashboard;