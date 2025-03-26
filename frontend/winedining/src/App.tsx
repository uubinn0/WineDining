import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import GlobalLayout from "./components/Layout/GlobalLayout";

function App() {
  useEffect(() => {
    const setCustomVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--custom-vh", `${vh}px`);
    };

    setCustomVh();
    window.addEventListener("resize", setCustomVh);
    return () => {
      window.removeEventListener("resize", setCustomVh);
    };
  }, []);

  return (
    <div>
      <GlobalLayout>
        <AppRouter />
      </GlobalLayout>
    </div>
  );
}

export default App;
