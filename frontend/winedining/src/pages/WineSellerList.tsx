import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { fetchCellar, fetchBest, registerBest, deleteBest } from "../store/slices/sellarSlice"; // Add these imports
import WineSellerCard from "../components/WineSellerCard";
import WineSellerDetailModal from "../components/Modal/WineSellerDetailModal";
import { Bottle } from "../types/seller";
import MySellerAddFlow from "../components/MySellerAddFlow";
import BackButton from "../components/BackButton";

const WineSellerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { bottles, bestBottles, status } = useSelector((state: RootState) => state.cellar);

  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCellar());
    dispatch(fetchBest());
  }, [dispatch]);

  const handleDetailClick = (bottle: Bottle) => {
    setSelectedBottle(bottle);
    setIsDetailOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedBottle(null);
    setIsDetailOpen(false);
  };

  const isBest = (bottleId: number) => bestBottles.some((b: Bottle) => b.bottleId === bottleId);

  const handleBestClick = async (bottleId: number) => {
    try {
      if (isBest(bottleId)) {
        await dispatch(deleteBest(bottleId)).unwrap();
      } else {
        if (bestBottles.length >= 3) {
          alert("베스트 와인은 최대 3개까지만 등록할 수 있습니다!");
          return;
        }
        await dispatch(registerBest(bottleId)).unwrap();
      }
      dispatch(fetchBest());
      dispatch(fetchCellar());
    } catch (error) {
      alert("베스트 와인 설정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/mypage")} />
      </div>
      <div style={styles.floatingAddButton}>
        <MySellerAddFlow />
      </div>
      <h1 style={styles.title}>⚡ MY WINE SELLER ⚡</h1>

      <div style={styles.carousel}>
        {bestBottles.length > 0 ? (
          bestBottles.map((bottle: Bottle) => (
            <img
              key={bottle.bottleId}
              src="/sample_image/wine_sample.jpg"
              alt={bottle.wine.name}
              style={styles.carouselImage}
            />
          ))
        ) : (
          <p style={styles.emptyText}>베스트 와인을 등록해줘!</p>
        )}
      </div>

      {status === "loading" && <p>불러오는 중...</p>}
      {status === "failed" && <p>데이터 불러오기 실패</p>}

      <div style={styles.list}>
        {bottles.map((bottle: Bottle) => (
          <WineSellerCard
            key={bottle.bottleId}
            wine={bottle}
            isBest={isBest(bottle.bottleId)}
            onBestClick={handleBestClick}
            onDetailClick={() => handleDetailClick(bottle)}
          />
        ))}
      </div>

      {selectedBottle && isDetailOpen && (
        <WineSellerDetailModal bottle={selectedBottle} isOpen={isDetailOpen} onClose={closeDetailModal} />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    backgroundColor: "#27052E",
    minHeight: "100vh",
    color: "white",
    fontFamily: "Pixel, sans-serif",
  },
  title: {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "10px",
  },
  carousel: {
    minHeight: "80px",
    display: "flex",
    overflowX: "auto",
    gap: "10px",
    padding: "10px 0",
    marginBottom: "20px",
  },
  carouselImage: {
    height: "80px",
    borderRadius: "8px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
    maxHeight: "calc(100vh - 230px)",
    paddingRight: "4px",
  },
  emptyText: {
    color: "#aaa",
    fontSize: "14px",
  },
  floatingAddButton: {
    position: "absolute",
    bottom: "24px",
    right: "24px",
  },
  backButtonWrapper: {
    position: "absolute",
    top: "16px",
    left: "16px",
  },
};

export default WineSellerList;
