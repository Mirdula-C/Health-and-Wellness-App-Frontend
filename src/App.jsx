import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import FitnessTracking from "./pages/FitnessTracking";
import NutritionPlanning from "./pages/NutritionPlanning";
import GoalTracking from "./pages/GoalTracking";
import Navbar from "./components/Navbar";
import MentalHealth from "./pages/MentalHealth";
import ProgressPage from "./pages/ProgressPage";
import ProfileSettings from "./pages/ProfileSettings";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();

  // ✅ Hide Navbar on authentication-related pages
  const hideNavbarRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const showNavbar = isAuthenticated && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* ✅ Show Navbar only on protected routes */}
      {showNavbar && <Navbar />}

      <Routes>
        {/* ✅ Redirect based on authentication status */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* ✅ Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ✅ Protected Routes Group */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fitness" element={<FitnessTracking />} />
          <Route path="/nutrition" element={<NutritionPlanning />} />
          <Route path="/goals" element={<GoalTracking />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
