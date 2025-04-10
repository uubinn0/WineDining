import React from "react";
import { useNavigate } from "react-router-dom";
import kakao from "../assets/icons/kakao.png";
import google from "../assets/icons/google.png";
import PixelButton from "../components/PixelButton";
import { trackEvent } from "../utils/analytics";
import { motion } from "framer-motion";
import { vh } from "../utils/vh"; // vh 함수 사용

const MainPage = () => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    trackEvent("mainpage_kakao_login_click", { provider: "KAKAO" });
    localStorage.setItem("provider", "KAKAO");
    window.location.href = "https://winedining.store/api/v1/auth/oauth2/authorization/kakao";
  };

  const handleGoogleLogin = () => {
    trackEvent("mainpage_google_login_click", { provider: "GOOGLE" });
    localStorage.setItem("provider", "GOOGLE");
    window.location.href = "https://winedining.store/api/v1/auth/oauth2/authorization/google";
  };

  const handleMBTITestClick = () => {
    trackEvent("mainpage_mbti_test_click");
    navigate("/MBTITest");
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
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

        <div style={styles.loginOverlay}>
          <button onClick={handleKakaoLogin} style={styles.kakaoButton}>
            <img src={kakao} alt="카카오" style={styles.kakaoIcon} />
            카카오 로그인
          </button>
          <button onClick={handleGoogleLogin} style={styles.googleButton}>
            <img src={google} alt="구글" style={styles.googleIcon} />
            Google로 시작하기
          </button>
        </div>

        <div style={styles.mbtiBtn}>
          <PixelButton onClick={handleMBTITestClick}>WINE MBTI TEST</PixelButton>
        </div>
      </div>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#27052E",
    width: "100%",
    height: "100dvh",
    fontFamily: "PressStart2P",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    color: "white",
  },
  titleSection: {
    textAlign: "center",
    marginTop: vh(6.5),
    marginBottom: 0,
  },
  logoTitle: {
    fontSize: vh(3),
    marginBottom: vh(1),
  },
  subText: {
    fontFamily: "Galmuri9",
    fontSize: vh(1.7),
    lineHeight: "1.6",
  },
  imageWrapper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: vh(2),
  },
  mainImage: {
    width: vh(38),
    zIndex: 0,
  },
  loginOverlay: {
    position: "absolute",
    top: "60%", // 이미지 중간보다 살짝 위
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: vh(1.2),
    zIndex: 2,
  },
  kakaoButton: {
    width: vh(32),
    height: vh(6),
    backgroundColor: "#FEE500",
    border: "none",
    borderRadius: vh(0.8),
    fontFamily: "Galmuri9",
    fontSize: vh(1.8),
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: vh(1),
    cursor: "pointer",
  },
  googleButton: {
    width: vh(32),
    height: vh(6),
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: vh(0.8),
    fontFamily: "Galmuri9",
    fontSize: vh(1.8),
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: vh(1),
    cursor: "pointer",
  },
  kakaoIcon: {
    width: vh(2.6),
    height: vh(2.6),
  },
  googleIcon: {
    width: vh(2.4),
    height: vh(2.4),
  },
  mbtiBtn: {
    marginBottom: vh(4), // 너무 바닥에 붙지 않도록 여유
    zIndex: 2,
  },
};

export default MainPage;
