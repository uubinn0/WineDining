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

  // 이미지 처리 (여기 수정 필요함!!!!!!!!!!)
  const wineImage = wine.image && wine.image !== "no_image" ? wine.image : "/sample_image/wine_sample.jpg";

  return (
    <div style={styles.card}>
      {/* 와인 이미지 */}
      <div style={styles.imageContainer}>
        <img src={wineImage} alt={wine.name} style={styles.image} />
        {/* 좋아요 버튼 */}
        <button onClick={handleWishToggle} style={styles.heartButton}>
          {isInWishList ? "❤️" : "🤍"}
        </button>
      </div>

      {/* 와인 정보 */}
      <div style={styles.info}>
        <p style={styles.name}>{wine.name}</p>
        <p style={styles.country}>
          {wine.country} / {wine.grape}
        </p>
      </div>

      {/* 버튼 영역 */}
      <div style={styles.buttonWrapper}>
        <button
          style={{
            ...styles.addButton,
            backgroundColor: isInWishList ? "#9262d5" : "#5a1a5e",
          }}
          onClick={handleWishToggle}
        >
          {isInWishList ? "담김" : "담기"}
        </button>
        <button style={styles.detailButton} onClick={() => onClick(wine)}>
          자세히
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#2a0e35",
    borderRadius: "8px",
    padding: "10px",
    width: "320px",
    color: "white",
    border: "2px solid #5a1a5e",
    position: "relative",
  },
  imageContainer: {
    position: "relative",
    marginRight: "10px",
  },
  image: {
    width: "50px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  heartButton: {
    position: "absolute",
    bottom: "-5px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "none",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
  },
  info: {
    flexGrow: 1,
    textAlign: "left",
  },
  name: {
    fontSize: "14px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "130px",
  },
  country: {
    fontSize: "12px",
    color: "#f4e4ff",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  addButton: {
    backgroundColor: "#5a1a5e",
    color: "white",
    border: "none",
    padding: "5px 10px",
    fontSize: "12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  detailButton: {
    backgroundColor: "#fff",
    color: "#2a0e35",
    border: "none",
    padding: "5px 10px",
    fontSize: "12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default WineInfoCard;
