import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchUserProfile, logoutUser } from "../store/slices/authSlice";
import { setCameFromRecommendFlow } from "../store/slices/testSlice";
import qa from "../assets/icons/qa.png";

import Homebackground from "../assets/images/background/Home.png";
import mypageIcon from "../assets/icons/mypageicon.png";
import winelistIcon from "../assets/icons/winelisticon.png";
import dictionaryIcon from "../assets/icons/dictionaryicon.png";
import bartender from "../assets/icons/bartender.png";
import quest from "../assets/icons/questicon.png";
import PixelButton from "../components/PixelButton";

import p1 from "../assets/tutorial/p1.png";
import p2 from "../assets/tutorial/p3.png";
import p3 from "../assets/tutorial/p3.png";
import p4 from "../assets/tutorial/p4.png";
import p5 from "../assets/tutorial/p5.png";

import { vh } from "../utils/vh";
import { trackEvent } from "../utils/analytics";
import { motion } from "framer-motion";

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, status } = useSelector((state: RootState) => state.auth);
  const [isPreferenceModalVisible, setIsPreferenceModalVisible] = useState(false);
  const [firstButtonClicked, setFirstButtonClicked] = useState(false);

  const testCompleted = useSelector((state: RootState) => state.test.testCompleted);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [tutorialPage, setTutorialPage] = useState(0);

  const tutorialImages = [p1, p2, p3, p4, p5];

  const [autoTutorialStarted, setAutoTutorialStarted] = useState(false);
  const [showModalAfterTutorial, setShowModalAfterTutorial] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserProfile());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (user && user.preference === false && testCompleted === false && !autoTutorialStarted) {
      setAutoTutorialStarted(true);
      setIsTutorialOpen(true);
      setTutorialPage(0);
      dispatch(setCameFromRecommendFlow("home"));
    }
  }, [user, testCompleted, dispatch, autoTutorialStarted]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  const handleNavigationClick = (destination: string, targetName: string) => {
    if (!firstButtonClicked) {
      trackEvent("home_first_click", { target: targetName });
      setFirstButtonClicked(true);
    }
    navigate(destination);
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
    setTutorialPage(0);

    if (autoTutorialStarted) {
      setShowModalAfterTutorial(true);
      setIsPreferenceModalVisible(true);

      let sec = 5;
      setCountdown(sec);
      const timer = setInterval(() => {
        sec -= 1;
        setCountdown(sec);
        if (sec <= 0) {
          clearInterval(timer);
          navigate("/recommendtest");
        }
      }, 1000);
    }
  };

  if (status === "loading") return null;

  return (
    <motion.div style={homeContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
      {isTutorialOpen && (
        <div style={tutorialModalOverlay}>
          <div style={tutorialModalContent}>
            <img
              src={tutorialImages[tutorialPage]}
              alt={`튜토리얼 ${tutorialPage + 1}`}
              style={tutorialImageStyle}
              onClick={() => {
                if (tutorialPage < tutorialImages.length - 1) {
                  setTutorialPage(tutorialPage + 1);
                } else {
                  closeTutorial();
                }
              }}
            />
            <div style={tutorialButtonGroup}>
              <PixelButton
                onClick={() => {
                  if (tutorialPage < tutorialImages.length - 1) {
                    setTutorialPage(tutorialPage + 1);
                  } else {
                    closeTutorial();
                  }
                }}
                width="10vh"
                height="3.5vh"
                backgroundColor="#d4b27a"
                textColor="#2a0e35"
                fontSize="1.8vh"
              >
                {tutorialPage === tutorialImages.length - 1 ? "CLOSE" : "NEXT"}
              </PixelButton>
            </div>
          </div>
        </div>
      )}

      <h3 style={logoutbutton} onClick={handleLogout}>
        로그아웃
      </h3>
      {isPreferenceModalVisible && user && !user.preference && showModalAfterTutorial && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <p style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "2vh", marginTop: "12px", color: "#d4b27a" }}>
                <span style={{ color: "#9A001A" }}>{countdown}</span>초 후 테스트로 이동합니다...
              </p>
              <span style={{ textDecoration: "underline" }}>
                <strong>{user.nickname}</strong>
              </span>
              님, <br />
              아직 취향 정보가 없어요!
            </p>
            <p>간단한 질문에 답해주시면</p>
            <p>더 잘 맞는 와인을 추천해드릴게요 🍷</p>
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
        style={{ ...buttonStyle, ...tutorialPositionStyle }}
        onClick={() => {
          setIsTutorialOpen(true);
          setTutorialPage(0);
        }}
      >
        <img src={qa} alt="튜토리얼" style={tutorialIconStyle} />
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
  right: "19%",
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
  right: "10%",
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
  padding: "6px",
  maxWidth: "95%",
  width: "48vh",
  borderRadius: "12px",
  textAlign: "center",
  color: "white",
  fontSize: "14px",
  lineHeight: "1.6",
};

const tutorialModalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const tutorialModalContent: React.CSSProperties = {
  backgroundColor: "#111",
  padding: "2px",
  borderRadius: "2x",
  maxWidth: "95%",
  width: "48vh",
  textAlign: "center",
};

const tutorialImageStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
  maxHeight: "90vh",
  borderRadius: "12px",
};

const tutorialButtonGroup: React.CSSProperties = {
  margin: "1vh",
  display: "flex", // 가운데 정렬 추가
  justifyContent: "center", // 버튼을 수평 중앙에
};

const tutorialPositionStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: vh(6),
  height: vh(6),
  backgroundColor: "#111",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 0,
  border: "none",
  zIndex: 999,
  cursor: "pointer",
};

const tutorialIconStyle: React.CSSProperties = {
  width: vh(2.5),
  height: vh(3.5),
  objectFit: "contain",
};
export default Home;
