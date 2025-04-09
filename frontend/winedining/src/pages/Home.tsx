import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchUserProfile, logoutUser } from "../store/slices/authSlice";
import { setCameFromRecommendFlow } from "../store/slices/testSlice";

import Homebackground from "../assets/images/background/Home.png";
import mypageIcon from "../assets/icons/mypageicon.png";
import winelistIcon from "../assets/icons/winelisticon.png";
import dictionaryIcon from "../assets/icons/dictionaryicon.png";
import bartender from "../assets/icons/bartender.png";
import quest from "../assets/icons/questicon.png";

import { vh } from "../utils/vh";
// GA 이벤트 헬퍼 (유틸리티 함수)
// utils/analytics.ts 에 정의되어 있다고 가정합니다.
import { trackEvent } from "../utils/analytics";
import { motion } from "framer-motion";

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, status } = useSelector((state: RootState) => state.auth);
  const [isPreferenceModalVisible, setIsPreferenceModalVisible] = useState(false);
  // 최초 클릭 여부를 기록할 상태
  const [firstButtonClicked, setFirstButtonClicked] = useState(false);

  const testCompleted = useSelector((state: RootState) => state.test.testCompleted);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserProfile());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (user && user.preference === false && testCompleted === false) {
      dispatch(setCameFromRecommendFlow("home")); // 홈에서 넘어갔음을 설정
      setIsPreferenceModalVisible(true);
      const timer = setTimeout(() => {
        navigate("/recommendtest");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate, dispatch, testCompleted]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  // 공통 클릭 핸들러: 최초 클릭일 경우 이벤트 추적 후 이동
  const handleNavigationClick = (destination: string, targetName: string) => {
    if (!firstButtonClicked) {
      trackEvent("home_first_click", { target: targetName });
      setFirstButtonClicked(true);
    }
    navigate(destination);
  };

  if (status === "loading") return null;

  return (
    <motion.div style={homeContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
      <h3 style={logoutbutton} onClick={handleLogout}>
        로그아웃
      </h3>

      {isPreferenceModalVisible && user && !user.preference && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <p style={{ marginBottom: "8px" }}>
              <strong>{user.nickname}</strong>님, <br />
              아직 취향을 모르겠어요!
            </p>
            <p>간단한 질문만 답해주시면</p>
            <p>더 잘 맞는 와인을 추천드릴게요 🍷</p>
            <p style={{ fontSize: "14px", marginTop: "12px", color: "#d4b27a" }}>곧 취향 테스트로 이동합니다...</p>
          </div>
        </div>
      )}

      <button
        style={{ ...buttonStyle, ...wineListPositionStyle }}
        onClick={() => handleNavigationClick("/winelist", "winelist")}
      >
        <img src={winelistIcon} alt="와인리스트" style={wineListStyle} />
      </button>
      <button
        style={{ ...buttonStyle, ...dictionaryPositionStyle }}
        onClick={() => handleNavigationClick("/dictionaryloading", "dictionary")}
      >
        <img src={dictionaryIcon} alt="알쓸신잡" style={navIconStyle} />
      </button>
      <button
        style={{ ...buttonStyle, ...myPagePositionStyle }}
        onClick={() => handleNavigationClick("/mypage", "mypage")}
      >
        <img src={mypageIcon} alt="마이페이지" style={navIconStyle} />
      </button>
      <img
        src={bartender}
        alt="바텐더"
        style={bartenderStyle}
        onClick={() => handleNavigationClick("/recommendflow", "recommendflow_bartender")}
      />
      <img
        src={quest}
        alt="대화창"
        style={questStyle}
        onClick={() => handleNavigationClick("/recommendflow", "recommendflow_quest")}
      />
    </motion.div>
  );
}

const homeContainer: React.CSSProperties = {
  backgroundImage: `url(${Homebackground})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  width: "100%",
  height: "100dvh",
  position: "relative",
};

const buttonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
};

const wineListStyle: React.CSSProperties = {
  width: vh(15),
  height: vh(15),
};

const wineListPositionStyle: React.CSSProperties = {
  position: "absolute",
  top: "45%",
  left: "15%", // 화면 너비 기준 25%
};

const dictionaryPositionStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 999,
  bottom: "5%",
  right: "20%",
};

const myPagePositionStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 999,
  bottom: "5%",
  right: "5%",
};

const navIconStyle: React.CSSProperties = {
  width: vh(6),
  height: vh(6),
};

const bartenderStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "15%",
  left: "35%",
  width: vh(24.3),
  height: vh(30.1),
};

const questStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "42%",
  left: "70%",
  width: vh(12),
  height: vh(12),
};

const logoutbutton: React.CSSProperties = {
  margin: "1vh",
  padding: "1vh 2vh",
  fontSize: vh(1.6),
  backgroundColor: "#D6BA91",
  color: "#2a0e35",
  border: "none",
  borderRadius: vh(0.8),
  cursor: "pointer",
  position: "absolute",
  top: "1%",
  right: "1%",
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent: React.CSSProperties = {
  position: "relative",
  backgroundColor: "#2a0e35",
  border: "4px solid #d4b27a",
  padding: "28px 24px",
  width: "80%",
  maxWidth: "340px",
  borderRadius: "12px",
  textAlign: "center",
  color: "white",
  fontSize: "16px",
  lineHeight: "1.6",
};

export default Home;
