import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeWish } from "../store/slices/wishSlice";
import { AppDispatch } from "../store/store";
import { WishItem } from "../types/wish";
import WineDetailModal from "../components/Modal/WineDetailModal";
import { WineDetail } from "../types/wine";
import { fetchWineDetailThunk } from "../store/slices/wineSlice";
import { vh } from "../utils/vh";

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
    backgroundColor: "#21101B",
    position: "relative",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    color: "#FFFFFF",
  },
  heartButton: {
    position: "absolute",
    top: "7px",
    right: "7px",
    border: "none",
    background: "none",
    fontFamily: "galmuri7",
    fontSize: "14px",
    cursor: "pointer",
    color: "#FF1E56",
  },
  image: {
    marginTop: "12px",
    width: "80px",
    height: "auto",
    maxHeight: "120px",
    objectFit: "contain",
    borderRadius: "8px",
  },
  text: {
    fontFamily: "Galmuri9",
    fontSize: "14px",
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
    width: "100%",
    // display: "flex",
    backgroundColor: "#ffff",
    marginTop: "auto",
    borderRadius: "10px",
    boxShadow: `${vh(0.6)} ${vh(0.6)} 0 #000`,
  },
};

export default WineWishCard;
