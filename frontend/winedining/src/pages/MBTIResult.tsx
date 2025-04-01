import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation 훅 임포트
import Homebackground from "../assets/images/background/Home.png"
import winemenu from "../assets/images/modal/winemenu.png";
import { vh } from "../utils/vh";
import { wineMbti } from "../data/MBTIresult";
import defaultImage from "../assets/images/winesample/MBTIimage/defaultChardonnay.png"
import PixelButton from "../components/PixelButton";

// interface Wine {
//     name: string;
//     description: string;
//     image: string;
//   }
  

// // 와인 인터페이스
// interface wineMbtiType {
//   id: number;
//   ko_name: string;
//   eng_name: string;
//   image: string | null;
//   content: string;
//   best: number;
//   worst: number;
// }


// 성격 유형 점수의 타입을 정의
interface Scores {
  E: number;
  I: number;
  S: number;
  N: number;
  F: number;
  T: number;
  P: number;
  J: number;
}

function MBTIResults() {
  const location = useLocation(); // useLocation을 통해 location 객체 가져오기
  const { E, I, S, N, F, T, P, J }: Scores = location.state || {};
  // 성격 유형 계산
  const personalityType = `${E > I ? "E" : "I"}${S > N ? "S" : "N"}${F > T ? "F" : "T"}${P > J ? "P" : "J"}`;

  const mbtiDictionary :Record<string, number> = {
    "ISTJ": 1,
    "ISFJ": 2,
    "INFJ": 3,
    "INTJ": 4,
    "ISTP": 5,
    "ISFP": 6,
    "INFP": 7,
    "INTP": 8,
    "ESTP": 9,
    "ESFP": 10,
    "ENFP": 11,
    "ENTP": 12,
    "ESTJ": 13,
    "ESFJ": 14,
    "ENFJ": 15,
    "ENTJ": 16
  };
  
  // personalityType에 해당하는 와인 정보 찾기
  const matchedWineId = mbtiDictionary[personalityType];
  const matchedWine = wineMbti.find(wine => wine.id === matchedWineId);

  // best와 worst 와인 정보 찾기
  const bestWine = matchedWine ? wineMbti.find(wine => wine.id === matchedWine.best) : null;
  const worstWine = matchedWine ? wineMbti.find(wine => wine.id === matchedWine.worst) : null;

  const nav = useNavigate()


  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
      <div style={styles.modal}>
        <img src={winemenu} alt="와인 메뉴판" style={styles.menuImage} />

          <div style={styles.title}>{matchedWine?.ko_name}</div>
          <ul style={styles.wineList}>
            {matchedWine && (
              <li style={styles.wineItem}>
                {/* 여기! */}
                <div style={styles.wineImageWrapper}>
                <div style={styles.wineShadow}></div>
                <img src={matchedWine.image || defaultImage} alt={matchedWine.ko_name} style={styles.wineImage} />
                </div>
                <div style={styles.wineText}>              
                  <div style={styles.engName}>{matchedWine.eng_name}</div>
                  
                  <div style={styles.content}>
                    <div>{matchedWine.content}</div>
                  </div>

            <div style={styles.matchingContainer} >
                  <div style={styles.matching}>
                    <div style={styles.matchingtitle}>
                    나랑 찰떡궁합
                    </div>
                    <img 
                      src={bestWine?.image || defaultImage} 
                      alt={bestWine?.ko_name || "Best Wine"} 
                      style={styles.wineMatchingImg} 
                      />
                      <div style={styles.matchingName}>{bestWine?.ko_name || "N/A"}</div>
                  </div>
                  <div style={styles.matching}>
                    <div style={styles.matchingtitle}>
                    살짝쿵 안맞아
                    </div>

                    <img 
                      src={worstWine?.image || defaultImage} 
                      alt={worstWine?.ko_name || "Worst Wine"} 
                      style={styles.wineMatchingImg} 
                      />
                      <div style={styles.matchingName}>{worstWine?.ko_name || "N/A"}</div>
                  </div>

            </div>

                </div>
              </li>
            )}
          </ul>
      </div>

        <button style={styles.shareButton} onClick={() => nav("/")}>
          홈으로 이동
        </button>

      </div>
      <div>

      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: `url(${Homebackground})`,
    backgroundSize: "contain",
    width: "100vw",
    maxWidth: "430px", // 디자인 한계 지정 (선택)
    maxHeight: "100vh",
    height: "calc(100 * var(--custom-vh))",
    margin: "0 auto",
    position: "relative",
  },  
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    paddingTop : vh(3),
    width : "100vw",
    height: "100vh",
    backgroundColor: "rgba(39, 31, 31, 0.5)",
    display: "flex",
    flexDirection : "column",
    // justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    // position: "relative",
    width: "70%",
    maxWidth: "280px", // 디자인 width 기준
    height: "100%",
    // maxHeight: "calc(100vh - " + vh(10) + ")", // 공유 버튼 영역 확보
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  menuImage: {
    position: "absolute",
    width : vh(48),
    maxWidth: "420px", // 디자인 width 기준
    height: vh(85),
    // top : vh(10),
    objectFit: "fill",
    zIndex: -1,
  },
  title: {
    fontSize : vh(2.5),
    marginTop: vh(13),
    fontFamily : "Galmuri7",
  },
  engName: {
    marginTop : vh(1),
    fontSize : vh(2),
    textAlign : "center",
    fontFamily : "Galmuri7",
  },
  wineList: {
    listStyle: "none",
    padding: 0,
  },
  wineItem: {
    display: "flex",
    flexDirection : "column",
    alignItems: "center",
  },

  wineImageWrapper: {
    height: vh(12),
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
  },
  
  wineShadow: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "70%", // 반원 비율
    backgroundColor: "rgba(125, 85, 150, 0.2)",
    borderRadius: "50%",
    filter: "blur(2vh)",
    zIndex: -1,
  },

  wineImage: {
    width: vh(13),
    objectFit: "contain",
    zIndex : 1,

  },
  wineText: {
    flex: 1,
    fontSize: vh(1.8),
    // wordBreak : "keep-all",
    // color: "#333",
  },
  matching : {
    display : "flex",
    flexDirection : "column",
    justifyContent : "space-around",
    alignItems : "center",
    gap : vh(1),
    textAlign : "center",
    
  },
  matchingtitle : {
    fontWeight : "bold",
    textDecoration: "underline",
    textUnderlineOffset: vh(0.6),
    textDecorationColor: "#333333",
    textDecorationThickness: vh(0.3),
    marginBottom : vh(1),
  },
  wineMatchingImg : {
    width : vh(10)
  },
  matchingContainer :{
    display : "flex",
    justifyContent : "space-around",
    
  },
  matchingName : {
    fontFamily : "Galmuri7"
  },
  content : {
    padding : vh(2),
  },
  shareButton: {
  position: "fixed", /* absolute에서 relative로 변경 */
  bottom: vh(6),
  padding: `${vh(1.5)} ${vh(3)}`,
  backgroundColor: "#fff",
  border: `1px solid #333`,
  borderRadius: vh(1),
  fontFamily: "Galmuri7",
  fontSize: vh(1.8),
  boxShadow: "0 0.3vh 0.8vh rgba(0,0,0,0.3)",
  zIndex: 1010,
  cursor: "pointer",
},
}



export default MBTIResults;

