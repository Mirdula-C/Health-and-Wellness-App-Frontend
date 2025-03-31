import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileSettings = () => {
  const navigate = useNavigate();
  
  // ✅ State for Goals, Profile, and Reminders
  const [goals, setGoals] = useState({ steps: "", calories: "" });
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  // ✅ Fetch Profile and Goals on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch Profile
        const profileRes = await axios.get("http://localhost:5000/api/profile/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          name: profileRes.data.name,
          email: profileRes.data.email,
        });

        // Fetch Goals
        const goalsRes = await axios.get("http://localhost:5000/api/goal-tracking/get-goals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (goalsRes.data) {
          setGoals({
            steps: goalsRes.data.steps || "",
            calories: goalsRes.data.calories || "",
          });
        }

      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle Goal Submission
  const handleGoalSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/goal-tracking/set-goal", goals, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Goals updated successfully!");
    } catch (error) {
      console.error("❌ Error updating goals:", error);
      alert("Failed to update goals.");
    }
  };

  // ✅ Handle Profile Update
  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put("http://localhost:5000/api/profile/update-profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  // ✅ Handle CSV Export
  const handleDownloadData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/profile/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "health_data.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error downloading data:", error);
      alert("Failed to download data.");
    }
  };

  // ✅ Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete("http://localhost:5000/api/profile/delete-account", {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Account deleted successfully.");
        localStorage.removeItem("token");
        navigate("/login");
      } catch (error) {
        console.error("❌ Error deleting account:", error);
        alert("Failed to delete account.");
      }
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Handle Reminders Toggle
  const handleRemindersToggle = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/profile/toggle-reminders",
        { enabled: !remindersEnabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRemindersEnabled(!remindersEnabled);
    } catch (error) {
      console.error("❌ Error toggling reminders:", error);
      alert("Failed to toggle reminders.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="w-full max-w-3xl p-6 rounded-2xl shadow-lg backdrop-blur-md bg-white/10 border border-white/20 mt-20 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center">⚙️ Profile & Settings</h2>

        {/* Update Fitness & Nutrition Goals */}
        <div className="p-4 rounded-lg bg-white/20 backdrop-blur-md">
          <h3 className="text-lg font-semibold">🎯 Update Your Goals</h3>
          <input
            type="number"
            placeholder="Daily Step Goal"
            className="w-full p-2 rounded bg-white/50"
            value={goals.steps}
            onChange={(e) => setGoals({ ...goals, steps: e.target.value })}
          />
          <input
            type="number"
            placeholder="Daily Calorie Goal"
            className="w-full p-2 mt-2 rounded bg-white/50"
            value={goals.calories}
            onChange={(e) => setGoals({ ...goals, calories: e.target.value })}
          />
          <button onClick={handleGoalSave} className="mt-2 bg-green-500 text-white p-2 rounded-lg w-full">
            Save Goals
          </button>
        </div>

        {/* Toggle Reminders */}
        <div className="p-4 rounded-lg bg-white/20 backdrop-blur-md flex justify-between">
          <span className="text-lg font-semibold">🔔 Enable Reminders</span>
          <input
            type="checkbox"
            className="toggle-checkbox"
            checked={remindersEnabled}
            onChange={handleRemindersToggle} 
          />
        </div>

        {/* Edit Profile */}
        <div className="p-4 rounded-lg bg-white/20 backdrop-blur-md">
          <h3 className="text-lg font-semibold">📝 Edit Profile</h3>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 rounded bg-white/50"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mt-2 rounded bg-white/50"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <button onClick={handleProfileUpdate} className="mt-2 bg-blue-500 text-white p-2 rounded-lg w-full">
            Update Profile
          </button>
        </div>

        {/* Download Data */}
        <button onClick={handleDownloadData} className="bg-purple-500 text-white p-3 rounded-lg w-full">
          📥 Download Data (CSV)
        </button>

        {/* Delete Account */}
        <button onClick={handleDeleteAccount} className="bg-red-500 text-white p-3 rounded-lg w-full">
          ❌ Delete Account
        </button>

        {/* Logout */}
        <button onClick={handleLogout} className="bg-gray-500 text-white p-3 rounded-lg w-full">
          🚪 Logout
        </button>

        {/* Navigation */}
        <div className="flex justify-center mt-4">
          <Link to="/dashboard" className="text-blue-500">🏠 Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

