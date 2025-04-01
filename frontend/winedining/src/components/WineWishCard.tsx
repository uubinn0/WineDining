import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeWish } from "../store/slices/wishSlice";
import { AppDispatch } from "../store/store";
import { WishItem } from "../types/wish";
import WineDetailModal from "../components/Modal/WineDetailModal";
import { WineDetail } from "../types/wine";
import { fetchWineDetailThunk } from "../store/slices/wineSlice";

interface WineWishCardProps {
  wish: WishItem;
}

const WineWishCard = ({ wish }: WineWishCardProps) => {
  const [selectedDetail, setSelectedDetail] = useState<WineDetail | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeWish(wish.wine.wineId));
  };

  const handleWineClick = async () => {
    const detail = await dispatch(fetchWineDetailThunk(wish.wine.wineId)).unwrap();
    setSelectedDetail(detail);
    setIsOpen(true);
  };

  return (
    <>
      <div style={styles.card}>
        <img
          src={wish.wine.image !== "" ? wish.wine.image : "/sample_image/wine_sample.jpg"}
          alt={wish.wine.name}
          style={styles.image}
        />

        <button style={styles.button} onClick={() => setIsOpen(true)}>
          <h3 style={styles.text}>
            {wish.wine.name} <br /> ({wish.wine.country})
          </h3>
        </button>

        <button onClick={handleRemoveWish} style={styles.heartButton}>
          ❤️
        </button>
      </div>

      {isOpen && selectedDetail && (
        <WineDetailModal isOpen={isOpen} onClose={() => setIsOpen(false)} wine={selectedDetail} />
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "140px",
    height: "165px",
    border: "3px solid #D6BA91",
    borderRadius: "12px",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    backgroundColor: "#250030",
    position: "relative",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    color: "#FFFFFF",
    fontFamily: "Pixel, sans-serif",
  },
  heartButton: {
    position: "absolute",
    top: "7px",
    right: "7px",
    border: "none",
    background: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "red",
  },
  image: {
    marginTop: "4px",
    width: "80px",
    height: "auto",
    maxHeight: "120px",
    objectFit: "contain",
    borderRadius: "8px",
  },
  text: {
    fontSize: "14px",
    fontWeight: "bold",
    margin: "2px",
    maxWidth: "100%",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
  },
  button: {
    width: "150px",
    marginTop: "15px",
    borderRadius: "10px",
  },
};

export default WineWishCard;
