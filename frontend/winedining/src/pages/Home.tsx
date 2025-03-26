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

function Home() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("Authorization");
    setIsLoggedIn(Boolean(accessToken && accessToken.trim() !== ""));
  }, []);

  const handleLogout = async () => {
    try {
      // (1) 서버에 로그아웃 요청 보내기
      const response = await axios.post(`/api/v1/auth/logout`, {}, { withCredentials: true });
      console.log("로그아웃 응답", response.data);

      // (3) 상태 업데이트 (재렌더링 위해)
      setIsLoggedIn(false);

      // (4) 홈으로 이동
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

export default Home;
export {};
