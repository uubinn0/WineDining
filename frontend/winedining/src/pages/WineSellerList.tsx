import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { fetchCellar, fetchBest, registerBest, deleteBest } from "../store/slices/sellarSlice"; // Add these imports
import WineSellerCard from "../components/WineSellerCard";
import WineSellerDetailModal from "../components/Modal/WineSellerDetailModal";
import { Bottle } from "../types/seller";
import CustomAddWineButton from "../components/CustomAddWineButton";
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

  const closeDetailModal = () => {
    setSelectedBottle(null);
    setIsDetailOpen(false);
  };

  const isBest = (bottleId: number) => bestBottles.some((b: Bottle) => b.bottleId === bottleId);

  const handleBestClick = async (bottleId: number) => {
    try {
      const currentIsBest = isBest(bottleId);

      // API 호출을 먼저 수행
      if (currentIsBest) {
        await dispatch(deleteBest(bottleId)).unwrap();
        // API 성공 후 상태 업데이트
        dispatch({
          type: "cellar/setBestBottles",
          payload: bestBottles.filter((b) => b.bottleId !== bottleId),
        });
      } else {
        if (bestBottles.length >= 3) {
          alert("베스트 와인은 최대 3개까지만 등록할 수 있습니다!");
          return;
        }
        await dispatch(registerBest(bottleId)).unwrap();
        const bottleToAdd = bottles.find((b) => b.bottleId === bottleId);
        if (bottleToAdd) {
          dispatch({
            type: "cellar/setBestBottles",
            payload: [...bestBottles, bottleToAdd],
          });
        }
      }

      // 최종적으로 서버 상태와 동기화
      dispatch(fetchBest());
    } catch (error) {
      // 에러 발생 시 서버 상태로 롤백
      dispatch(fetchBest());
      alert("베스트 와인 설정 중 오류가 발생했습니다.");
    }
  };

  const handleDetailClick = (bottle: Bottle) => {
    requestAnimationFrame(() => {
      setSelectedBottle(bottle);
      setIsDetailOpen(true);
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/mypage")} />
      </div>
      <div style={styles.floatingAddButton}>
        <CustomAddWineButton />
      </div>
      <h1 style={styles.title}>⚡ MY WINE SELLER ⚡</h1>

      <div style={styles.carousel}>
        {bestBottles.length > 0 ? (
          bestBottles.map((bottle: Bottle) => {
            const isValidImage =
              bottle.wine.image &&
              bottle.wine.image !== "no_image" &&
              bottle.wine.image.trim() !== "" &&
              bottle.wine.image.startsWith("http");

            const imageSrc = isValidImage ? bottle.wine.image : "/sample_image/wine_sample.jpg";

            return <img key={bottle.bottleId} src={imageSrc} alt={bottle.wine.name} style={styles.carouselImage} />;
          })
        ) : (
          <p style={styles.emptyText}>베스트 와인을 등록해줘!</p>
        )}
      </div>

      <div style={styles.list}>
        {status === "loading" ? (
          <div style={styles.emptyText}>{/* 로딩 상태일 때는 아무것도 표시하지 않음 */}</div>
        ) : status === "failed" ? (
          <div style={styles.emptyText}>{/* 에러 상태일 때도 아무것도 표시하지 않음 */}</div>
        ) : (
          bottles.map((bottle: Bottle) => (
            <WineSellerCard
              key={bottle.bottleId}
              wine={bottle}
              isBest={isBest(bottle.bottleId)}
              onBestClick={handleBestClick}
              onDetailClick={() => handleDetailClick(bottle)}
            />
          ))
        )}
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
    overflow: "auto",
    position: "relative",
  },
  title: {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "20px",
    marginTop: "40px",
    color: "#FFFFFF",
  },
  carousel: {
    minHeight: "120px",
    display: "flex",
    overflowX: "auto",
    gap: "20px",
    padding: "20px 0",
    marginBottom: "20px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "12px",
  },
  carouselImage: {
    height: "100px",
    borderRadius: "8px",
    objectFit: "contain",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
    paddingRight: "4px",
    paddingBottom: "80px",
    marginTop: "20px",
  },
  emptyText: {
    color: "#aaa",
    fontSize: "14px",
    textAlign: "center",
  },
  floatingAddButton: {
    position: "absolute",
    top: "29vh",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "100",
    width: "80%",
    maxWidth: "500px",
  },
  backButtonWrapper: {
    position: "absolute",
    top: "16px",
    left: "16px",
  },
};

export default WineSellerList;
