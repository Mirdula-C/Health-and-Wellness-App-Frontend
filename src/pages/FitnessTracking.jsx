import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "../utils/axiosInstance"; // ✅ Use axiosInstance with automatic token handling
import { FaDumbbell, FaClock, FaRoad, FaCalendarAlt, FaTrash } from "react-icons/fa";

const FitnessTracking = () => {
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch exercises on component mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await axios.get("/fitness/get-exercises");
        setLogs(res.data);
      } catch (error) {
        console.error("Error fetching exercises:", error.response?.data || error);
        alert("Failed to load exercises. Please try again.");
      }
    };

    fetchExercises();
  }, []);

  // ✅ Handle log exercise
  const handleLogExercise = async () => {
    if (!exercise || !duration || !date) {
      alert("Please fill in all required fields!");
      return;
    }

    const newExercise = { exercise, duration, distance, date };

    try {
      const res = await axios.post("/fitness/log-exercise", newExercise);
      setLogs([res.data.exercise, ...logs]);
      
      // ✅ Clear form fields
      setExercise("");
      setDuration("");
      setDistance("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Error logging exercise:", error.response?.data || error);
      alert("Failed to log exercise. Please try again.");
    }
  };

  // ✅ Handle delete exercise
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/fitness/delete-exercise/${id}`);
      setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
    } catch (error) {
      console.error("Error deleting exercise:", error.response?.data || error);
      alert("Failed to delete exercise. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background-3.jpeg')" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-24 p-6 bg-white/20 backdrop-blur-lg border border-white/50 shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold text-black text-center flex items-center justify-center">
          <FaDumbbell className="mr-2 text-blue-600" /> Fitness Tracking
        </h1>
        <p className="text-gray-800 text-center">Log your exercises and track your progress.</p>

        {/* Input Fields */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
            <FaDumbbell className="mr-2 text-blue-500" />
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full bg-transparent text-black placeholder-gray-700 focus:outline-none"
            >
              <option value="">Select Exercise Type</option>
              <option value="Running">🏃 Running</option>
              <option value="Cycling">🚴 Cycling</option>
              <option value="Swimming">🏊 Swimming</option>
              <option value="Strength Training">💪 Strength Training</option>
              <option value="HIIT">🔥 HIIT</option>
              <option value="Yoga">🧘 Yoga</option>
            </select>
          </div>

          <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
            <FaClock className="mr-2 text-green-500" />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-transparent text-black placeholder-gray-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
            <FaRoad className="mr-2 text-yellow-500" />
            <input
              type="number"
              placeholder="Distance (km - optional)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full bg-transparent text-black placeholder-gray-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center border border-black/40 p-3 rounded bg-transparent">
            <FaCalendarAlt className="mr-2 text-red-500" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-black focus:outline-none"
            />
          </div>

          <button
            onClick={handleLogExercise}
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
          >
            ✅ Log Exercise
          </button>
        </div>

        {/* Exercise Logs */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-black">Exercise Logs</h2>
          {logs.length === 0 ? (
            <p className="text-gray-800">No exercises logged yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {logs.map((log) => (
                <li key={log._id} className="p-3 border border-black/40 rounded bg-transparent/20 flex justify-between items-center">

                  {/* ✅ Display all details together with hyphens */}
                   <div className="text-black text-sm md:text-base">
                    <span className="font-semibold">{log.exercise}</span>
                   {" - "}
                   <span>{log.duration} min</span>
                   {log.distance && (
                   <>
                   {" - "}
                  <span>{log.distance} km</span>
                  </>
                  )}
                 {" - "}
                 <span>📅 {log.date}</span>
                 </div>

                  <button
                    onClick={() => handleDelete(log._id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">

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

export default FitnessTracking;
