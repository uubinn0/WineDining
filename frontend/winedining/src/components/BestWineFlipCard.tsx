import React, { useState } from "react";
import { vh } from "../utils/vh";
import { Bottle } from "../types/seller";
import redWineImage from "../assets/types/red_wine.png";
import whiteWineImage from "../assets/types/white_wine.png";
import roseWineImage from "../assets/types/rose_wine.png";
import sparklingWineImage from "../assets/types/sparkling_wine.png";

interface BestWineFlipCardProps {
  bottle: Bottle;
  isBest: boolean; // 이 값에 따라 BEST 배지를 렌더링할지 결정
  onBestClick?: (bottleId: number) => void;
}

const BestWineFlipCard: React.FC<BestWineFlipCardProps> = ({ bottle, isBest, onBestClick }) => {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => setFlipped((prev) => !prev);

  const { wine } = bottle;

  const getDefaultImageByType = (type: string | undefined) => {
    switch (type?.toLowerCase()) {
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

  const imageSrc =
    wine.image && wine.image !== "no_image" && wine.image.trim() !== "" ? wine.image : getDefaultImageByType(wine.type);

  return (
    <div style={styles.cardContainer} onClick={toggleFlip}>
      <div
        style={{
          ...styles.cardInner,
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* 앞면 */}
        <div style={styles.cardFront}>
          {isBest && (
            <div
              style={styles.badge}
              onClick={(e) => {
                e.stopPropagation(); // 카드 플립 이벤트 방지
                if (onBestClick) {
                  onBestClick(bottle.bottleId);
                }
              }}
            >
              BEST
            </div>
          )}
          <div style={styles.imageBox}>
            <img src={imageSrc} alt={wine.name} style={styles.image} />
          </div>
          <p style={styles.name}>{wine.name}</p>
        </div>

        {/* 뒷면 */}
        <div style={styles.cardBack}>
          <p style={styles.infoText}>{wine.country}</p>
          <p style={styles.infoText}>{wine.grape}</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  cardContainer: {
    display: "inline-block",
    width: "33.33%", // 부모 너비의 1/3
    height: vh(18),
    perspective: "1000px",
    cursor: "pointer",
    position: "relative",
    verticalAlign: "top",
    marginRight: vh(1),
  },
  cardInner: {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s ease-in-out",
    transformOrigin: "center center",
  },
  cardFront: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: vh(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: vh(1.5),
  },
  cardBack: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    backgroundColor: "#2a0e35",
    borderRadius: vh(1),
    transform: "rotateY(180deg)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ffcc00",
    color: "#27052E",
    padding: `0 ${vh(1)}`,
    fontSize: vh(1.3),
    fontWeight: "bold",
    borderBottomLeftRadius: vh(1),
    borderTopRightRadius: vh(1),
    lineHeight: vh(2.5),
  },
  /* 이미지 박스 */
  imageBox: {
    height: vh(10),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  /* 이미지 */
  image: {
    height: "100%",
    objectFit: "contain",
  },
  name: {
    fontSize: vh(1.3),
    textAlign: "center",
    padding: `0 ${vh(0.5)}`,
    color: "white",
    marginTop: vh(1.3),
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  infoText: {
    fontSize: vh(1.4),
    marginBottom: vh(1),
  },
};

export default BestWineFlipCard;
