import React from "react";
import { useNavigate } from "react-router-dom";

const LoginTest = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>MBTI WINE TEST</h1>
      <p>비로그인 대상 와인 테스트</p>
      <button onClick={() => navigate("/")}>뒤로가기</button>
    </div>
  );
};

export default LoginTest;
