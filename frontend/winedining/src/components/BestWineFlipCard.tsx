import React, { useState } from "react";
import { vh } from "../utils/vh";
import sampleimg from "../assets/images/winesample/defaultwine.png";
import { Bottle } from "../types/seller";

interface BestWineFlipCardProps {
  bottle: Bottle;
}

const BestWineFlipCard: React.FC<BestWineFlipCardProps> = ({ bottle }) => {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => setFlipped((prev) => !prev);

  const { wine } = bottle;
  const isValidImage =
    wine.image && wine.image !== "no_image" && wine.image.trim() !== "" && wine.image.startsWith("http");
  const imageSrc = isValidImage ? wine.image : sampleimg;

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
          <div style={styles.badge}>BEST</div>
          <img src={imageSrc} alt={wine.name} style={styles.image} />
          <p style={styles.name}>{wine.name}</p>
        </div>

        {/* 뒷면 */}
        <div style={styles.cardBack}>
          {/* 원하는 정보 표시 */}
          <p style={styles.infoText}>{wine.country}</p>
          <p style={styles.infoText}>{wine.grape}</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  /**
   * 가장 바깥 래퍼:
   * 1) 고정된 width/height,
   * 2) inline-block으로 layout이 튀지 않도록 함
   * 3) perspective를 부모에 적용
   */
  cardContainer: {
    display: "inline-block",
    width: vh(15),
    height: vh(20),
    perspective: "1000px", // 3D 효과를 위해 부모에 설정
    cursor: "pointer",
    position: "relative",
    verticalAlign: "top", // 카드가 여러 개 있을 때 세로 정렬을 맞춤
  },

  /** 카드 전체(앞/뒤 포함) */
  cardInner: {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s ease-in-out",
    transformOrigin: "center center", // 중앙 기준 회전
  },

  /** 앞면(front) */
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
    justifyContent: "center",
  },

  /** 뒷면(back) */
  cardBack: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    backgroundColor: "#2a0e35",
    borderRadius: vh(1),
    transform: "rotateY(180deg)", // 기본 상태에서 180도 돌아있음
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },

  /** BEST 배지 */
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

  /** 와인 이미지 */
  image: {
    width: vh(8),
    height: vh(8),
    objectFit: "contain",
  },

  /** 와인 이름 */
  name: {
    fontSize: vh(1.5),
    textAlign: "center",
    padding: `0 ${vh(1)}`,
    wordBreak: "keep-all",
    color: "white",
    marginTop: vh(1),
  },

  /** 뒷면 텍스트 */
  infoText: {
    fontSize: vh(1.4),
    marginBottom: vh(1),
  },
};

export default BestWineFlipCard;
