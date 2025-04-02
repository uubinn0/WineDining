import React, { useEffect, useRef } from "react";
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
  // 페이지 진입 시간을 기록할 ref
  const enterTimeRef = useRef<number>(Date.now());

  // 페이지 뷰 이벤트 전송 (이미 구현되어 있는 부분)
  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  // 페이지 체류 시간 측정: 경로 변경 시 이전 페이지의 체류 시간을 계산해 전송
  useEffect(() => {
    // 경로 변경 시, 이전 페이지 머문 시간 계산 (밀리초 단위)
    const dwellTime = Date.now() - enterTimeRef.current;
    if (window.gtag) {
      window.gtag("event", "page_dwell_time", {
        page: location.pathname,
        dwell_time_ms: dwellTime,
      });
    }
    // 새로운 페이지 진입 시간 갱신
    enterTimeRef.current = Date.now();
  }, [location]);

  useEffect(() => {
    // 화면 높이 계산
    const setCustomVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--custom-vh", `${vh}px`);
    };

    // 더블 클릭 확대 방지
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
