import React from "react";
import winemenu from "../../assets/images/modal/winemenu.png";
import { WineRecommendation } from "../../types/wine";
import defaultwineimg from "../../assets/images/winesample/defaultwine.png";
import { vh } from "../../utils/vh";

interface ModalProps {
  wines: WineRecommendation[];
  onClose: () => void;
}

const RecommendationResult: React.FC<ModalProps> = ({ wines, onClose }) => {
  //  console.log("winedata", wines)
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <img src={winemenu} alt="와인 메뉴판" style={styles.menuImage} />
        <div style={styles.textContainer}>
          <div style={styles.title}>✨ 추천 리스트 ✨</div>
          <div style={styles.wineList}>
            {wines.map((wine, index) => (
              <div key={index} style={styles.wineItem}>
                <img src={wine.image || defaultwineimg} alt={wine.krName} style={styles.wineImage} />
                <div>
                  <div style={styles.krName}>{wine.krName}</div>
                  <div style={styles.wineText}>{wine.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button style={styles.closeButton} onClick={onClose}>
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    paddingTop: vh(3),
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(39, 31, 31, 0.5)",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "90%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  menuImage: {
    position: "absolute",
    width: "100%",
    height: "90%",
    objectFit: "fill",
    zIndex: -1,
  },
  title: {
    fontSize: vh(2.5),
    marginBottom: vh(1),
    textAlign: "center",
    fontFamily: "Galmuri7",
  },
  textContainer: {
    marginTop: vh(14),
    width: "100%",
    maxHeight: "70%",
    overflow: "auto", // 넘치는 부분에 스크롤을 추가
    zIndex: 1, // 텍스트가 이미지 위에 보이도록 설정
  },
  wineItem: {
    display: "flex",
    justifyContent: "center",
    marginLeft: vh(3),
    marginRight: vh(3),
    marginBottom: vh(2),

    // alignItems: "stretch",

    // margin: vh(1),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: vh(1),
    // padding: "10px",
    borderRadius: vh(2),
  },
  wineImage: {
    width: vh(7),
    minWidth: vh(7),
    margin: vh(1),
    objectFit: "contain",
    zIndex: 1,
  },
  krName: {
    fontSize: vh(2.2),
    marginTop: vh(1),
    marginBottom: vh(1),
  },

  wineText: {
    flex: 1,
    fontSize: vh(1.8),
    color: "#333",
  },
  closeButton: {
    position: "fixed" /* absolute에서 relative로 변경 */,
    bottom: vh(6),
    padding: `${vh(1.5)} ${vh(3)}`,
    backgroundColor: "#fff",
    border: `0.1vh solid #333`,
    borderRadius: vh(1),
    fontFamily: "Galmuri7",
    fontSize: vh(1.8),
    boxShadow: "0 0.3vh 0.8vh rgba(0,0,0,0.3)",
    zIndex: 1010,
    cursor: "pointer",
  },
};

export default RecommendationResult;
