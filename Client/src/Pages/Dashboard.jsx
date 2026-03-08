import React, { useState } from "react";
import { bpApi } from "../api/bpApi";
import useAuth from "../context/authContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!systolic || !diastolic) {
      setMessage("Please enter both BP values");
      return;
    }

    try {
      await bpApi.updateBP({
        userId: user.id,
        systolic: Number(systolic),
        diastolic: Number(diastolic),
      });

      setMessage("Blood Pressure Updated Successfully ✅");

      // clear inputs
      setSystolic("");
      setDiastolic("");

    } catch (error) {
      console.error(error);
      setMessage("Failed to update BP ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Hello {user?.name}</h2>

      <h3>Update Blood Pressure</h3>

      <form onSubmit={submitHandler}>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            placeholder="Systolic (e.g. 120)"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            placeholder="Diastolic (e.g. 80)"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
          />
        </div>

        <button type="submit">Update BP</button>
      </form>

      {message && (
        <p style={{ marginTop: "15px" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Dashboard;