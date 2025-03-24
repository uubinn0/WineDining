import React from "react";
import { useNavigate } from "react-router-dom";
import Homebackground from "../assets/images/background/Home.png"
import mypageIcon from "../assets/icons/mypageicon.png"
import winelistIcon from "../assets/icons/winelisticon.png"
import dictionaryIcon from "../assets/icons/dictionaryicon.png"
import bartender from "../assets/icons/bartender.png"
import quest from "../assets/icons/questicon.png"

function Home() {
  const navigate = useNavigate();


  const homeContainer : React.CSSProperties = {
    position : "relative",
    backgroundImage : `url(${Homebackground})`,
    backgroundSize : "cover",
    backgroundPosition : "center",
    backgroundRepeat : "no-repeat",
    width : "100vw",
    height : "100vh",
    
  }

  const buttonStyle : React.CSSProperties = {
    background : "none",
    border : "none",
    cursor : "pointer",
    // margin : "10px"
  }


  const wineListStyle : React.CSSProperties = {
    width : "120px",
    height : "120px",
  }

  const wineListPositionStyle : React.CSSProperties = {
    position : "absolute",
    top : "382px",
    left : "45px",
  }
  const dictionaryPositionStyle : React.CSSProperties = {
    position : "absolute",
    top : "771px",
    left : "250px"
  }
  const myPagePositionStyle : React.CSSProperties = {
    position : "absolute",
    top : "771px",
    left : "315px"
  }

  const navIconStyle : React.CSSProperties = {
    width : "56px",
    height : "56px"
  }
  const bartenderStyle : React.CSSProperties = {
    position : "absolute",
    top : "437px",
    left : "111px",
    width : "213px",
    height : "261px"
  }

  const questStyle : React.CSSProperties = {
    position : "absolute",
    top : "356px",
    left : "269px",
    width : "106px",
    height : "102px"
  }


  return (
    <div style={homeContainer}>
      {/* <h1>여기는 바텐더가 서있는 홈화면입니다.</h1> */}
      <button style={{...buttonStyle, ...wineListPositionStyle}} onClick={() => navigate("/winelist")}>
        <img src={winelistIcon} alt="와인리스트" style={wineListStyle}/>
      </button>
      <button style={{...buttonStyle, ...dictionaryPositionStyle}} onClick={() => navigate("/dictionaryloading")}>
        <img src={dictionaryIcon} alt="알쓸신잡" style={navIconStyle}/>
      </button>
      <button style={{...buttonStyle, ...myPagePositionStyle}} onClick={() => navigate("/mypage")}>
        <img src={mypageIcon} alt="마이페이지" style={navIconStyle} onClick={() => navigate("/mypage")}/>
      </button>
      {/* <button style={{...buttonStyle, ...myPagePositionStyle}} onClick={() => navigate("/mypage")}> */}
        <img src={bartender} alt="바텐더" style={bartenderStyle} onClick={() => navigate("/recommendflow")}/>
      {/* </button> */}
      <img src={quest} alt="대화창" style={questStyle} onClick={() => navigate("/recommendflow")}/>

    </div>
  );
}

export default Home;

export {};
