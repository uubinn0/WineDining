import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h3 style={styles.button}>카카오 로그인</h3>
      <h3 style={styles.button}>구글로 시작하기</h3>
      <button style={styles.button} onClick={() => navigate("/home")}>
        홈으로 이동하기
      </button>
      <button style={styles.button} onClick={() => navigate("/logintest")}>
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
