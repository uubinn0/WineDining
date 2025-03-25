import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 쿠키에서 Authorization 꺼내는 함수
function getCookie(name: string): string | null {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
}

function Login() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 쿠키에서 Authorization 읽어서 로그인 여부 판단
  useEffect(() => {
    const accessToken = getCookie("Authorization");
    setIsLoggedIn(Boolean(accessToken && accessToken.trim() !== ""));
  }, []);

  const handleKakaoLogin = async () => {
    try {
      //로컬 스토리에 kakao 상태값 저장
      localStorage.setItem("provider", "KAKAO");
      console.log("provider (KAKAO):", localStorage.getItem("provider"));

      window.location.href = `${BASE_URL}/api/v1/auth/oauth2/authorization/kakao`; // 해당 URL로 리다이렉션
    } catch (error) {
      console.error("카카오 로그인 요청 실패:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      //로컬 스토리에 google 상태값 저장
      localStorage.setItem("provider", "GOOGLE");
      console.log("provider (GOOGLE):", localStorage.getItem("provider"));

      window.location.href = `${BASE_URL}/api/v1/auth/oauth2/authorization/google`; // 해당 URL로 리다이렉션
    } catch (error) {
      console.error("구글 로그인 요청 실패:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // (1) 서버에 로그아웃 요청 보내기
      const response = await axios.post(`${BASE_URL}/api/v1/auth/logout`, {}, { withCredentials: true });
      console.log("로그아웃 응답", response.data);

      // (3) 상태 업데이트 (재렌더링 위해)
      setIsLoggedIn(false);

      // (4) 홈으로 이동
      navigate("/");
    } catch (error) {
      console.error("로그아웃 error:", error);
    }
  };

  return (
    <div style={styles.container}>
      {isLoggedIn ? (
        <>
          <h1>로그인 상태임</h1>
          <h3 style={styles.button} onClick={handleLogout}>
            로그아웃
          </h3>
        </>
      ) : (
        <>
          <h3 style={styles.button} onClick={handleKakaoLogin}>
            카카오 로그인
          </h3>
          <h3 style={styles.button} onClick={handleGoogleLogin}>
            구글로 시작하기
          </h3>
        </>
      )}
      <button style={styles.button} onClick={() => navigate("/home")}>
        홈으로 이동하기
      </button>
      <button style={styles.button} onClick={() => navigate("/MBTITest")}>
        WINE MBTI TEST
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: 'url("/main_page/main_image.webp")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#ffcc00",
    color: "#2a0e35",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Login;
