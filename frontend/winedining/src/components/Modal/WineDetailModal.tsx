import React from "react";
import { Wine, WineDetail } from "../../types/wine";
import { useDispatch, UseDispatch, useSelector, UseSelector } from "react-redux";
import { addWish, removeWish } from "../../store/slices/wishSlice";
import { RootState, AppDispatch } from "../../store/store";
import { WishItem } from "../../types/wish";
import closeButton from "../../assets/icons/closebutton.png";

interface WineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  wine: WineDetail;
}

const WineDetailModal = ({ isOpen, onClose, wine }: WineDetailModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const wishList = useSelector((state: RootState) => state.wish.items);
  const isInWishList = wishList.some((wish: WishItem) => wish.wine.wineId === wine.wineId);

  const handleWishToggle = () => {
    if (!wine.wineId) return;
    if (isInWishList) {
      dispatch(removeWish(wine.wineId));
    } else {
      dispatch(addWish(wine.wineId));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <img src={closeButton} alt="닫기" style={styles.closeButton} onClick={onClose} />

        {/* 와인 제목 */}
        <h2 style={styles.title}>{wine.enName.toUpperCase()}</h2>
        <p style={styles.subTitle}>
          {wine.type} 와인 / {wine.country}
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

        <div style={styles.detailWrapper}>
          {/* 와인 상세 정보 */}
          <div style={styles.detailInfo}>
            <h3 style={styles.sectionTitle}>{wine.enName.toUpperCase()}</h3>
            <p>✦ {wine.price ? `${wine.price.toLocaleString()}원` : "가격 정보 없음"}</p>
            <p>✦ 도수 {wine.alcoholContent ? `${wine.alcoholContent}%` : "정보 없음"}</p>
          </div>

          {/* 와인 이미지 */}
          <div style={styles.imageContainer}>
            <img
              src={wine.image !== "no_image" ? wine.image : "../../assets/images/winesample/defaultwine.png"}
              alt={wine.krName}
              style={styles.image}
            />
          </div>
        </div>

        {/* 담기 버튼 */}
        <button
          style={{
            ...styles.button,
            backgroundColor: isInWishList ? "#5A0000" : "#FFFFFF",
            color: isInWishList ? "#FFFFFF" : "#000000",
          }}
          onClick={handleWishToggle}
        >
          {isInWishList ? "담김" : "담기"}
        </button>
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
    borderRadius: "1.3vh",
    maxWidth: "90%",
    color: "#fff",
    position: "relative",
    border: "1vh solid #d4a5ff",
    // top: "0vh",
    width: "calc( 50 * var(--custom-vh))",
    height: "95%",
    padding: "2.5vh",
    paddingTop: "1vh",
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    boxSizing: "border-box",
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "column",
  },
  closeButton: {
    position: "absolute",
    top: "1vh",
    right: "1vh",
    width: "5vh",
    height: "5vh",
    cursor: "pointer",
    zIndex: 2000,
    // alignSelf: "flex-end",
  },
  detailWrapper: {
    display: "flex",
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
  // 프로그레스 바
  progressDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#7a4a8b",
    boxShadow: "inset 0 0 3px #000",
  },
  pairingSection: {
    backgroundColor: "#3b1845",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "13px",
    color: "#f3f3f3",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#ffccff",
  },
  detailInfo: {
    backgroundColor: "#3b1845",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "left",
    marginBottom: "15px",
    fontSize: "13px",
    color: "#fff",
    lineHeight: "1.6",
  },
  imageContainer: {
    textAlign: "center",
    marginTop: "10px",
  },
  image: {
    width: "70px",
    height: "160px",
    objectFit: "contain",
    filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))",
  },
  button: {
    backgroundColor: "#FFFFFF",
    width: "5vh",
    color: "#000000",
    fontSize: "1.5vh",
    border: "none",
    padding: "4px 8px",
    borderRadius: "6px",
    cursor: "pointer",
    alignSelf: "center",
    marginTop: "2vh",
  },
};

export default WineDetailModal;
