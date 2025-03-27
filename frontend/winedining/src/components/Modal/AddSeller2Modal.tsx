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
  const [drinkDate] = useState("2025.03.18");
  const companions = ["친구", "연인", "가족", "혼자"];
  const taste = "초코릿 향";
  const rating = 5;

  if (!isOpen) return null;

  const handleNext = () => {
    const drinkData = {
      wineId: wineInfo.wineId,
      bottleId: wineInfo.wineId,
      drinkDate,
      companion: companions.join(" "),
      food: "입력",
      note: "누구랑 드셨는지 무슨 느낌이셨는지 기록해둬요!",
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
          품종이 들어가는 자리
          <img src={`/flags/${wineInfo.country}.png`} alt={wineInfo.country} style={styles.flagIcon} />
        </p>

        <div style={styles.wineContainer}>
          <img src={wineInfo.image || "/sample_image/whitewine_pixel.png"} alt="와인" style={styles.wineImage} />
          <p style={styles.wineName}>{wineInfo.name.toUpperCase()}</p>
        </div>

        <div style={styles.section}>
          <span style={styles.label}>마신 날짜</span>
          <span style={styles.value}>{drinkDate}</span>
        </div>
        <div style={styles.section}>
          <span style={styles.label}>누구랑?</span>
          <span style={styles.value}>{companions.join(" ")}</span>
        </div>
        <div style={styles.section}>
          <span style={styles.label}>안주는?</span>
          <span style={styles.value}>입력</span>
        </div>
        <div style={styles.section}>
          <span style={styles.label}>내용</span>
          <span style={styles.note}>
            누구랑 드셨는지
            <br />
            무슨 느낌이셨는지
            <br />
            기록해둬요!
          </span>
        </div>
        <div style={styles.section}>
          <span style={styles.label}>맛</span>
          <span style={styles.value}>{taste}</span>
        </div>
        <div style={styles.section}>
          <span style={styles.label}>평점</span>
          <span style={styles.value}>
            1 2 3 4 <b>{rating}</b>
          </span>
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
};

export default AddSeller2Modal;
