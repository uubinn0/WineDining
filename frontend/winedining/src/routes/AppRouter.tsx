import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Test from "../pages/Test";
import MyPage from "../pages/MyPage";
import WineList from "../pages/WineList";
import WineSellerList from "../pages/WineSellerList";
import WishList from "../pages/WishList";
import ErrorPage from "../pages/ErrorPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/winelist" element={<WineList />} />
        <Route path="/winesellerlist" element={<WineSellerList />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
