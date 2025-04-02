import axios from "axios";

const instance = axios.create({
  baseURL: "https://health-and-wellness-app-backend.onrender.com/api",
});

// ✅ Automatically include token in headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Automatically redirect to login if token expires
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // ✅ Clear the expired token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";  // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default instance;
