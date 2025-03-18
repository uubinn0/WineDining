import React from "react";
import { Wine } from "../../types/wine";

interface WineSellerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  wine: Wine;
}

/* 이 곳은 내가 기록 남긴 와인을 보는 모달임 */
const WineSellerDetailModal = ({ isOpen, onClose, wine }: WineSellerDetailModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div style={styles.content}>
          <h2>
            {wine.kr_name} ({wine.en_name})
          </h2>
          <img src={wine.image || "/sample_image/wine_sample.jpg"} alt={wine.kr_name} style={styles.image} />

          <div style={styles.details}>
            <p>종류: {wine.type}</p>
            <p>국가: {wine.country}</p>
            <p>포도 품종: {wine.grape}</p>
            <p>가격: {wine.price ? `${wine.price.toLocaleString()}원` : "가격 정보 없음"}</p>
            <p>당도: {wine.sweetness}</p>
            <p>산도: {wine.acidity}</p>
            <p>바디: {wine.body}</p>
            <p>타닌: {wine.tannin || "해당 없음"}</p>
            <p>도수: {wine.alcohol_content ? `${wine.alcohol_content}%` : "정보 없음"}</p>
            <p>추천 음식: {wine.pairing ? wine.pairing.join(", ") : "추천 없음"}</p>
          </div>

          <button style={styles.likeButton}>❤️ 좋아요</button>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    position: "relative",
    maxHeight: "90vh",
    overflow: "auto",
  },
  closeButton: {
    position: "absolute",
    right: "10px",
    top: "10px",
    border: "none",
    background: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  content: {
    marginTop: "20px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  details: {
    marginTop: "20px",
    textAlign: "left",
  },
  likeButton: {
    marginTop: "15px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default WineSellerDetailModal;
