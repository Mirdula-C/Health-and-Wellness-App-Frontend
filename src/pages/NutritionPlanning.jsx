import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaFire, FaWeight, FaPlus, FaTrash, FaHome, FaChartLine, FaCalendar } from "react-icons/fa";

const NutritionPlanning = () => {
  const [foodItem, setFoodItem] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Fetch nutrition logs on page load
  useEffect(() => {
    const fetchNutritionLogs = async () => {
      if (!token) {
        alert("You are not logged in. Redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/nutrition/view-nutrition", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLogs(res.data);
      } catch (error) {
        console.error("Error fetching nutrition logs:", error);

        if (error.response?.status === 401) {
          alert("Session expired. Redirecting to login.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          alert("Failed to fetch nutrition logs. Please try again.");
        }
      }
    };

    fetchNutritionLogs();
  }, [token, navigate]);

  // ✅ Log a new meal
  const handleLogMeal = async () => {
    if (!token) {
      alert("You are not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    if (!foodItem || !calories || !protein || !carbs || !fats) {
      alert("Please fill in all the fields.");
      return;
    }

    const newMeal = { foodItem, calories, protein, carbs, fats, date };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/nutrition/log-meal",
        newMeal,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLogs([res.data.meal, ...logs]);

      // Clear form fields
      setFoodItem("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFats("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Error logging meal:", error);
      alert("Failed to log meal. Please try again.");
    }
  };

  // ✅ Delete a meal
  const handleDeleteMeal = async (id) => {
    if (!token) {
      alert("You are not logged in. Redirecting to login.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/nutrition/delete-meal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
    } catch (error) {
      console.error("Error deleting meal:", error);
      alert("Failed to delete meal. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background-3.jpeg')" }}>
      <Navbar />

      <div className="max-w-4xl mx-auto mt-24 p-6 bg-white/20 backdrop-blur-lg border border-white/50 shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold text-black text-center flex items-center justify-center">
          <FaUtensils className="mr-2 text-orange-600" /> Nutrition 
        </h1>
        <p className="text-gray-800 text-center">Log your meals and track your nutrition.</p>

        {/* Input Fields */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
            <FaCalendar className="mr-2 text-purple-500" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-black placeholder-gray-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
            <FaUtensils className="mr-2 text-orange-500" />
            <input
              type="text"
              placeholder="Food Item"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              className="w-full bg-transparent text-black placeholder-gray-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
              <FaFire className="mr-2 text-red-500" />
              <input
                type="number"
                placeholder="Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-transparent text-black placeholder-gray-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
              <FaWeight className="mr-2 text-blue-500" />
              <input
                type="number"
                placeholder="Protein (g)"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-transparent text-black placeholder-gray-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
              <FaWeight className="mr-2 text-green-500" />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full bg-transparent text-black placeholder-gray-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
              <FaWeight className="mr-2 text-yellow-500" />
              <input
                type="number"
                placeholder="Fats (g)"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                className="w-full bg-transparent text-black placeholder-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleLogMeal}
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Log Meal
          </button>
        </div>

        {/* Meal Logs */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-black">Meal Logs</h2>
          {logs.length === 0 ? (
            <p className="text-gray-800">No meals logged yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {logs.map((log) => (
                <li key={log._id} className="p-3 border border-black/40 rounded bg-white/20 flex justify-between items-center">
                  <div>
                    {`${log.foodItem} - ${log.calories} kcal - ${log.protein}g protein - ${log.carbs}g carbs - ${log.fats}g fats - 📅 ${log.date}`}
                  </div>
                  <button onClick={() => handleDeleteMeal(log._id)} className="text-red-500 hover:text-red-700 ml-2">
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
        <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            🏠 Back to Home
          </button>
          <button
            onClick={() => navigate("/progress")}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            📊 View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanning;
