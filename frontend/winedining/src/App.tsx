import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import GlobalLayout from "./components/Layout/GlobalLayout";
import { fetchUserProfile } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const setCustomVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--custom-vh", `${vh}px`);
    };

    setCustomVh();
    window.addEventListener("resize", setCustomVh);

    // 항상 사용자 정보 요청
    dispatch(fetchUserProfile());

    return () => {
      window.removeEventListener("resize", setCustomVh);
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
