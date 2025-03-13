import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>여기는 바텐더가 서있는 홈화면입니다.</h1>
      <button onClick={() => navigate("/mypage")}>마이페이지</button>
      <button onClick={() => navigate("/winelist")}>메뉴판/와인리스트</button>
    </div>
  );
}

export default Home;

export {};
