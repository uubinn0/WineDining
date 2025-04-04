import React, { useEffect, memo } from "react";
import { Bottle } from "../types/seller";
import { vh } from "../utils/vh";

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
    border: `${vh(0.3)} solid #D6BA91`,
    borderRadius: vh(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${vh(0)} ${vh(1)}`,
    height: vh(10),
    position: "relative",
    fontFamily: "Galmuri7",
  },
  image: {
    width: vh(5),
    height: "auto",
    padding: vh(1),
    borderRadius: vh(0.5),
    objectFit: "contain",
    margin: vh(1),
    backgroundColor: "#381837",
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: `0 ${vh(0.5)}`,
    gap: vh(0.8),
  },
  name: {
    color: "#FFD447",
    fontWeight: "bold",
    fontSize: vh(1.6),
  },
  grape: {
    color: "#FFFFFF",
    fontSize: vh(1.4),
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: vh(0.5),
    marginRight: vh(1),
    alignItems: "flex-end",
  },
  button: {
    fontFamily: "Galmuri7",
    backgroundColor: "#FFFFFF",
    minWidth: vh(6),
    color: "#000000",
    fontSize: vh(1.2),
    border: "none",
    padding: `${vh(0.6)} ${vh(1.2)}`,
    borderRadius: vh(0.6),
    cursor: "pointer",
  },
};

export default WineSellerCard;
