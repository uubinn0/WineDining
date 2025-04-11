// src/pages/WishList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishes } from "../store/slices/wishSlice";
import { fetchWineDetailThunk } from "../store/slices/wineSlice";
import { RootState, AppDispatch } from "../store/store";
import WineWishCard from "../components/WineWishCard";
import WineDetailModal from "../components/Modal/WineDetailModal";
import { WineDetail } from "../types/wine";
import BackButton from "../components/BackButton";
import PixelTitle from "../components/PixcelTitle";
import Wish from "../assets/images/background/Wish.png";
import { trackEvent } from "../utils/analytics";
import { motion } from "framer-motion";

const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.wish);
  const { wineDetail } = useSelector((state: RootState) => state.wine);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWishes());
  }, [dispatch]);

  const handleWishClick = (wineId: number) => {
    trackEvent("wishlist_item_click", { wineId });
    dispatch(fetchWineDetailThunk(wineId));
    setIsModalOpen(true);
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/mypage")} />
      </div>

      <PixelTitle
        text="WISH LIST"
        imageSrc="/sample_image/yellow_lightning.png"
        fontSize="1.8vh"
        color="#fefefe"
        imageSize="2.8vh"
      />

      <div style={styles.content}>
        {status === "loading" && <p>위시리스트를 불러오는 중...</p>}
        {status === "failed" && <p>위시리스트를 불러오는 데 실패했습니다.</p>}

        {items.length === 0 ? (
          <p style={styles.emptyMessage}>위시리스트가 비어 있습니다.</p>
        ) : (
          <div style={styles.grid}>
            {items.map((wish, index) => (
              <div key={wish.id} onClick={() => handleWishClick(wish.wine.wineId)}>
                <WineWishCard wish={wish} wine={wish.wine} />
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && wineDetail && (
        <WineDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          wine={wineDetail}
          fromPage="wishlist"
        />
      )}
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: `url(${Wish})`,
    backgroundSize: "cover",
    backgroundRepeat: "repeat-y",
    backgroundPosition: "center",
    width: "100%",
    height: "100dvh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    padding: "2.2vh 0",
  },
  backButtonWrapper: {
    position: "absolute",
    top: "1.8vh",
    left: "3vh",
  },
  header: {
    fontFamily: "PressStart2P",
    fontSize: "2vh",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2vh",
    marginBottom: "0.5vh",
  },
  icon: {
    width: "2vh",
    height: "3vh",
  },
  content: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5vh",
    padding: "2.5vh",
    width: "90%",
    maxWidth: "80vh",
    justifyItems: "center", // 각 아이템을 셀 내부에서 가운데 정렬
    justifyContent: "center", // 그리드 전체를 가운데 정렬
    alignContent: "start",
  },
  emptyMessage: {
    fontSize: "1.8vh",
    color: "#fff",
    fontFamily: "Galmuri9",
  },
};

export default WishList;
