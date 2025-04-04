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
    <div style={styles.cardWrapper}>
      <div style={styles.card}>
        <img src={imageSrc} alt={wine.wine.name} style={styles.image} />

        <div style={styles.info}>
          <div style={styles.name}>{wine.wine.name.toUpperCase()}</div>
          <div style={styles.grape}>
            {wine.wine.country} / {wine.wine.grape}
          </div>
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
            {isBest ? "BEST" : "BEST"}
          </button>
          <button style={styles.button} onClick={onDetailClick}>
            자세히
          </button>
        </div>
      </div>
    </div>
  );
});

const styles: { [key: string]: React.CSSProperties } = {
  cardWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#27052E",
    border: `${vh(0.3)} solid #D6BA91`,
    borderRadius: vh(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${vh(1)} ${vh(2)}`,
    height: vh(12),
    flexWrap: "nowrap",
    position: "relative",
    fontFamily: "Galmuri7",
    width: "100%",
    minWidth: vh(36),
    margin: "0 auto",
  },
  image: {
    width: vh(6),
    height: vh(6),
    padding: vh(0.5),
    borderRadius: vh(0.5),
    objectFit: "contain",
    marginRight: vh(2),
    backgroundColor: "#381837",
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: vh(0.6),
    minWidth: 0,
  },
  name: {
    color: "#FFD447",
    fontSize: vh(2),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  grape: {
    color: "#FFFFFF",
    fontSize: vh(1.6),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: vh(0.4),
    marginLeft: vh(1),
    alignItems: "flex-end",
  },
  button: {
    fontFamily: "Galmuri7",
    backgroundColor: "#FFFFFF",
    minWidth: vh(7),
    color: "#000000",
    fontSize: vh(1.2),
    border: "none",
    padding: `${vh(0.6)} ${vh(1.2)}`,
    borderRadius: vh(0.6),
    cursor: "pointer",
  },
};

export default WineSellerCard;
