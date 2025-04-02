import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSmile, FaFrown, FaMeh, FaArrowLeft, FaBook, FaBrain, FaSave, FaCalendarAlt, 
  FaGrin, FaSurprise, FaAngry, FaTrash
} from "react-icons/fa";

const MentalHealth = () => {
  const [mood, setMood] = useState(3);
  const [journalEntry, setJournalEntry] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Set current date on component mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setEntryDate(today);
  }, []);

  // ✅ Fetch past entries from backend
  useEffect(() => {
    if (!token) {
      alert("Please log in.");
      navigate("/login");
      return;
    }

    const fetchEntries = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get("https://health-and-wellness-app-backend.onrender.com/api/mentalhealth/", {   // ✅ Fixed route
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("API response:", res.data); 
        setEntries(res.data);
      } catch (error) {
        console.error("❌ Error fetching entries:", error);
        setError("Failed to fetch past entries.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [navigate, token]);

  // ✅ Log a new mental health entry
  const handleLogEntry = async () => {
    if (!journalEntry.trim()) {
      alert("Please write a journal entry.");
      return;
    }

    try {
      const res = await axios.post(
        "https://health-and-wellness-app-backend.onrender.com/api/mentalhealth",     // ✅ Fixed route
        { mood, journalEntry, date: entryDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEntries([res.data.entry, ...entries]);
      setJournalEntry("");
    } catch (error) {
      console.error("❌ Error logging entry:", error);
      alert("Failed to log entry.");
    }
  };

  // ✅ Delete an entry by ID with confirmation
  const handleDeleteEntry = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://health-and-wellness-app-backend.onrender.com/api/mentalhealth/${id}`, {  // ✅ Fixed route
        headers: { Authorization: `Bearer ${token}` }
      });

      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (error) {
      console.error("❌ Error deleting entry:", error);
      alert("Failed to delete entry.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background-3.jpeg')", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}
    >
      <Navbar />
      <div className="max-w-4xl mx-auto mt-24 p-6 bg-white/30 backdrop-blur-lg border border-white/50 shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold text-black text-center flex items-center justify-center">
          <FaBrain className="mr-2 text-blue-600" /> Mental Health 
        </h1>
        <p className="text-gray-800 text-center">Track your mood, reflect, and practice mindfulness.</p>

        {/* Mood Tracker */}
        <div className="mt-6 p-4 border border-black/40 rounded bg-transparent/40 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-black flex items-center">
            <FaSmile className="mr-2 text-purple-600" /> Mood Tracker
          </h2>
          <p className="text-gray-700">How are you feeling today?</p>
          <div className="flex justify-between text-4xl mt-4 p-3 border border-black/40 rounded bg-transparent/50 rounded-lg">
            <FaAngry className={`cursor-pointer ${mood === 0 ? "text-red-700 scale-110" : "text-gray-500 hover:scale-110"}`} onClick={() => setMood(0)} />
            <FaFrown className={`cursor-pointer ${mood === 1 ? "text-red-500 scale-110" : "text-gray-500 hover:scale-110"}`} onClick={() => setMood(1)} />
            <FaMeh className={`cursor-pointer ${mood === 2 ? "text-yellow-500 scale-110" : "text-gray-500 hover:scale-110"}`} onClick={() => setMood(2)} />
            <FaSmile className={`cursor-pointer ${mood === 3 ? "text-green-500 scale-110" : "text-gray-500 hover:scale-110"}`} onClick={() => setMood(3)} />
            <FaGrin className={`cursor-pointer ${mood === 4 ? "text-blue-500 scale-110" : "text-gray-500 hover:scale-110"}`} onClick={() => setMood(4)} />
            <FaSurprise className={`cursor-pointer ${mood === 5 ? "text-purple-500 scale-110" : "text-gray-500 hover:scale-110"}`} onClick={() => setMood(5)} />
          </div>
          <p className="text-center mt-2 font-semibold text-lg">{["Angry", "Sad", "Neutral", "Happy", "Excited", "Surprised"][mood]}</p>
        </div>

        {/* Journal */}
        <div className="mt-6 p-4 mb-6 border border-black/40 rounded bg-transparent/40 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-black flex items-center mb-2">
            <FaBook className="mr-2 text-blue-500" /> Gratitude Journal
          </h2>
          <input 
            type="date" 
            className="w-full p-2 mb-2 border border-black/40 rounded bg-transparent/70 text-black focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={entryDate} 
            onChange={(e) => setEntryDate(e.target.value)}
          />
          <textarea
            placeholder="Write something you're grateful for..."
            className="w-full p-3 border border-black/40 rounded bg-transparent/70 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
          ></textarea>
          <button 
            onClick={handleLogEntry}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-green-600 transition"
          >
            <FaSave className="mr-2" /> Save Entry
          </button>
        </div>
                
                {/* 🎥 Meditation Video */}
          <div className="p-4 border border-black/40 rounded bg-transparent/40 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black flex items-center mb-2">
              🌿 Meditation Video
            </h2>
            <div className="w-full aspect-w-16 aspect-h-9">
              <iframe 
                className="w-full h-72 rounded-lg shadow-lg" 
                src="https://www.youtube.com/embed/inpok4MKVLM" 
                title="Meditation Video" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

       {/* Past Entries */}
<div className="mt-6 p-4 border border-black/40 rounded bg-transparent/40 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-black flex items-center">
    <FaBook className="mr-2 text-orange-500" /> Past Entries
  </h2>
  {loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p className="text-red-600">{error}</p>
  ) : entries.length > 0 ? (
    entries.map((entry) => (
      <div key={entry._id} className="flex justify-between items-center p-3 border border-black/40 rounded bg-transparent/70 rounded-lg mt-2 shadow">
        <div className="text-black text-sm md:text-base">
          <strong>{new Date(entry.date).toLocaleDateString()}</strong>
          {" - "}
          <span>{entry.journalEntry || entry.journal || "No journal available"}</span>
        </div>
        <FaTrash 
          className="text-red-500 cursor-pointer hover:text-red-700" 
          onClick={() => handleDeleteEntry(entry._id)} 
        />
      </div>
    ))
  ) : (
    <p>No past entries yet.</p>
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

export default MentalHealth;
