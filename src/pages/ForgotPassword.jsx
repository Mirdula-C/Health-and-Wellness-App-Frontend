import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }
      setMessage("Password reset link has been sent to your email.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/background-3.jpeg')" }}
    >
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl rounded-lg w-full max-w-md p-6 md:p-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Forgot Password?</h1>
        <p className="text-sm text-gray-700 mb-4">Enter your email to receive a reset link.</p>
        
        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 border border-white/30 rounded-lg w-full bg-white/40 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition w-full shadow-lg"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-sm text-gray-800 mt-4">
          Remembered your password? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
