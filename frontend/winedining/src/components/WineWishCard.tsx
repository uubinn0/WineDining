import React from "react";
import { useDispatch } from "react-redux";
import { removeFromWishList } from "../store/slices/wishSlice";
import { AppDispatch } from "../store/store";
import { Wish } from "../types/wish";

interface WineWishCardProps {
  wish: Wish;
  // onClick: (wish: Wish) => void;
}

const WineWishCard = ({ wish }: WineWishCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveWish = () => {
    if (!wish.wine.id) return;

    dispatch(removeFromWishList(wish.wine.id));
  };

  return (
    <div style={styles.card}>
      <h3>{wish.wine.name}</h3>
      <button onClick={handleRemoveWish} style={styles.heartButton}>
        ❤️
      </button>
      <p>종류: {wish.wine.type}</p>
      <p>국가: {wish.wine.country}</p>
      <p>가격: {wish.wine.price.toLocaleString()}원</p>
      <p>연도: {wish.wine.year}</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    margin: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    position: "relative",
  },
  heartButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    border: "none",
    background: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
};

export default WineWishCard;
