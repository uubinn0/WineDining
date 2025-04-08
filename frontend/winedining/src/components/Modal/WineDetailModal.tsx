import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWish, removeWish } from "../../store/slices/wishSlice";
import { RootState, AppDispatch } from "../../store/store";
import { WishItem } from "../../types/wish";
import closeButton from "../../assets/icons/closebutton.png";
import redWineImage from "../../assets/types/red_wine.png";
import whiteWineImage from "../../assets/types/white_wine.png";
import roseWineImage from "../../assets/types/rose_wine.png";
import sparklingWineImage from "../../assets/types/sparkling_wine.png";
import { WineDetail } from "../../types/wine";
import { trackEvent } from "../../utils/analytics"; // GA 이벤트 트래커 추가
import { vh } from "../../utils/vh";

interface WineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  wine: WineDetail;
  fromPage?: string; // 어디서 왔는지 (ex: 'wishlist' or 'winelist')
}

const WineDetailModal = ({ isOpen, onClose, wine, fromPage }: WineDetailModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const wishList = useSelector((state: RootState) => state.wish.items);
  const isInWishList = wishList.some((wish: WishItem) => wish.wine.wineId === wine.wineId);

  if (!isOpen) return null;

  const handleWishToggle = () => {
    if (!wine.wineId) return;

    const fromParam = fromPage || "detail";

    if (isInWishList) {
      trackEvent("remove_item", {
        wineId: wine.wineId,
        krName: wine.krName,
        from: fromParam,
      });
      dispatch(removeWish(wine.wineId));
    } else {
      trackEvent("add_item", {
        wineId: wine.wineId,
        krName: wine.krName,
        from: fromParam,
      });
      dispatch(addWish(wine.wineId));
    }
  };

  // 와인 타입별 기본 이미지
  const getDefaultImageByType = (type: string) => {
    switch (type.toLowerCase()) {
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
    if (!wine.image || wine.image === "no_image") {
      return getDefaultImageByType(wine.type);
    }
    return wine.image;
  };

  const pairingItems = (() => {
    const items = wine.pairing ? [...wine.pairing] : [];
    while (items.length < 3) {
      items.push("-");
    }
    return items.slice(0, 3);
  })();

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <img src={closeButton} alt="닫기" style={styles.closeButton} onClick={onClose} />

        <div style={styles.title}>{wine.krName}</div>
        <p style={styles.subTitle}>
          ‘{wine.country}’에서 생산된 ‘{wine.type} 와인’
        </p>

        <h3 style={styles.sectionHighlight}>맛 그래프</h3>
        <div style={styles.tasteGraph}>
          <div style={styles.tasteItem}>{wine.country}</div>
          <div style={{ ...styles.tasteItem, backgroundColor: "#230628", color: "#fff" }}>{wine.grape}</div>
          <div style={styles.tasteItem}>{wine.type}</div>
        </div>

        <div style={styles.tasteBars}>
          <p style={styles.label}>당도</p>
          <ProgressBar value={wine.sweetness} />
          <p style={styles.label}>산도</p>
          <ProgressBar value={wine.acidity} />
          <p style={styles.label}>타닌</p>
          <ProgressBar value={wine.tannin} />
          <p style={styles.label}>바디감</p>
          <ProgressBar value={wine.body} />
        </div>

        <h3 style={styles.sectionHighlight}>페어링 추천</h3>
        <div style={styles.pairingSection}>
          <div style={styles.pairingItems}>
            {pairingItems.map((item, index) => (
              <div key={index} style={styles.pairingText}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.detailWrapper}>
          <div style={styles.detailInfo}>
            <p>✦ {wine.price ? `${wine.price.toLocaleString()}원` : "가격 정보 없음"}</p>
            <p>✦ 도수 {wine.alcoholContent ? `${wine.alcoholContent}%` : "정보 없음"}</p>
          </div>
          <div style={styles.imageContainer}>
            <img src={getWineImage()} alt={wine.krName} style={styles.image} />
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
      <div
        key={i}
        style={{
          ...styles.progressDot,
          backgroundColor: i <= value ? "#fefefe" : "#000",
        }}
      />
    ))}
  </div>
);

