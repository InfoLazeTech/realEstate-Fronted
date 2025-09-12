import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
    headers: {
    "Content-Type": "application/json",
  }, // your backend
});

export default axiosInstance;
