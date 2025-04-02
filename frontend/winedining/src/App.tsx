import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import GlobalLayout from "./components/Layout/GlobalLayout";
import { fetchUserProfile } from "./store/slices/authSlice";
import { useLocation } from "react-router-dom";

// gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

function App() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  useEffect(() => {
    // 화면 높이 계산
    const setCustomVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--custom-vh", `${vh}px`);
    };

    // 2. 더블 클릭 확대 방지
    const preventZoom = (e: MouseEvent) => {
      e.preventDefault();
    };

    setCustomVh();
    window.addEventListener("resize", setCustomVh);
    document.addEventListener("dblclick", preventZoom);

    // 항상 사용자 정보 요청
    dispatch(fetchUserProfile());

    return () => {
      window.removeEventListener("resize", setCustomVh);
      document.removeEventListener("dblclick", preventZoom);
    };
  }, [dispatch]);

  return (
    <div>
      <GlobalLayout>
        <AppRouter />
      </GlobalLayout>
    </div>
  );
}

export default App;
