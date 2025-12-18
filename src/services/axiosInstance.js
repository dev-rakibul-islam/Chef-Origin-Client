import axios from "axios";
import toast from "react-hot-toast";
import auth from "../firebase/firebase.init";
import { signOut } from "firebase/auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 404) {
      toast.error("Resource not found");
    } else if (error.response?.status === 500) {
      toast.error("Server error");
    } else if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      await signOut(auth);
      toast.error("Unauthorized access. Logged out.");
    } else if (error.message === "Network Error") {
      toast.error("Network connection failed");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
