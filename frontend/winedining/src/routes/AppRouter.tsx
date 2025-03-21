import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
// import Test from "../pages/Test";
import MyPage from "../pages/MyPage";
import WineList from "../pages/WineList";
import WineSellerList from "../pages/WineSellerList";
import WishList from "../pages/WishList";
import ErrorPage from "../pages/ErrorPage";
import LoginTest from "../pages/LoginTest";
import Dictionary from "../pages/Dictionary";
import RecommendTest from "../pages/RecommendTest";
import RecommendFlow from "../pages/RecommendFlow";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logintest" element={<LoginTest />}></Route>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/test" element={<Test />} /> */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/winelist" element={<WineList />} />
        <Route path="/winesellerlist" element={<WineSellerList />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/recommendflow" element={<RecommendFlow />} />
        <Route path="/recommendtest" element={<RecommendTest />} />
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
