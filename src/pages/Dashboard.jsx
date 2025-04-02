import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "../utils/axiosInstance"; 
import {
  FaChartLine,
  FaUtensils,
  FaHeart,
  FaLightbulb,
  FaAngleRight,
} from "react-icons/fa";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    fitness: { totalDuration: 0 }, 
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }, 
    mentalHealth: { averageMood: "N/A" },  
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch weekly dashboard data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/dashboard/week"); 
        console.log("Weekly Dashboard Data:", response.data);

        if (response.status === 200) {
          setDashboardData({
            fitness: {
              totalDuration: response.data.fitness.totalDuration || 0,
            },
            nutrition: {
              calories: response.data.nutrition.calories || 0,
              protein: response.data.nutrition.protein || 0,
              carbs: response.data.nutrition.carbs || 0,
              fat: response.data.nutrition.fat || 0,
            },
            mentalHealth: {
              averageMood: response.data.mentalHealth.averageMood || "N/A",
            }
          });
        }
      } catch (error) {
        console.error("Error loading weekly dashboard data:", error);
        setError("Failed to load weekly data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-32">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-32">
        {error}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background-3.jpeg')" }}
    >
      <Navbar />

      <div className="max-w-5xl mx-auto mt-24 p-8 bg-white/20 backdrop-blur-lg border border-white/50 shadow-xl rounded-lg">
        
        {/* ✅ Welcome Section */}
        <h1 className="text-3xl font-bold text-black text-center">
          🏥 Welcome To Home Page
        </h1>
        <p className="text-gray-800 text-center">
          Track your weekly fitness, nutrition, and mental health progress.
        </p>

        {/* ✅ Data Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          {/* ✅ Fitness Weekly Duration */}
          <div className="p-6 bg-white/20 border border-black/40 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="flex items-center">
              <FaChartLine className="text-blue-500 text-3xl mr-3" />
              <div>
                <h2 className="text-xl font-bold text-black">Fitness (Week)</h2>
                <p className="text-gray-700">
                  Total Duration: {dashboardData.fitness.totalDuration} mins
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/fitness")}
              className="mt-4 w-full flex items-center justify-center text-blue-600 hover:text-blue-800"
            >
              Go to Fitness <FaAngleRight className="ml-2" />
            </button>
          </div>

          {/* ✅ Nutrition Weekly Totals */}
          <div className="p-6 bg-white/20 border border-black/40 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="flex items-center">
              <FaUtensils className="text-green-500 text-3xl mr-3" />
              <div>
                <h2 className="text-xl font-bold text-black">Nutrition (Week)</h2>
                <p className="text-gray-700">Calories: {dashboardData.nutrition.calories} kcal</p>
                <p className="text-gray-700">Protein: {dashboardData.nutrition.protein} g</p>
                <p className="text-gray-700">Carbs: {dashboardData.nutrition.carbs} g</p>
                <p className="text-gray-700">Fat: {dashboardData.nutrition.fat} g</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/nutrition")}
              className="mt-4 w-full flex items-center justify-center text-blue-600 hover:text-blue-800"
            >
              Go to Nutrition <FaAngleRight className="ml-2" />
            </button>
          </div>

          {/* ✅ Mental Health Weekly Average Mood */}
          <div className="p-6 bg-white/20 border border-black/40 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="flex items-center">
              <FaHeart className="text-red-500 text-3xl mr-3" />
              <div>
                <h2 className="text-xl font-bold text-black">Mental Health (Week)</h2>
                <p className="text-gray-700">
                  Avg. Mood: {dashboardData.mentalHealth.averageMood}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/mental-health")}
              className="mt-4 w-full flex items-center justify-center text-blue-600 hover:text-blue-800"
            >
              Go to Mental Health <FaAngleRight className="ml-2" />
            </button>
          </div>
        </div>

        {/* ✅ Motivational Section */}
        <div className="mt-10 p-6 bg-white/20 border border-black/40 rounded-lg shadow-lg text-center">
          <FaLightbulb className="text-yellow-500 text-4xl mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-black">💡 Motivational Tip</h2>
          <p className="text-gray-800">
            "Stay consistent! Small progress each day leads to big results."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
