import React from "react";
import { useNavigate } from "react-router-dom";

function WineSellerList() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/mypage")}>뒤로가기</button>

      <h1>여기는 내가 마신 와인을 기록한 와인셀러리스트입니다.</h1>
    </div>
  );
}

export default WineSellerList;

export {};
