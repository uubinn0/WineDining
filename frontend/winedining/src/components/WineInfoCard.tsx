import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishList, removeFromWishList } from "../store/slices/wishSlice";
import { RootState, AppDispatch } from "../store/store";
import { Wine } from "../types/wine";
import { Wish } from "../types/wish";

interface WineInfoCardProps {
  wine: Wine;
  onClick: (wine: Wine) => void;
}

const WineInfoCard = ({ wine, onClick }: WineInfoCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const wishList = useSelector((state: RootState) => state.wish.wishes);

  const isInWishList = wishList.some((wish: Wish) => wish.wine.id === wine.id);

  const handleWishToggle = () => {
    if (!wine.id) return;

    if (isInWishList) {
      dispatch(removeFromWishList(wine.id));
    } else {
      dispatch(addToWishList(wine.id));
    }
  };

  return (
    <div style={styles.card}>
      <h3>{wine.name}</h3>
      <button onClick={() => onClick(wine)}>자세히</button>
      <button onClick={handleWishToggle}>{isInWishList ? "삭제" : "담기"}</button>
      <p>종류: {wine.type}</p>
      <p>국가: {wine.country}</p>
      <p>가격: {wine.price.toLocaleString()}원</p>
      <p>연도: {wine.year}</p>
      <p>당도: {wine.sweet}</p>
      <p>산도: {wine.acidic}</p>
      <p>바디: {wine.body}</p>
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
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
};

export default WineInfoCard;
