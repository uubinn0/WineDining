import React, { useState } from "react";
import { Wine } from "../../types/wine";
import closebutton from "../../assets/icons/closebutton.png";

interface AddSeller2ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: (data: any) => void;
  wineInfo: Wine;
}

const AddSeller2Modal = ({ isOpen, onClose, onPrev, onNext, wineInfo }: AddSeller2ModalProps) => {
  // 상태 관리
  const [drinkDate, setDrinkDate] = useState("");
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

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <img src={closebutton} alt="닫기" style={styles.closeButton} onClick={onClose} />

        <h2 style={styles.title}>와인 수집</h2>
        <p style={styles.subtitle}>
          {wineInfo.grape}
          <img src={`/flags/${wineInfo.country}.png`} alt={wineInfo.country} style={styles.flagIcon} />
        </p>

        <div style={styles.wineContainer}>
          <img src={wineInfo.image || "/sample_image/whitewine_pixel.png"} alt="와인" style={styles.wineImage} />
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

// 기존 스타일에 추가
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#2a0e35",
    padding: "24px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "400px",
    border: "5px solid #d4a017",
    position: "relative",
    color: "white",
    fontFamily: "Galmuri9",
    textAlign: "left",
  },
  closeButton: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "24px",
    height: "24px",
    cursor: "pointer",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "13px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  flagIcon: {
    width: "18px",
    height: "12px",
  },
  wineContainer: {
    textAlign: "center",
    marginBottom: "16px",
  },
  wineImage: {
    width: "80px",
    height: "auto",
  },
  wineName: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffcc00",
    marginTop: "8px",
  },
  section: {
    display: "flex",
    justifyContent: "space-between",
    margin: "8px 0",
  },
  label: {
    fontWeight: "bold",
    width: "80px",
  },
  value: {
    color: "#bbb",
    textAlign: "right",
    flex: 1,
  },
  note: {
    fontSize: "12px",
    color: "#888",
    textAlign: "right",
    flex: 1,
  },
  pagination: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "white",
  },
  pageArrow: {
    margin: "0 12px",
    cursor: "pointer",
  },
  pageText: {
    fontSize: "14px",
  },
  dateInput: {
    backgroundColor: "transparent",
    border: "1px solid #d4a017",
    borderRadius: "4px",
    color: "white",
    padding: "4px 8px",
    outline: "none",
  },
  textInput: {
    backgroundColor: "transparent",
    border: "1px solid #d4a017",
    borderRadius: "4px",
    color: "white",
    padding: "4px 8px",
    width: "200px",
    outline: "none",
  },
  textArea: {
    backgroundColor: "transparent",
    border: "1px solid #d4a017",
    borderRadius: "4px",
    color: "white",
    padding: "8px",
    width: "200px",
    height: "80px",
    resize: "none",
    outline: "none",
  },
  companionContainer: {
    display: "flex",
    gap: "8px",
  },
  companionButton: {
    padding: "4px 8px",
    border: "1px solid #d4a017",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
  },
  ratingContainer: {
    display: "flex",
    gap: "8px",
  },
  ratingStar: {
    cursor: "pointer",
    fontSize: "20px",
  },
};

export default AddSeller2Modal;
