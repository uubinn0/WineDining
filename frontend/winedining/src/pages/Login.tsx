import React from "react";
import { useNavigate } from "react-router-dom";
import kakao from "../assets/icons/kakao.png";
import google from "../assets/icons/google.png";
import PixelButton from "../components/PixelButton";
import { trackEvent } from "../utils/analytics";
import { motion } from "framer-motion";

const MainPage = () => {
  const navigate = useNavigate();
  // const baseUrl = window.location.origin;
  //"https://j12b202.p.ssafy.io/api/v1/auth/oauth2/authorization/kakao";

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

        <div style={styles.buttonOverlay}>
          <button onClick={handleKakaoLogin} style={styles.loginBtn}>
            <img src={kakao} alt="카카오" style={styles.icon} />
          </button>
          <button onClick={handleGoogleLogin} style={styles.loginBtn}>
            <img src={google} alt="구글" style={styles.icon} />
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
