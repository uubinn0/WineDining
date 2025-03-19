import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api-url.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 요청 오류:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
