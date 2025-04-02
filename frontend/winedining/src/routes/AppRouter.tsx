import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
// import Test from "../pages/Test";
import MyPage from "../pages/MyPage";
import WineList from "../pages/WineList";
import WineSellerList from "../pages/WineSellerList";
import WishList from "../pages/WishList";
import ErrorPage from "../pages/ErrorPage";
import MBTITest from "../pages/MBTITest";
import Dictionary from "../pages/Dictionary";
import RecommendTest from "../pages/RecommendTest";
import RecommendFlow from "../pages/RecommendFlow";
import DicLoading from "../pages/DicLoading";
import MBTIResults from "../pages/MBTIResult";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/MBTITest" element={<MBTITest />} />
      <Route path="/MBTIresults" element={<MBTIResults />} />

      {/* 보호된 라우트 */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/winelist"
        element={
          <ProtectedRoute>
            <WineList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/winesellerlist"
        element={
          <ProtectedRoute>
            <WineSellerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dictionaryloading"
        element={
          <ProtectedRoute>
            <DicLoading />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dictionary"
        element={
          <ProtectedRoute>
            <Dictionary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendflow"
        element={
          <ProtectedRoute>
            <RecommendFlow />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendtest"
        element={
          <ProtectedRoute>
            <RecommendTest />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default AppRouter;
