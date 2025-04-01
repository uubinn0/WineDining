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

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, status } = useSelector((state: RootState) => state.auth);
  const [isPreferenceModalVisible, setIsPreferenceModalVisible] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserProfile());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (user && user.preference === false) {
      dispatch(setCameFromRecommendFlow("home"));  // 홈에서 넘어갔음을 설정
      setIsPreferenceModalVisible(true);
      const timer = setTimeout(() => {
        navigate("/recommendtest");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  if (status === "loading") return null;

  return (
    <div style={homeContainer}>
      <h3 style={logoutbutton} onClick={handleLogout}>
        로그아웃
      </h3>

      {isPreferenceModalVisible && user && (
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

      <button style={{ ...buttonStyle, ...wineListPositionStyle }} onClick={() => navigate("/winelist")}>
        <img src={winelistIcon} alt="와인리스트" style={wineListStyle} />
      </button>
      <button style={{ ...buttonStyle, ...dictionaryPositionStyle }} onClick={() => navigate("/dictionaryloading")}>
        <img src={dictionaryIcon} alt="알쓸신잡" style={navIconStyle} />
      </button>
      <button style={{ ...buttonStyle, ...myPagePositionStyle }} onClick={() => navigate("/mypage")}>
        <img src={mypageIcon} alt="마이페이지" style={navIconStyle} />
      </button>
      <img src={bartender} alt="바텐더" style={bartenderStyle} onClick={() => navigate("/recommendflow")} />
      <img src={quest} alt="대화창" style={questStyle} onClick={() => navigate("/recommendflow")} />
    </div>
  );
}

// 스타일 정의는 이전과 동일하게 유지
const homeContainer: React.CSSProperties = {
  backgroundImage: `url(${Homebackground})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  width: "100%",
  height: "calc(100 * var(--custom-vh))",
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
  top: vh(44.3),
  left: vh(4.2),
};

const dictionaryPositionStyle: React.CSSProperties = {
  position: "absolute",
  top: vh(73.1),
  left: vh(1.5),
};

const myPagePositionStyle: React.CSSProperties = {
  position: "absolute",
  top: vh(73.1),
  left: vh(8.5),
};

const navIconStyle: React.CSSProperties = {
  width: vh(5.6),
  height: vh(5.6),
};

const bartenderStyle: React.CSSProperties = {
  position: "absolute",
  top: vh(48.2),
  left: vh(17.3),
  width: vh(24.3),
  height: vh(30.1),
};

const questStyle: React.CSSProperties = {
  position: "absolute",
  top: vh(39.5),
  left: vh(33.9),
  width: vh(12),
  height: vh(12),
};

const logoutbutton: React.CSSProperties = {
  margin: "1vh",
  padding: "1vh 2vh",
  fontSize: vh(1.6),
  backgroundColor: "#ffcc00",
  color: "#2a0e35",
  border: "none",
  borderRadius: vh(0.8),
  cursor: "pointer",
  position: "absolute",
  top: "1vh",
  right: "32vh",
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
