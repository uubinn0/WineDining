import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWish, removeWish } from "../store/slices/wishSlice";
import { RootState, AppDispatch } from "../store/store";
import { Wine } from "../types/wine";
import { WishItem } from "../types/wish";
import { trackEvent } from "../utils/analytics";

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
      trackEvent("toggle_wish", {
        item_id: wine.wineId,
        item_name: wine.name,
        action: "remove",
      });
    } else {
      dispatch(addWish(wine.wineId));
      trackEvent("toggle_wish", {
        item_id: wine.wineId,
        item_name: wine.name,
        action: "add",
      });
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
    border: "0.25vh solid #D6BA91", // 2px (2/8)
    borderRadius: "1.5vh", // 12px (12/8)
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25vh 1.875vh", // 10px 15px (10/8, 15/8)
    position: "relative",
    marginBottom: "1.875vh", // 15px (15/8)
  },
  imageBox: {
    width: "7.5vh", // 60px (60/8)
    height: "7.5vh", // 60px
    marginRight: "1.875vh", // 15px (15/8)
    borderRadius: "0.5vh", // 4px (4/8)
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
    top: "1vh", // 8px (8/8)
    right: "1vh", // 8px
    background: "none",
    border: "none",
    fontSize: "1.75vh", // 14px (14/8)
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

export default WineInfoCard;
