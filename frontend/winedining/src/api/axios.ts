import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Changed to use environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

// 개발 환경에서 임시로 토큰 검증 비활성화
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("accessToken");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러 무시하고 응답 전달 (개발 환경용)
    if (error.response && error.response.status === 401) {
      console.warn("Authentication error ignored for development");
      return Promise.resolve({ data: { data: { wines: [] } } });
    }
    console.error("API 요청 오류:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
