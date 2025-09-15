import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL:"https://real-estate-backend-alpha-eight.vercel.app/api",
    headers: {
    "Content-Type": "application/json",
  }, // your backend
});

export default axiosInstance;
