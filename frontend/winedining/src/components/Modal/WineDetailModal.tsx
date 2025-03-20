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

        {/* 와인 제목 */}
        <h2 style={styles.title}>{wine.en_name.toUpperCase()}</h2>
        <p style={styles.subTitle}>
          ‘{wine.create_at.split("-")[0]}’년에 만들어진 ‘{wine.type} 와인’
        </p>

        {/* 맛 그래프 */}
        <div style={styles.tasteGraph}>
          <div style={styles.tasteItem}>🇮🇹 {wine.country}</div>
          <div style={{ ...styles.tasteItem, backgroundColor: "#5a1a5e", color: "#fff" }}>🍷 풍미와 맛</div>
          <div style={styles.tasteItem}>{wine.grape}</div>
        </div>

        {/* 와인 특징 */}
        <div style={styles.tasteBars}>
          <p>당도</p> <ProgressBar value={wine.sweetness} />
          <p>산도</p> <ProgressBar value={wine.acidity} />
          <p>타닌</p> <ProgressBar value={wine.tannin} />
          <p>바디감</p> <ProgressBar value={wine.body} />
        </div>

        {/* 페어링 추천 */}
        <div style={styles.pairingSection}>
          <h3 style={styles.sectionTitle}>페어링 추천</h3>
          <p>{wine.pairing ? wine.pairing.join(" · ") : "-"}</p>
        </div>

        {/* 와인 상세 정보 */}
        <div style={styles.detailInfo}>
          <h3 style={styles.sectionTitle}>{wine.en_name.toUpperCase()}</h3>
          <p>✦ {wine.price ? `${wine.price.toLocaleString()}원` : "가격 정보 없음"}</p>
          <p>✦ 도수 {wine.alcohol_content ? `${wine.alcohol_content}%` : "정보 없음"}</p>
          <p>✦ 생산년도 {wine.create_at.split("-")[0]}년</p>
          <p>✦ 등록일 {wine.create_at}</p>
        </div>

        {/* 와인 이미지 */}
        <div style={styles.imageContainer}>
          <img
            src={wine.image !== "no_image" ? wine.image : "/sample_image/wine_sample.jpg"}
            alt={wine.kr_name}
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ value }: { value: number }) => (
  <div style={styles.progressBar}>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{ ...styles.progressDot, backgroundColor: i <= value ? "#fff" : "#7a4a8b" }} />
    ))}
  </div>
);

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
    backgroundColor: "#2a0e35",
    padding: "20px",
    borderRadius: "12px",
    width: "350px",
    maxWidth: "90%",
    color: "#fff",
    position: "relative",
    border: "3px solid #d4a5ff",
  },
  closeButton: {
    position: "absolute",
    right: "10px",
    top: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#fff",
    cursor: "pointer",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    fontSize: "12px",
    textAlign: "center",
    marginBottom: "10px",
  },
  tasteGraph: {
    display: "flex",
    justifyContent: "center",
    gap: "5px",
    marginBottom: "10px",
  },
  tasteItem: {
    padding: "8px",
    borderRadius: "50px",
    backgroundColor: "#3b1845",
    textAlign: "center",
    fontSize: "12px",
  },
  tasteBars: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "5px",
    alignItems: "center",
    marginBottom: "15px",
  },
  progressBar: {
    display: "flex",
    gap: "4px",
  },
  progressDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  pairingSection: {
    backgroundColor: "#3b1845",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "15px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#ffccff",
  },
  detailInfo: {
    backgroundColor: "#3b1845",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "left",
    marginBottom: "15px",
  },
  imageContainer: {
    textAlign: "center",
  },
  image: {
    width: "60px",
    height: "150px",
  },
};

export default WineDetailModal;
