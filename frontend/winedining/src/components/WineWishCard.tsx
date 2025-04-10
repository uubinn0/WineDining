import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeWish } from "../store/slices/wishSlice";
import { AppDispatch } from "../store/store";
import { WishItem } from "../types/wish";
import WineDetailModal from "../components/Modal/WineDetailModal";
import { WineDetail } from "../types/wine";
import { fetchWineDetailThunk } from "../store/slices/wineSlice";
import { vh } from "../utils/vh";
import redWineImage from "../assets/types/red_wine.png";
import whiteWineImage from "../assets/types/white_wine.png";
import roseWineImage from "../assets/types/rose_wine.png";
import sparklingWineImage from "../assets/types/sparkling_wine.png";
import { Wine } from "../types/wine";
import { motion } from "framer-motion";

interface WineWishCardProps {
  wish: WishItem;
  wine: Wine;
}

const WineWishCard = ({ wish, wine }: WineWishCardProps) => {
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

  const getDefaultImageByType = (type: string | undefined) => {
    if (!type) return redWineImage;
    switch (type.toLowerCase()) {
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

  const getWineImage = () => {
    const img = wine.image;
    if (!img || img === "no_image" || img === "") {
      return getDefaultImageByType(wine.type);
    }
    return img;
  };

  const wineImage = getWineImage();

  return (
    <>
      <motion.div
        style={styles.card}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 1.5vh rgba(255, 255, 255, 0.3)",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img src={wineImage} alt={wish.wine.name} style={styles.image} />

        <button style={styles.button} onClick={() => setIsOpen(true)}>
          <h3 style={styles.text}>
            {wish.wine.name} <br /> ({wish.wine.country})
          </h3>
        </button>

        <button onClick={handleRemoveWish} style={styles.heartButton}>
          ❤️
        </button>
      </motion.div>

      {isOpen && selectedDetail && (
        <WineDetailModal isOpen={isOpen} onClose={() => setIsOpen(false)} wine={selectedDetail} />
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "16vh",
    height: "20vh",
    border: "0.4vh solid #D6BA91",
    borderRadius: "1.4vh",
    padding: "1.4vh",
    boxShadow: "0 0.6vh 1vh rgba(0,0,0,0.3)",
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
    top: "0.8vh",
    right: "0.8vh",
    border: "none",
    background: "none",
    fontFamily: "galmuri7",
    fontSize: "2vh",
    cursor: "pointer",
    color: "#FF1E56",
  },
  image: {
    marginTop: "1.4vh",
    width: "10vh",
    height: "auto",
    maxHeight: "120px",
    objectFit: "contain",
    borderRadius: "1vh",
  },
  text: {
    fontFamily: "Galmuri9",
    fontSize: "1.6vh",
    margin: "0.2vh",
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
    borderRadius: "1vh",
    boxShadow: `${vh(0.6)} ${vh(0.6)} 0 #000`,
  },
};

export default WineWishCard;