export default WineDetailModal;

// 스타일
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#2a0e35",
    borderRadius: "1.3vh",
    maxWidth: "90vw",
    color: "#fff",
    position: "relative",
    border: "0.5vh solid #D6BA91",
    width: "90vw",
    height: "87vh",
    padding: "2.5vh",
    paddingTop: "1vh",
    overflowY: "auto",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    scrollbarWidth: "none",
  },
  closeButton: {
    position: "absolute",
    top: "1vh",
    right: "1vh",
    width: "5vh",
    height: "5vh",
    cursor: "pointer",
    zIndex: 2000,
  },
  title: {
    marginTop: "1vh",
    fontSize: "2.3vh",
    maxWidth: "60vw",
    fontWeight: "bold",
    textAlign: "left",
  },
  subTitle: {
    fontSize: "1.8vh",
    textAlign: "left",
    marginBottom: "1.5vh",
  },
  sectionHighlight: {
    fontSize: "2vh",
    color: "#FFD991",
    marginBottom: "1vh",
  },
  tasteGraph: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5vh",
    padding: "1vh 0",
    marginBottom: "1vh",
  },
  tasteItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    width: "10vh",
    height: "10vh",
    color: "#000",
    backgroundColor: "#C9C0CA",
    fontSize: "1.6vh",
    textAlign: "center",
  },
  /* 맛 담는 부분 */
  tasteBars: {
    display: "grid",
    gridTemplateColumns: "6vh 1fr",
    columnGap: "1.5vh",
    alignItems: "center",
    marginBottom: "1.5vh",
    width: "100%",
  },
  label: {
    fontSize: "1.8vh",
    minWidth: "14vw",
    textAlign: "left",
    padding: "0 2vw",
    color: "#fff",
  },
  progressBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    height: "2.2vh",
    padding: "0.5vh 0.6vh",
    borderRadius: "1vh",
    backgroundColor: "#4e2b58",
    boxSizing: "border-box",
  },
  progressDot: {
    width: "1.5vh",
    height: "1.5vh",
    borderRadius: "50%",
    backgroundColor: "#d3bfe4",
    boxShadow: "inset 0 0 0.2vh #000",
  },
  /* 페어링 부분 */
  pairingSection: {
    // backgroundColor: "#3b1845",
    padding: "2vh",
    borderRadius: "0.8vh",
    textAlign: "center",
    marginBottom: "1.5vh",
    fontSize: "1.5vh",
    color: "#f3f3f3",
    boxSizing: "border-box",
  },
  pairingItems: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 1vh",
  },
  pairingText: {
    flex: 1,
    textAlign: "center",
    fontSize: "1.75vh",
  },
  detailWrapper: {
    display: "flex",
    gap: "1vh",
    marginBottom: "1vh",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  /* 와인 이미지 */
  image: {
    width: "14vh",
    // maxHeight: "10vh",
    objectFit: "contain",
    filter: "drop-shadow(0 0 0.5vh rgba(255, 255, 255, 0.4))",
    marginRight: vh(10),
  },
  detailInfo: {
    // padding: "1vh",
    borderRadius: "0.8vh",
    // textAlign: "left",
    fontSize: "1.5vh",
    color: "#fff",
    lineHeight: 1.5,
    flex: 1,
    marginRight: vh(0),
    marginTop: vh(1.5),
  },
  button: {
    position: "absolute",
    display: "inline-block",
    bottom: "2vh",
    right: "2vh",
    width: "8vh",
    padding: "1vh",
    border: "none",
    borderRadius: "0.6vh",
    cursor: "pointer",
    fontSize: "1.8vh",
    backgroundColor: "#ddd",
    color: "#000000",
    fontFamily: "Galmuri7",
    textAlign: "center",
    boxShadow: `${vh(0.6)} ${vh(0.6)} 0 #000`,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
};
