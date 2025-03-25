import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Homebackground from "../assets/images/background/Home.png";
import mypageIcon from "../assets/icons/mypageicon.png";
import winelistIcon from "../assets/icons/winelisticon.png";
import dictionaryIcon from "../assets/icons/dictionaryicon.png";
import bartender from "../assets/icons/bartender.png";
import quest from "../assets/icons/questicon.png";
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
      const response = await axios.post(`${BASE_URL}/api/v1/auth/logout`, {}, { withCredentials: true });
      console.log("로그아웃 응답", response.data);

      // (3) 상태 업데이트 (재렌더링 위해)
      setIsLoggedIn(false);

      // (4) 홈으로 이동
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const homeContainer: React.CSSProperties = {
    backgroundImage: `url(${Homebackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
  };

  const buttonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    // margin : "10px"
  };

  const wineListStyle: React.CSSProperties = {
    width: "120px",
    height: "120px",
  };

  const wineListPositionStyle: React.CSSProperties = {
    position: "absolute",
    top: "382px",
    left: "45px",
  };
  const dictionaryPositionStyle: React.CSSProperties = {
    position: "absolute",
    top: "771px",
    left: "250px",
  };
  const myPagePositionStyle: React.CSSProperties = {
    position: "absolute",
    top: "771px",
    left: "315px",
  };

  const navIconStyle: React.CSSProperties = {
    width: "56px",
    height: "56px",
  };
  const bartenderStyle: React.CSSProperties = {
    position: "fixed",
    top: "437px",
    left: "111px",
    width: "213px",
    height: "261px",
  };

  const logoutbutton: React.CSSProperties = {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#ffcc00",
    color: "#2a0e35",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const questStyle: React.CSSProperties = {
    position: "fixed",
    top: "356px",
    left: "269px",
    width: "106px",
    height: "102px",
  };

  return (
    <div style={homeContainer}>
      {/* <h1>여기는 바텐더가 서있는 홈화면입니다.</h1> */}
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

export default Home;

export {};
