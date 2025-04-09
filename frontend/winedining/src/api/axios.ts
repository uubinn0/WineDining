import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // 🧪 개발 중에는 하드코딩된 토큰 사용
    // config.headers.Authorization = `Bearer ${devToken}`;

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
    if (error.response && error.response.status === 401) {
      // console.warn("Authentication error ignored for development");
      return Promise.resolve({ data: { data: { wines: [] } } });
    }
    // console.error("API 요청 오류:", error.response || error.message);
    return Promise.reject(error);
  }
);

export const withdrawUser = async () => {
  const res = await api.post("/api/v1/user/withdrawal");
  return res.data;
};

export default api;
