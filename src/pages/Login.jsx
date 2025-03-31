import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png"; // Ensure this path is correct

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login Successful:", data);

      // ✅ Store token in localStorage before navigation
      localStorage.setItem("token", data.token);

      // ✅ Delay navigation slightly to allow localStorage update
      setTimeout(() => {
        navigate("/dashboard");
      }, 100); // 100ms delay ensures token is stored properly

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/background-3.jpeg')" }} // Ensure background image is in 'public/'
    >
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-lg w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start p-6 md:p-10">
        
        {/* Left Section - Logo & Welcome Message */}
        <div className="md:w-1/2 flex flex-col items-center text-center p-6">
          <img src={logo} alt="Health & Wellness Logo" className="w-24 md:w-32 mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-black">Welcome Back!</h2>
          <p className="text-black text-sm md:text-base">Track. Improve. Achieve.</p>
        </div>

        {/* Right Section - Login Form */}
        <div className="md:w-1/2 w-full p-6">
          <h1 className="text-xl font-bold text-center mb-4 text-black">Login</h1>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
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

            <div className="text-right">
              <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition w-full shadow-lg"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-3 text-black">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
