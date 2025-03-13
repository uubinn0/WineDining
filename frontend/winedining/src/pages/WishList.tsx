import React from "react";
import { useNavigate } from "react-router-dom";

function WishList() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/mypage")}>뒤로가기</button>
      <h1>여기는 내가 찜한 와인 위시리스트 보는 공간입니다.</h1>
    </div>
  );
}

export default WishList;

export {};
