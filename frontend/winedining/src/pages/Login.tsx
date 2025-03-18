import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>여기는 앱 초기 화면인 로그인 공간입니다.</h1>
      <h3>카카오 로그인</h3>
      <h3>구글로 시작하기</h3>
      <button onClick={() => navigate("/home")}>홈으로 이동하기</button>
      <button onClick={() => navigate("/logintest")}>WINE MBTI TEST</button>
    </div>
  );
}

export default Login;

export {};
