import React from "react";
import AppRouter from "./routes/AppRouter";
import GlobalLayout from "./components/Layout/GlobalLayout";

function App() {
  return (
    <div>
      <GlobalLayout>
        <AppRouter />
      </GlobalLayout>
    </div>
  );
}

export default App;
