import React from "react";
import { useNavigate } from "react-router-dom";
import kakao from "../assets/icons/kakao.png";
import google from "../assets/icons/google.png";
import PixelButton from "../components/PixelButton";

const MainPage = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleKakaoLogin = () => {
    localStorage.setItem("provider", "KAKAO");
    window.location.href = `${BASE_URL}/api/v1/auth/oauth2/authorization/kakao`;
  };

  const handleGoogleLogin = () => {
    localStorage.setItem("provider", "GOOGLE");
    window.location.href = `${BASE_URL}/api/v1/auth/oauth2/authorization/google`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleSection}>
        <h1 style={styles.logoTitle}>Wine Dining</h1>
        <p style={styles.subText}>
          간편하게 로그인하고
          <br />
          다양한 서비스를 이용해보세요
        </p>
      </div>

      <div style={styles.imageWrapper}>
        <img src="/main_page/mainwine.png" alt="mainwine" style={styles.mainImage} />

        <div style={styles.buttonOverlay}>
          <button onClick={handleKakaoLogin} style={styles.loginBtn}>
            <img src={kakao} alt="카카오" style={styles.icon} />
          </button>
          <button onClick={handleGoogleLogin} style={styles.loginBtn}>
            <img src={google} alt="구글" style={styles.icon} />
          </button>
        </div>
        <div style={styles.mbtiBtn}>
          <PixelButton onClick={() => navigate("/MBTITest")}>WINE MBTI TEST</PixelButton>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#2a0e35",
    width: "100%",
    height: "100vh",
    fontFamily: "PressStart2P",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    color: "white",
  },
  titleSection: {
    textAlign: "center",
    marginTop: "50px",
    marginBottom: "0px",
  },
  logoTitle: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  subText: {
    fontFamily: "Galmuri9",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  imageWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: "350px",
    paddingRight: "13px",
    zIndex: 0,
  },
  buttonOverlay: {
    position: "absolute",
    bottom: "180px", // 이미지 기준 버튼 위치 조절
    display: "flex",
    gap: "20px",
    zIndex: 2,
  },
  loginBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  mbtiBtn: {
    position: "absolute",
    bottom: "100px", // 이미지 기준 버튼 위치 조절
    display: "flex",
    gap: "20px",
    zIndex: 2,
  },
  icon: {
    width: "45px",
    height: "45px",
  },
};

export default MainPage;
