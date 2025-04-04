import React, { useEffect, memo } from "react";
import { Bottle } from "../types/seller";

interface WineSellerCardProps {
  wine: Bottle;
  onBestClick: (bottleId: number) => void;
  onDetailClick: () => void;
  isBest: boolean;
}

const WineSellerCard = memo(({ wine, onBestClick, onDetailClick, isBest }: WineSellerCardProps) => {
  const isValidImage =
    wine.wine.image &&
    wine.wine.image !== "no_image" &&
    wine.wine.image.trim() !== "" &&
    wine.wine.image.startsWith("http");

  const imageSrc = isValidImage ? wine.wine.image : "/sample_image/wine_sample.jpg";

  return (
    <div style={styles.card}>
      <img src={imageSrc} alt={wine.wine.name} style={styles.image} />

      <div style={styles.info}>
        <div style={styles.name}>{wine.wine.name.toUpperCase()}</div>
        <div style={styles.grape}>{wine.wine.grape}</div>
      </div>

      <div style={styles.buttons}>
        <button
          style={{
            ...styles.button,
            fontFamily: "galmuri7",
            backgroundColor: isBest ? "#5A0000" : "#FFFFFF",
            color: isBest ? "#FFFFFF" : "#000000",
          }}
          onClick={() => onBestClick(wine.bottleId)}
        >
          BEST
        </button>
        <button style={styles.button} onClick={onDetailClick}>
          자세히
        </button>
      </div>
    </div>
  );
});

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: "#27052E",
    border: "2px solid #D6BA91",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px, 15px",
    height: "80px",
    position: "relative",
  },
  image: {
    width: "40px",
    height: "auto",
    padding: "10px",
    borderRadius: "4px",
    objectFit: "contain",
    margin: "10px",
    backgroundColor: "#381837",
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 4px",
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
    marginRight: "10px",
    alignItems: "flex-end",
  },
  button: {
    fontFamily: "galmuri7",
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
