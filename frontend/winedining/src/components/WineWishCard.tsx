import React from "react";
import { useDispatch } from "react-redux";
import { removeFromWishList } from "../store/slices/wishSlice";
import { AppDispatch } from "../store/store";
import { Wish } from "../types/wish";

interface WineWishCardProps {
  wish: Wish;
}

const WineWishCard = ({ wish }: WineWishCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveWish = () => {
    if (!wish.wine.wine_id) return;

    dispatch(removeFromWishList(wish.wine.wine_id));
  };

  return (
    <div style={styles.card}>
      <img
        src={wish.wine.image !== "" ? wish.wine.image : "/sample_image/wine_sample.jpg"}
        alt={wish.wine.kr_name}
        style={styles.image}
      />
      <h3>
        {wish.wine.kr_name} ({wish.wine.en_name})
      </h3>
      <button onClick={handleRemoveWish} style={styles.heartButton}>
        ❤️
      </button>
      <div style={styles.details}>
        <p>
          <strong>종류:</strong> {wish.wine.type}
        </p>
        <p>
          <strong>국가:</strong> {wish.wine.country}
        </p>
        <p>
          <strong>품종:</strong> {wish.wine.grape}
        </p>
        <p>
          <strong>가격:</strong> {wish.wine.price ? wish.wine.price.toLocaleString() + "원" : "가격 정보 없음"}
        </p>
        <p>
          <strong>당도:</strong> {wish.wine.sweetness}
        </p>
        <p>
          <strong>산도:</strong> {wish.wine.acidity}
        </p>
        <p>
          <strong>바디:</strong> {wish.wine.body}
        </p>
        <p>
          <strong>타닌:</strong> {wish.wine.tannin !== null ? wish.wine.tannin : "N/A"}
        </p>
        <p>
          <strong>도수:</strong> {wish.wine.alcohol_content !== null ? `${wish.wine.alcohol_content}%` : "N/A"}
        </p>
        <p>
          <strong>추천 음식:</strong> {wish.wine.pairing ? wish.wine.pairing.join(", ") : "추천 없음"}
        </p>
      </div>
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
    textAlign: "center",
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
  image: {
    width: "100%",
    height: "auto",
    maxHeight: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  details: {
    textAlign: "left",
    marginTop: "10px",
  },
};

export default WineWishCard;
