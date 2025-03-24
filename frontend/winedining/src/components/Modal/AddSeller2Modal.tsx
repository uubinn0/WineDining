import React, { useState } from "react";
import { Wine } from "../../types/wine";

interface AddSeller2ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: (data: any) => void;
  wineInfo: Wine;
}

const AddSeller2Modal = ({ isOpen, onClose, onPrev, onNext, wineInfo }: AddSeller2ModalProps) => {
  const [drinkDate, setDrinkDate] = useState(new Date().toISOString().split("T")[0]);
  const [companion, setCompanion] = useState<string>("");
  const [food, setFood] = useState("");
  const [note, setNote] = useState("");
  const [taste, setTaste] = useState("");
  const [rating, setRating] = useState<number>(0);

  const companions = ["혼자", "친구", "연인", "가족"];

  if (!isOpen) return null;

  const handleNext = () => {
    const drinkData = {
      wineId: wineInfo.wine_id,
      bottleId: wineInfo.wine_id,
      drinkDate,
      companion,
      food,
      note,
      taste,
      rating,
    };

    console.log("저장된 데이터:", drinkData);
    onNext(drinkData);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <h2 style={styles.title}>와인 수집</h2>
        <p style={styles.subtitle}>
          {wineInfo.grape} |{" "}
          <img src={`/flags/${wineInfo.country}.png`} alt={wineInfo.country} style={styles.flagIcon} />
        </p>

        {/* 와인 이미지, 이름 */}
        <div style={styles.wineContainer}>
          <img
            src={wineInfo.image !== "no_image" ? wineInfo.image : "/sample_image/wine_bottle.png"}
            alt={wineInfo.kr_name}
            style={styles.wineImage}
          />
          <p style={styles.wineName}>
            {wineInfo.kr_name} / {wineInfo.en_name}
          </p>
        </div>

        {/* 마신 날짜 */}
        <div style={styles.formGroup}>
          <label style={styles.label}>마신 날짜</label>
          <input type="date" value={drinkDate} onChange={(e) => setDrinkDate(e.target.value)} style={styles.input} />
        </div>

        {/* 누구랑? */}
        <div style={styles.formGroup}>
          <label style={styles.label}>누구랑?</label>
          <div style={styles.optionButtons}>
            {companions.map((comp) => (
              <button
                key={comp}
                onClick={() => setCompanion(comp)}
                style={{
                  ...styles.optionButton,
                  backgroundColor: companion === comp ? "#d4a5ff" : "transparent",
                }}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* 안주 */}
        <div style={styles.formGroup}>
          <label style={styles.label}>안주는?</label>
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            style={styles.input}
            placeholder="무슨 안주랑 드셨나요?"
          />
        </div>

        {/* 내용 */}
        <div style={styles.formGroup}>
          <label style={styles.label}>내용</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={styles.textarea}
            placeholder="누구랑 드셨는지 무슨 느낌이셨는지 기록해둬요!"
          />
        </div>

        {/* 맛 */}
        <div style={styles.formGroup}>
          <label style={styles.label}>맛</label>
          <input
            type="text"
            value={taste}
            onChange={(e) => setTaste(e.target.value)}
            style={styles.input}
            placeholder="무슨 맛이었는지 표현해주세요."
          />
        </div>

        {/* 평점 */}
        <div style={styles.formGroup}>
          <label style={styles.label}>평점</label>
          <div style={styles.optionButtons}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setRating(num)}
                style={{
                  ...styles.optionButton,
                  backgroundColor: rating === num ? "#d4a5ff" : "transparent",
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* 페이지 이동 */}
        <div style={styles.pagination}>
          <button style={styles.navButton} onClick={onPrev}>
            ←
          </button>
          <span>2 / 3</span>
          <button style={styles.navButton} onClick={handleNext}>
            →
          </button>
        </div>
      </div>
    </div>
  );
};

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
    padding: "20px",
    borderRadius: "25px",
    width: "350px",
    height: "600px",
    color: "#fff",
    position: "relative",
    border: "3px solid #d4a5ff",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  closeButton: {
    position: "absolute",
    right: "15px",
    top: "15px",
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#fff",
    cursor: "pointer",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    textAlign: "center",
    color: "#d4a5ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
  },
  flagIcon: {
    width: "20px",
    height: "14px",
  },
  wineContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  wineImage: {
    width: "120px",
    height: "180px",
  },
  wineName: {
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffcc00",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "14px",
    color: "#d4a5ff",
  },
  input: {
    backgroundColor: "transparent",
    border: "1px solid #d4a5ff",
    borderRadius: "4px",
    padding: "8px",
    color: "white",
    fontSize: "14px",
  },
  textarea: {
    backgroundColor: "transparent",
    border: "1px solid #d4a5ff",
    borderRadius: "4px",
    padding: "8px",
    color: "white",
    fontSize: "14px",
    minHeight: "60px",
    resize: "none",
  },
  optionButtons: {
    display: "flex",
    gap: "10px",
  },
  optionButton: {
    flex: 1,
    padding: "8px",
    border: "1px solid #d4a5ff",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px",
    gap: "10px",
  },
  navButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default AddSeller2Modal;
