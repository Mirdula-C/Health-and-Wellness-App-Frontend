import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/Logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full backdrop-blur-lg bg-white/20 border-b border-white/30 shadow-lg p-4 flex items-center justify-between z-50">
      {/* Logo */}
      <div className="flex items-center ml-4">
        <img src={logo} alt="Logo" className="h-14 w-auto" />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6 text-black font-medium">
        <Link to="/" className="hover:text-gray-700">🏠 Home</Link>
        <Link to="/fitness" className="hover:text-gray-700">🏋️ Fitness</Link>
        <Link to="/nutrition" className="hover:text-gray-700">🍎 Nutrition</Link>
        <Link to="/mental-health" className="hover:text-gray-700">🧘 Mental Health</Link>
        <Link to="/goals" className="hover:text-gray-700">🎯 Goals</Link>
        <Link to="/progress" className="hover:text-gray-700">📊 Progress</Link>
        <Link to="/profile" className="hover:text-gray-700">⚙️ Profile</Link>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        {menuOpen ? (
          <FiX size={28} className="text-black" onClick={() => setMenuOpen(false)} />
        ) : (
          <FiMenu size={28} className="text-black" onClick={() => setMenuOpen(true)} />
        )}
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-lg p-5 flex flex-col space-y-4 text-black font-medium md:hidden">
          <Link to="/" className="hover:text-gray-700" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
          <Link to="/fitness" className="hover:text-gray-700" onClick={() => setMenuOpen(false)}>🏋️ Fitness</Link>
          <Link to="/nutrition" className="hover:text-gray-700" onClick={() => setMenuOpen(false)}>🍎 Nutrition</Link>
          <Link to="/mental-health" className="hover:text-gray-700" onClick={() => setMenuOpen(false)}>🧘 Mental Health</Link>
          <Link to="/goals" className="hover:text-gray-700" onClick={() => setMenuOpen(false)}>🎯 Goals</Link>
          <Link to="/progress" className="hover:text-gray-700" onClick={() => setMenuOpen(false)}>📊 Progress</Link>
          <Link to="/profile" className="hover:text-gray-700" onClick={() => setMenuOpen(false)}>⚙️ Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
