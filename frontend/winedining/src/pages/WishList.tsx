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
import { trackEvent } from "../utils/analytics"; // GA 이벤트 트래커 추가
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

  // 위시 아이템 클릭 시
  const handleWishClick = (wineId: number) => {
    // 이벤트 추가
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

      <div style={styles.title}>
        <PixelTitle
          text="WISH LIST"
          imageSrc="/sample_image/yellow_lightning.png"
          fontSize="1.8vh"
          color="#fefefe"
          imageSize="2.8vh"
        />
      </div>
      <div style={styles.gridScrollWrapper}>
        {status === "loading" && <p>위시리스트를 불러오는 중...</p>}
        {status === "failed" && <p>위시리스트를 불러오는 데 실패했습니다.</p>}

        {items.length === 0 ? (
          <p>위시리스트가 비어 있습니다.</p>
        ) : (
          <div style={styles.grid}>
            {items.map((wish) => (
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
          fromPage="wishlist" // 담기 이벤트 시 from: "wishlist" 로 구분
        />
      )}
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: `url(${Wish})`,
    backgroundRepeat: "repeat-y", // 세로로 배경 반복
    backgroundSize: "cover",
    backgroundPosition: "center",
    textAlign: "center",
    minHeight: "100vh", // 최소 높이 보장 (이미 vh 단위)
    overflow: "hidden",
    // overflowY: "auto",
    width: "100%",
  },
  gridScrollWrapper: {
    maxHeight: "75vh", // 카드 영역의 스크롤 한계 높이
    overflowY: "auto",
    paddingBottom: "3vh",
    paddingTop: "1vh",
    WebkitOverflowScrolling: "touch", // iOS 부드러운 스크롤
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5vh", // 12px / 8 = 1.5vh
    justifyContent: "center",
    padding: "2.5vh", // 20px / 8 = 2.5vh
  },
  image: {
    width: "2.25vh", // 18px / 8 = 2.25vh
    height: "2.5vh", // 20px / 8 = 2.5vh
  },
  backButtonWrapper: {
    position: "absolute",
    top: "2vh", // 16px / 8 = 2vh
    left: "2vh", // 16px / 8 = 2vh
  },
  title: {
    marginTop: "2.375vh", // 19px / 8 ≈ 2.375vh
  },
};

export default WishList;
