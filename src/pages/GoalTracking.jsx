import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaWalking, FaDumbbell, FaTint, FaFire, FaArrowLeft, FaChartBar } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const GoalTracking = () => {
  const [steps, setSteps] = useState("");
  const [exercise, setExercise] = useState("");
  const [calories, setCalories] = useState("");
  const [water, setWater] = useState("");
  const [progress, setProgress] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Fetch Goals on Component Mount
  useEffect(() => {
    if (!token) {
      alert("You are not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    const fetchGoals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/goal-tracking/get-goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgress(res.data);
      } catch (err) {
        console.error("Error fetching goals:", err);
        if (err.response && err.response.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        }
      }
    };

    fetchGoals();
  }, [token, navigate]);

  // ✅ Handle Set Goals
  const handleSetGoals = async () => {
    if (!token) {
      alert("You are not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    const newGoals = { steps, exercise, calories, water };

    try {
      await axios.post("http://localhost:5000/api/goal-tracking/set-goal", newGoals, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Goals updated successfully!");

      // 🔥 Immediately refresh progress after setting goals
      const res = await axios.get("http://localhost:5000/api/goal-tracking/get-goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(res.data);

    } catch (error) {
      console.error("Error setting goals:", error);
      alert("Failed to set goals. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/background-3.jpeg')" }}
    >
      <Navbar />
      <div className="max-w-3xl w-full bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl p-8 rounded-2xl mt-24">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center flex items-center justify-center">
          <FaChartBar className="mr-3 text-purple-600" /> Goal Tracking
        </h1>
        <p className="text-gray-700 text-center mt-2">Set and track your fitness goals.</p>

        {/* Goal Inputs */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center border border-black-300 p-3 rounded-lg bg-transparent shadow-sm">
            <FaWalking className="mr-3 text-blue-500 text-lg" />
            <input
              type="number"
              placeholder="Daily Step Count"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center border border-black-300 p-3 rounded-lg bg-transparent shadow-sm">
            <FaDumbbell className="mr-3 text-green-500 text-lg" />
            <input
              type="number"
              placeholder="Weekly Exercise Sessions"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center border border-black-300 p-3 rounded-lg bg-transparent shadow-sm">
            <FaFire className="mr-3 text-red-500 text-lg" />
            <input
              type="number"
              placeholder="Daily Calorie Intake Goal"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center border border-black-300 p-3 rounded-lg bg-transparent shadow-sm">
            <FaTint className="mr-3 text-blue-400 text-lg" />
            <input
              type="number"
              placeholder="Water Intake (liters)"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSetGoals}
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md text-lg flex items-center justify-center"
          >
            ✅ Set Goals
          </button>
        </div>

        {/* Progress Chart */}
        {progress && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Goal Progress</h2>
            <Bar
              data={{
                labels: ["Steps", "Exercise", "Calories", "Water"],
                datasets: [
                  {
                    label: "Progress",
                    data: [progress.steps, progress.exercise, progress.calories, progress.water],
                    backgroundColor: ["#3B82F6", "#10B981", "#EF4444", "#06B6D4"],
                    borderRadius: 10,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
        <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalTracking;
