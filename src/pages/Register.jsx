import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png"; 

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://health-and-wellness-app-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("Registration Successful:", data);
      navigate("/login"); 

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/background-3.jpeg')" }}
    >
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-lg w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start p-6 md:p-10">
        
        {/* Left Section - Logo & Welcome Message (Moved Down) */}
        <div className="md:w-1/2 flex flex-col items-center text-center p-6 pt-10 md:pt-16">
          <img src={logo} alt="Health & Wellness Logo" className="w-24 md:w-32 mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-black">Join Us!</h2>
          <p className="text-black text-sm md:text-base">Start your wellness journey today.</p>
        </div>

        {/* Right Section - Register Form */}
        <div className="md:w-1/2 w-full p-6">
          <h1 className="text-xl font-bold text-center mb-4 text-black">Register</h1>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Full Name"
              className="p-3 border border-white/30 rounded-md w-full bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 border border-white/30 rounded-md w-full bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 border border-white/30 rounded-md w-full bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Register
            </button>
          </form>

          <p className="text-sm text-center mt-3 text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
