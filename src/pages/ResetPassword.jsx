import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams(); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/background-3.jpeg')" }} 
    >
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-lg w-full max-w-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-black">Reset Password</h2>
        <p className="text-black text-sm mb-4">Enter your new password below.</p>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New Password"
            className="p-3 border border-white/30 rounded-md w-full bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="p-3 border border-white/30 rounded-md w-full bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition w-full shadow-lg"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
