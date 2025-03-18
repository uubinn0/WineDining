import React from "react";
import { useNavigate } from "react-router-dom";

function Test() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/mypage")}>뒤로가기</button>

      <h1>여기는 와인 취향 테스트하는 공간입니다.</h1>
    </div>
  );
}

export default Test;

export {};
