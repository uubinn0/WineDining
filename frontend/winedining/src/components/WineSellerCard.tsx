import React from "react";
import { Bottle } from "../types/seller";
import { vh } from "../utils/vh";

interface WineSellerCardProps {
  wine: Bottle;
  onBestClick: (bottleId: number) => void;
  onDetailClick: () => void;
  isBest: boolean;
  totalNote: number;
}

const WineSellerCard = ({ wine, onBestClick, onDetailClick, isBest, totalNote }: WineSellerCardProps) => {
  // 이미지 처리 (빈 문자열 또는 "no_image"면 샘플 이미지 사용)
  const wineImage =
    wine.wine.image && wine.wine.image !== "no_image" ? wine.wine.image : "/sample_image/wine_sample.jpg";

  return (
    <div style={styles.card}>
      {/* 와인 이미지 */}
      <div style={styles.imageBox}>
        <img
          src={wineImage}
          alt={wine.wine.name}
          style={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/sample_image/wine_sample.jpg";
          }}
        />
        {totalNote > 0 && <div style={styles.noteCountText}>{totalNote}</div>}
      </div>

      {/* 와인 정보 */}
      <div style={styles.info}>
        <div style={styles.name}>{wine.wine.name.toUpperCase()}</div>
        <div style={styles.grape}>
          {wine.wine.country} / {wine.wine.grape}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div style={styles.buttons}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isBest ? "#5A0000" : "#FFFFFF",
            color: isBest ? "#FFFFFF" : "#000000",
          }}
          onClick={() => onBestClick(wine.bottleId)}
        >
          {isBest ? "BEST" : "BEST"}
        </button>
        <button style={styles.button} onClick={onDetailClick}>
          자세히
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: "#27052E",
    border: "0.25vh solid #D6BA91", // 2px (2/8)
    borderRadius: "1.5vh", // 12px (12/8)
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25vh 1.875vh", // 10px 15px (10/8, 15/8)
    position: "relative",
    marginBottom: "1.875vh",
  },
  /* 와인 이미지 박스 */
  imageBox: {
    position: "relative",
    width: "7.5vh", // 60px (60/8)
    height: "7.5vh", // 60px (60/8)
    marginRight: "1.875vh", // 15px (15/8)
    borderRadius: "0.5vh", // 4px (4/8)
    backgroundColor: "#381837",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  /* 와인 이미지 */
  image: {
    width: "80%",
    height: "auto",
    objectFit: "contain",
  },
  /* 리뷰 개수 */
  noteCountText: {
    position: "absolute",
    bottom: "0.4vh",
    right: vh(-0.7),
    color: "white",
    fontSize: "1.1vh",
    padding: "0.3vh 0.6vh",
    borderRadius: "0.5vh",
    fontWeight: "bold",
    zIndex: 2,
    minWidth: "2.2vh",
    textAlign: "center",
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    color: "#FFD447",
    fontWeight: "bold",
    fontSize: "1.75vh", // 14px (14/8)
    marginBottom: "0.375vh", // 3px (3/8)
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "18.75vh", // 150px (150/8)
  },
  grape: {
    color: "#FFFFFF",
    fontSize: "1.5vh", // 12px (12/8)
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "0.625vh", // 5px (5/8)
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#FFFFFF",
    minWidth: "6.25vh", // 50px (50/8)
    color: "#000000",
    fontSize: "1.25vh", // 10px (10/8)
    border: "none",
    padding: "0.5vh 1vh", // 4px 8px (4/8, 8/8)
    borderRadius: "0.75vh", // 6px (6/8)
    cursor: "pointer",
  },
};

export default WineSellerCard;
