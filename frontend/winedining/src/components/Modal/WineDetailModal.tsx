import React from "react";
import { Wine } from "../../types/wine";

interface WineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  wine: Wine;
}

const WineDetailModal = ({ isOpen, onClose, wine }: WineDetailModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div style={styles.content}>
          <h2>{wine.name}</h2>
          <div style={styles.details}>
            <p>종류: {wine.type}</p>
            <p>국가: {wine.country}</p>
            <p>가격: {wine.price.toLocaleString()}원</p>
            <p>연도: {wine.year}</p>
            <p>당도: {wine.sweet}</p>
            <p>산도: {wine.acidic}</p>
            <p>바디: {wine.body}</p>
          </div>
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
  },
  details: {
    marginTop: "20px",
  },
};

export default WineDetailModal;
