import React, { useState } from "react";
import { Wine } from "../../types/wine";
import closebutton from "../../assets/icons/closebutton.png";
import { vh } from "../../utils/vh";
import redWineImage from "../../assets/types/red_wine.png";
import whiteWineImage from "../../assets/types/white_wine.png";
import roseWineImage from "../../assets/types/rose_wine.png";
import sparklingWineImage from "../../assets/types/sparkling_wine.png";

interface AddSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: (data: any) => void;
  wineInfo: Wine;
}

/* 국기 이미지 */
const flags = importAll(require.context("../../assets/flags", false, /\.png$/));

function importAll(r: __WebpackModuleApi.RequireContext) {
  let images: { [key: string]: string } = {};
  r.keys().forEach((item) => {
    const key = item.replace("./", "").replace(".png", ""); // '대한민국.png' → '대한민국'
    images[key] = r(item);
  });
  return images;
}

const AddSellerModal = ({ isOpen, onClose, onPrev, onNext, wineInfo }: AddSellerModalProps) => {
  // 상태 관리
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [drinkDate, setDrinkDate] = useState(getTodayDate());
  const [selectedCompanion, setSelectedCompanion] = useState<string>("혼자");
  const [food, setFood] = useState("");
  const [note, setNote] = useState("");
  const [taste, setTaste] = useState("");
  const [rating, setRating] = useState(0);

  const companions = ["혼자", "친구", "연인", "가족"];

  if (!isOpen) return null;

  const handleNext = () => {
    // 입력값 검증
    const validations = [
      { condition: !drinkDate, message: "마신 날짜를 선택해주세요!" },
      { condition: !food.trim(), message: "페어링한 음식을 입력해주세요!" },
      { condition: !note.trim(), message: "와인에 대한 느낌을 기록해주세요!" },
      { condition: !taste.trim(), message: "와인의 맛과 향을 입력해주세요!" },
      { condition: rating === 0, message: "평점을 선택해주세요!" },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        alert(validation.message);
        return;
      }
    }

    const drinkData = {
      wineId: wineInfo.wineId,
      drinkDate,
      companion: selectedCompanion,
      food,
      note,
      taste,
      rating,
    };
    onNext(drinkData);
  };

  const getDefaultImageByType = (type: string | undefined) => {
    switch (type?.toLowerCase()) {
      case "레드":
        return redWineImage;
      case "화이트":
        return whiteWineImage;
      case "로제":
        return roseWineImage;
      case "스파클링":
        return sparklingWineImage;
      default:
        return redWineImage;
    }
  };

  const getWineImage = () => {
    const img = wineInfo.image;
    if (!img || img === "no_image" || img === "") {
      return getDefaultImageByType((wineInfo as any).type || (wineInfo as any).typeName);
    }
    return img;
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <img src={closebutton} alt="닫기" style={styles.closeButton} onClick={onClose} />

        <h2 style={styles.title}>와인 수집</h2>
        <p style={styles.subtitle}>
          {wineInfo.grape}{" "}
          {flags[wineInfo.country] ? (
            <img src={flags[wineInfo.country]} alt={wineInfo.country} style={styles.flagIcon} />
          ) : (
            <span style={{ fontSize: "1.4vh", color: "#FFD447", marginLeft: "0.5vh" }}>{wineInfo.country}</span>
          )}
        </p>

        <div style={styles.wineContainer}>
          <img src={getWineImage()} alt="와인" style={styles.wineImage} />
          <p style={styles.wineName}>{wineInfo.name.toUpperCase()}</p>
        </div>

        <div style={styles.section}>
          <span style={styles.label}>마신 날짜</span>
          <input
            type="date"
            value={drinkDate}
            onChange={(e) => setDrinkDate(e.target.value)}
            style={styles.dateInput}
          />
        </div>

        <div style={styles.section}>
          <span style={styles.label}>누구랑?</span>
          <div style={styles.companionContainer}>
            {companions.map((companion) => (
              <button
                key={companion}
                onClick={() => setSelectedCompanion(companion)}
                style={{
                  ...styles.companionButton,
                  backgroundColor: selectedCompanion === companion ? "#d4a017" : "transparent",
                }}
              >
                {companion}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <span style={styles.label}>안주는?</span>
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="어떤 음식과 페어링 하셨나요?"
            style={styles.textInput}
          />
        </div>

        <div style={styles.section}>
          <span style={styles.label}>내용</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="와인을 마시면서 느낀 점을 기록해주세요"
            style={styles.textArea}
          />
        </div>

        <div style={styles.section}>
          <span style={styles.label}>맛</span>
          <input
            type="text"
            value={taste}
            onChange={(e) => setTaste(e.target.value)}
            placeholder="와인의 맛과 향을 입력해주세요"
            style={styles.textInput}
          />
        </div>

        <div style={styles.section}>
          <span style={styles.label}>평점</span>
          <div style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                onClick={() => setRating(value)}
                style={{
                  ...styles.ratingStar,
                  color: value <= rating ? "#d4a017" : "#666",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div style={styles.pagination}>
          <span style={styles.pageArrow} onClick={onPrev}>
            ←
          </span>
          <span style={styles.pageText}>2 / 3</span>
          <span style={styles.pageArrow} onClick={handleNext}>
            →
          </span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  /* 오버레이 스타일 */
  overlay: {
    position: "fixed",
    left: -21,
    right: -20,
    top: -6,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    transition: "opacity 0.3s ease",
  },
  /* 모달 스타일 */
  modal: {
    width: "90vw",
    maxWidth: "500px",
    height: "85vh",
    // top: "-32vh",
    left: 0,
    padding: "2.5vh",
    marginBottom: "auto",
    backgroundColor: "#2a0e35",
    border: "0.6vh solid #FDEBD0",
    borderRadius: "1.3vh",
    overflowY: "hidden",
    boxSizing: "border-box",
    scrollbarWidth: "none",
    flexDirection: "column",
    display: "flex",
    transition: "transform 0.3s ease",
    fontFamily: "Galmuri9",
    textAlign: "center",
    position: "relative",
  },
  /* 닫기 버튼 */
  closeButton: {
    position: "absolute",
    top: "1.2vh",
    right: "1.2vh",
    width: "4vh",
    height: "4vh",
    cursor: "pointer",
  },
  /* 제목 */
  title: {
    textAlign: "left",
    fontSize: "2vh",
    fontWeight: "bold",
    marginLeft: vh(-1),
    marginTop: "-1vh",
  },
  /* 부제목 */
  subtitle: {
    textAlign: "left",
    fontSize: "1.5vh",
    color: "#ccc",
    marginLeft: vh(-1),
    marginTop: "-1vh",
  },
  /* 국기 아이콘 */
  flagIcon: {
    width: vh(1.8),
    height: vh(1.2),
  },
  /* 와인 설명 감싸는 박스 */
  wineContainer: {
    textAlign: "center",
    marginBottom: vh(2),
  },
  wineImage: {
    width: vh(15),
    height: "auto",
    marginBottom: vh(2),
    marginTop: vh(2),
  },
  wineName: {
    fontSize: vh(1.6),
    fontWeight: "bold",
    color: "#ffcc00",
    marginTop: vh(0.8),
  },
  section: {
    display: "flex",
    justifyContent: "space-between",
    margin: `${vh(0.8)} 0`,
    textAlign: "left",
  },
  /* 마신 날짜, 누구랑, 안주는, 내용, 맛, 평점 */
  label: {
    fontWeight: "bold",
    width: vh(10),
    fontSize: vh(1.8),
  },
  value: {
    color: "#bbb",
    textAlign: "right",
    flex: 1,
    fontSize: vh(1.8),
  },
  note: {
    fontSize: vh(1.8),
    color: "#888",
    textAlign: "right",
    flex: 1,
  },
  /* 페이지네이션 */
  pagination: {
    marginTop: vh(5),
    textAlign: "center",
    fontSize: vh(1.5),
    color: "white",
  },
  pageArrow: {
    margin: `0 ${vh(1.5)}`,
    cursor: "pointer",
  },
  pageText: {
    fontSize: vh(1.5),
  },
  /* 값 넣는 입력 부분 */
  dateInput: {
    backgroundColor: "transparent",
    border: `${vh(0.1)} solid white`,
    borderRadius: vh(0.4),
    color: "white",
    padding: `${vh(0.4)} ${vh(0.8)}`,
    outline: "none",
    colorScheme: "light",
    fontFamily: "Galmuri9",
  },
  textInput: {
    backgroundColor: "transparent",
    border: `${vh(0.1)} solid white`,
    borderRadius: vh(0.4),
    color: "white",
    padding: `${vh(0.4)} ${vh(0.8)}`,
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
    outline: "none",
    fontFamily: "Galmuri9",
  },
  textArea: {
    backgroundColor: "transparent",
    border: `${vh(0.1)} solid white`,
    borderRadius: vh(0.4),
    color: "white",
    padding: vh(0.8),
    width: vh(25),
    height: vh(10),
    resize: "none",
    outline: "none",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
    fontFamily: "Galmuri9",
  },

  /* 누구랑? 선택 박스 */
  companionContainer: {
    display: "flex",
    gap: vh(0.8),
  },
  companionButton: {
    padding: `${vh(0.4)} ${vh(0.8)}`,
    border: `${vh(0.1)} solid white`,
    borderRadius: vh(0.4),
    color: "white",
    cursor: "pointer",
    fontSize: vh(1.5),
    fontFamily: "Galmuri9",
  },
  /* 평점 선택 박스 */
  ratingContainer: {
    display: "flex",
    gap: vh(1),
  },
  ratingStar: {
    cursor: "pointer",
    fontSize: vh(2),
  },
};

export default AddSellerModal;
