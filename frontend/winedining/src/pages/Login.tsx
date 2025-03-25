import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assert } from "console";

function Login() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  const handleKakaoLogin = async () => {
    try {
      //로컬 스토리에 kakao 상태값 저장
      localStorage.setItem("provider", "KAKAO");
      console.log("provider (KAKAO):", localStorage.getItem("provider"));

      window.location.href = "https://j12b202.p.ssafy.io/api/v1/auth/oauth2/authorization/kakao"; // 해당 URL로 리다이렉션
    } catch (error) {
      console.error("카카오 로그인 요청 실패:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      //로컬 스토리에 google 상태값 저장
      localStorage.setItem("provider", "GOOGLE");
      console.log("provider (GOOGLE):", localStorage.getItem("provider"));
      // 백엔드에서 구글 인증 URL 가져오기
      const response = await axios.get("https://j12b202.p.ssafy.io/api/v1/auth/oauth2/authorization/google");
      const googleAuthUrl = response.data.data.link; // 백엔드가 반환하는 인증 URL
      window.location.href = googleAuthUrl; // 해당 URL로 리다이렉션
    } catch (error) {
      console.error("구글 로그인 요청 실패:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.button} onClick={handleKakaoLogin}>
        카카오 로그인
      </h3>
      <h3 style={styles.button} onClick={handleGoogleLogin}>
        구글로 시작하기
      </h3>
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
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
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
