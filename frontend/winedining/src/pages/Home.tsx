import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Homebackground from "../assets/images/background/Home.png";
import mypageIcon from "../assets/icons/mypageicon.png";
import winelistIcon from "../assets/icons/winelisticon.png";
import dictionaryIcon from "../assets/icons/dictionaryicon.png";
import bartender from "../assets/icons/bartender.png";
import quest from "../assets/icons/questicon.png";

import { vh } from "../utils/vh"; // 이거 calc 함수 대신 사용하면 됩니다.
import axios from "axios";

interface UserProfile {
  userId: number;
  nickname: string;
  email: string | null;
  rank: string | null;
}

function Home() {
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreferenceModalVisible, setIsPreferenceModalVisible] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/v1/user/profile`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = response.data.data;
        console.log("성공, 사용자 정보:", data);
        setUserProfile(data);

        // preference가 false일 경우, 모달 띄우고 자동 이동 타이머 설정
        if (!data.preference) {
          setIsPreferenceModalVisible(true);
          setTimeout(() => {
            navigate("/recommendtest");
          }, 7000); // 7초 후 자동 이동
        }
      } catch (error) {
        console.error("실패, 사용자 정보 로딩 오류:", error);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [BASE_URL, navigate]);

  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청 보내기
      const response = await axios.post(`/api/v1/auth/logout`, {}, { withCredentials: true });
      console.log("로그아웃 응답", response.data);

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={homeContainer}>
      <h3 style={logoutbutton} onClick={handleLogout}>
        로그아웃
      </h3>
      {isPreferenceModalVisible && userProfile && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <p style={{ marginBottom: "8px" }}>
              <strong>{userProfile.nickname}</strong>님, <br />
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
        <img src={mypageIcon} alt="마이페이지" style={navIconStyle} onClick={() => navigate("/mypage")} />
      </button>
      {/* <button style={{...buttonStyle, ...myPagePositionStyle}} onClick={() => navigate("/mypage")}> */}
      <img src={bartender} alt="바텐더" style={bartenderStyle} onClick={() => navigate("/recommendflow")} />
      {/* </button> */}
      <img src={quest} alt="대화창" style={questStyle} onClick={() => navigate("/recommendflow")} />
    </div>
  );
}

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

// 와인 메뉴판 크기
const wineListStyle: React.CSSProperties = {
  width: vh(15),
  height: vh(15),
};

// 와인 메뉴판 위치
const wineListPositionStyle: React.CSSProperties = {
  position: "absolute",
  top: vh(44.3),
  left: vh(4.2),
};

// 알쓸신잡 위치
const dictionaryPositionStyle: React.CSSProperties = {
  position: "absolute",
  top: vh(73.1),
  left: vh(1.5),
};

// 나의 페이지 위치
const myPagePositionStyle: React.CSSProperties = {
  position: "absolute",
  top: vh(73.1),
  left: vh(8.5),
};

//
const navIconStyle: React.CSSProperties = {
  width: vh(5.6),
  height: vh(5.6),
};

// 바텐더 스타일
const bartenderStyle: React.CSSProperties = {
  position: "absolute",
  top: vh(48.2),
  left: vh(17.3),
  width: vh(24.3),
  height: vh(30.1),
};

// 물음표 스타일
const questStyle: React.CSSProperties = {
  position: "absolute",
  top: vh(39.5),
  left: vh(33.9),
  width: vh(12),
  height: vh(12),
};

// 로그아웃 스타일
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
export {};
