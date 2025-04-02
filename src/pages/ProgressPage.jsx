import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "chart.js/auto";

const ProgressPage = () => {
  const [exerciseData, setExerciseData] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [moodData, setMoodData] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("You are not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    const fetchProgress = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };  // ✅ Correct token syntax

        const [exerciseRes, nutritionRes, moodRes] = await Promise.all([
          axios.get("https://health-and-wellness-app-backend.onrender.com/api/fitness/progress", { headers }),
          axios.get("https://health-and-wellness-app-backend.onrender.com/api/nutrition/progress", { headers }),
          axios.get("https://health-and-wellness-app-backend.onrender.com/api/mentalhealth/progress", { headers })
        ]);

        console.log("✅ Nutrition Data:", nutritionRes.data);

        setExerciseData(exerciseRes.data);
        setNutritionData(nutritionRes.data);
        setMoodData(moodRes.data);

      } catch (error) {
        console.error("❌ Error fetching progress data:", error);
      }
    };

    fetchProgress();
  }, [token, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="w-full max-w-3xl p-6 rounded-2xl shadow-lg backdrop-blur-md bg-white/10 border border-white/20 mt-20 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center">📊 Progress Overview</h2>

        {/* Exercise Chart */}
        {exerciseData && (
          <div className="p-4 rounded-lg bg-white/20 backdrop-blur-md">
            <h3 className="text-lg font-semibold">🏋️ Weekly Exercise Completion</h3>
            <Bar
              data={{
                labels: exerciseData.labels,       // ✅ Proper labels mapping
                datasets: [
                  {
                    label: "Workouts Completed",
                    data: exerciseData.data,       // ✅ Correct data structure
                    backgroundColor: "#A8E6CF",
                  },
                ],
              }}
            />
          </div>
        )}

        {/* Nutrition Chart */}
        {nutritionData && (
          <div className="p-4 rounded-lg bg-white/20 backdrop-blur-md flex justify-center">
            <div className="w-60">
              <h3 className="text-lg font-semibold text-center">🍎 Nutrition Breakdown</h3>
              <Pie
                data={{
                  labels: nutritionData.labels,          // ✅ Correct labels mapping
                  datasets: [
                    {
                      label: "Nutrient Intake",
                      data: nutritionData.data,         // ✅ Correct data mapping
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                  ],
                }}
              />
            </div>
          </div>
        )}

        {/* Mood Chart */}
        {moodData && (
          <div className="p-4 rounded-lg bg-white/20 backdrop-blur-md">
            <h3 className="text-lg font-semibold">😊 Mood Trends</h3>
            <Line
              data={{
                labels: moodData.labels,          // ✅ Proper labels
                datasets: [
                  {
                    label: "Mood Score",
                    data: moodData.data,          // ✅ Correct data mapping
                    backgroundColor: "#FFD3B6",
                    borderColor: "#FF5733",
                    tension: 0.4,
                  },
                ],
              }}
            />
          </div>
        )}

        <div className="p-4 rounded-lg bg-green-200 text-green-800 font-semibold text-center">
          🎉 Keep up the great work! You're making fantastic progress this week!
        </div>

        <div className="flex justify-around p-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30">
          <Link to="/fitness" className="text-blue-500">🏋️ Fitness Tracking</Link>
          <Link to="/nutrition" className="text-blue-500">🍎 Nutrition Planning</Link>
          <Link to="/goals" className="text-blue-500">🎯 Goal Setting</Link>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
