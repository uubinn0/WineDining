import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWish, removeWish } from "../store/slices/wishSlice";
import { RootState, AppDispatch } from "../store/store";
import { Wine } from "../types/wine";
import { WishItem } from "../types/wish";

interface WineInfoCardProps {
  wine: Wine;
  onClick: (wine: Wine) => void;
}

const WineInfoCard = ({ wine, onClick }: WineInfoCardProps) => {
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

  // 이미지 처리
  const wineImage = wine.image && wine.image !== "no_image" ? wine.image : "/sample_image/wine_sample.jpg";

  return (
    <div style={styles.card}>
      {/* 와인 이미지 */}
      <div style={styles.imageBox}>
        <img
          src={wineImage}
          alt={wine.name}
          style={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/sample_image/wine_sample.jpg";
          }}
        />
      </div>

      {/* 와인 정보 */}
      <div style={styles.info}>
        <div style={styles.name}>{wine.name.toUpperCase()}</div>
        <div style={styles.grape}>
          {wine.country} / {wine.grape}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div style={styles.buttons}>
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
        <button style={styles.button} onClick={() => onClick(wine)}>
          자세히
        </button>
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
    position: "relative",
    marginBottom: "15px",
  },
  imageBox: {
    width: "60px",
    height: "60px",
    marginRight: "15px",
    borderRadius: "4px",
    backgroundColor: "#381837",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "80%",
    height: "auto",
    objectFit: "contain",
  },
  heartButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "none",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
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
    fontSize: "14px",
    marginBottom: "3px",
    textTransform: "uppercase",

    // 한 줄 넘어가면 '...' 처리
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px", // 최대 너비
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

export default WineInfoCard;
