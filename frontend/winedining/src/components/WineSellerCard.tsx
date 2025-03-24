import React from "react";
import { Wine } from "../types/wine";

interface WineSellerCardProps {
  wine: Wine;
  onBestClick: (wine: Wine) => void;
  isBest: boolean;
}

// api 연결하면서 해야 할 일
// 1. 내꺼만 가져오기
// 2. 베스트 누를 때, best 여부 전송하기

const WineSellerCard = ({ wine, onBestClick, isBest }: WineSellerCardProps) => {
  return (
    <div style={styles.card}>
      <img
        src={wine.image !== "no_image" ? wine.image : "/sample_image/wine_sample.jpg"}
        alt={wine.kr_name}
        style={styles.image}
      />

      <div style={styles.info}>
        <div style={styles.name}>{wine.kr_name.toUpperCase()}</div>
        <div style={styles.grape}>{wine.grape}</div>
      </div>

      <div style={styles.buttons}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isBest ? "#5A0000" : "#FFFFFF", // 빨간색 토글
            color: isBest ? "#FFFFFF" : "#000000",
          }}
          onClick={() => onBestClick(wine)}
        >
          BEST
        </button>
        <button style={styles.button}>자세히</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: "#27052E",
    border: "2px solid #D6BA91",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 15px",
    height: "70px",
    position: "relative",
    fontFamily: "Pixel, sans-serif",
  },
  image: {
    width: "40px",
    height: "auto",
    padding: "10px",
    borderRadius: "4px",
    objectFit: "contain",
    marginRight: "15px",
    backgroundColor: "#381837",
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
    fontSize: "16px",
  },
  grape: {
    color: "#FFFFFF",
    fontSize: "12px",
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#FFFFFF",
    minWidth: "50px",
    color: "#000000",
    fontSize: "10px",
    border: "none",
    padding: "4px 8px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default WineSellerCard;
