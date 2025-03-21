import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>여기는 앱 초기 화면인 로그인 공간입니다.</h1>
      <button onClick={() => navigate("/home")}>홈으로 이동하기</button>
      <button onClick={() => navigate("/test")}>와인 취향 확인하러가기</button>
    </div>
  );
}

export default Login;

export {};
