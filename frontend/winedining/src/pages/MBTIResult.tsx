import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation 훅 임포트
import Homebackground from "../assets/images/background/Home.png"
import winemenu from "../assets/images/modal/winemenu.png";
import { vh } from "../utils/vh";
import { wineMbti } from "../data/MBTIresult";
import defaultImage from "../assets/images/winesample/defaultChardonnay.png"


interface Wine {
    name: string;
    description: string;
    image: string;
  }
  
  interface ModalProps {
    wines: Wine[];
    onClose: () => void;
  }
  

interface ModalProps {
  wines: Wine[];
  onClose: () => void;
}



// 와인 인터페이스
interface wineMbtiType {
  id: number;
  ko_name: string;
  eng_name: string;
  image: string | null;
  content: string;
  best: number;
  worst: number;
}


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

  const nav = useNavigate()


  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
      <div style={styles.modal}>
        <img src={winemenu} alt="와인 메뉴판" style={styles.menuImage} />
          <button style={styles.closeButton} onClick={() => nav("/")}>
           X
          </button>
          <h2 style={styles.title}>{matchedWine?.ko_name}</h2>
          <ul style={styles.wineList}>
            {matchedWine && (
              <li style={styles.wineItem}>
                <img src={matchedWine.image || defaultImage} alt={matchedWine.ko_name} style={styles.wineImage} />
                <div style={styles.wineText}>
                  <h3>{matchedWine.ko_name}</h3>
                  <h3>{matchedWine.eng_name}</h3>
                  <p>{matchedWine.content}</p>
                </div>
              </li>
            )}
          </ul>
      </div>
    </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: `url(${Homebackground})`,
    backgroundSize: "contain",
    width: "100vw",
    height: "calc(100 * var(--custom-vh))",
    position: "relative",
  },  
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    // width: "100vw",
    height: "100vh",
    // backgroundColor: "black",
    backgroundColor: "rgba(39, 31, 31, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  menuImage: {
    position: "absolute",
    // width: "100%",
    top : vh(10),
    height: vh(80),
    objectFit: "contain",
    zIndex: -1,
  },
  title: {
    marginTop: vh(20),
    fontSize: "18px",
    fontWeight: "bold",
    color: "black",
  },
  wineList: {
    listStyle: "none",
    padding: 0,
    width: "85%",
    marginTop: "30px",
  },
  wineItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    // backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "10px",
    borderRadius: "10px",
    width : vh(40),
  },
  wineImage: {
    width: "50px",
    height: "120px",
    objectFit: "contain",
    marginRight: "10px",
  },
  wineText: {
    flex: 1,
    fontSize: "14px",
    color: "#333",
  },

};



export default MBTIResults;

