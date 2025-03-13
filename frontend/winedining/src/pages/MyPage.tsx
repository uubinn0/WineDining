import React from "react";
import { useNavigate } from "react-router-dom";

function MyPage() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/home")}>홈으로가기</button>

      <h1>여기는 나의 페이지 공간입니다.</h1>
      <button onClick={() => navigate("/winesellerlist")}>와인셀러리스트</button>
      <button onClick={() => navigate("/wishlist")}>위시리스트</button>
      <button onClick={() => navigate("/test")}>와인취향테스트하기</button>
    </div>
  );
}

export default MyPage;

export {};
