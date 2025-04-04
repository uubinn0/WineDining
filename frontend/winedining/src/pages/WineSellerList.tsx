// WineSellerList.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { fetchCellar, fetchBest, registerBest, deleteBest } from "../store/slices/sellarSlice";
import WineSellerCard from "../components/WineSellerCard";
import WineSellerDetailModal from "../components/Modal/WineSellerDetailModal";
import { Bottle } from "../types/seller";
import CustomAddWineButton from "../components/CustomAddWineButton";
import BackButton from "../components/BackButton";
import { vh } from "../utils/vh";
import sampleimg from "../assets/images/winesample/defaultwine.png";
import BestWineFlipCard from "../components/BestWineFlipCard"; // 새로 작성한 플립 카드 컴포넌트
import PixelTitle from "../components/PixcelTitle";

const WineSellerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { bottles, bestBottles, status, totalCount } = useSelector((state: RootState) => state.cellar);

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
      if (currentIsBest) {
        await dispatch(deleteBest(bottleId)).unwrap();
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
      dispatch(fetchBest());
    } catch (error) {
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

      <PixelTitle
        text="MY WINE SELLER"
        imageSrc="/sample_image/yellow_lightning.png"
        fontSize="20px"
        color="#fefefe"
        imageSize="24px"
      />

      {/* 베스트 와인 영역: 항상 3개의 카드로 표시 */}
      <div style={styles.bestWinesSection}>
        <div style={styles.bestWinesContainer}>
          {Array.from({ length: 3 }).map((_, index) => {
            const bottle = bestBottles[index];
            if (bottle) {
              // 등록된 카드: BestWineFlipCard 사용
              return <BestWineFlipCard key={bottle.bottleId} bottle={bottle} />;
            } else {
              // 등록되지 않은 카드(Placeholder)
              return (
                <div key={`placeholder-${index}`} style={styles.bestWineCard}>
                  <div style={styles.bestBadge}>BEST</div>
                  <img src={sampleimg} alt="Wine Sample" style={styles.bestWineImage} />
                  <p style={styles.bestWineName}>등록된 와인 없음</p>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* 헤더 영역: "와인 추가하기" 버튼과 총 와인 수집 텍스트 */}
      <div style={styles.headerContainer}>
        <div style={styles.addButtonWrapper}>
          <CustomAddWineButton />
        </div>
        <div style={styles.totalCountWrapper}>
          <p style={styles.totalCountText}>총 {totalCount?.toLocaleString() || 0}개의 와인 수집</p>
        </div>
      </div>

      {/* 전체 와인 리스트 */}
      <div style={styles.list}>
        {status === "loading" ? (
          <div style={styles.emptyText} />
        ) : status === "failed" ? (
          <div style={styles.emptyText} />
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

      {/* 상세 모달 */}
      {selectedBottle && isDetailOpen && (
        <WineSellerDetailModal bottle={selectedBottle} isOpen={isDetailOpen} onClose={closeDetailModal} />
      )}
    </div>
  );
};

export default WineSellerList;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    padding: vh(2),
    backgroundColor: "#27052E",
    height: "100vh",
    overflow: "hidden",
    color: "white",
    fontFamily: "galmuri7",
  },
  backButtonWrapper: {
    position: "absolute",
    top: vh(2),
    left: vh(2),
  },

  bestWinesSection: {
    marginBottom: vh(3),
    display: "flex",
    justifyContent: "center", // 섹션 전체를 중앙에 배치
  },
  bestWinesContainer: {
    display: "flex",
    justifyContent: "space-between", // 카드들을 좌우 끝까지 균등하게 배치
    alignItems: "center",
    width: "95%", // 컨테이너 전체 너비 사용
  },
  bestWineCard: {
    position: "relative",
    width: vh(15),
    height: vh(20),
    backgroundColor: "#2a0e35",
    borderRadius: vh(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  },
  bestBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#888",
    color: "#27052E",
    padding: `0 ${vh(1)}`,
    fontSize: vh(1.3),
    fontWeight: "bold",
    borderBottomLeftRadius: vh(1),
    lineHeight: vh(2.5),
  },
  bestWineImage: {
    width: vh(8),
    height: vh(8),
    objectFit: "contain",
    marginBottom: vh(1),
  },
  bestWineName: {
    fontSize: vh(1.5),
    textAlign: "center",
    padding: `0 ${vh(1)}`,
    wordBreak: "keep-all",
    color: "#888",
  },
  // 헤더 컨테이너는 스크롤 시 맨 위에 고정
  headerContainer: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backgroundColor: "#27052E",
    padding: `0`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  addButtonWrapper: {
    width: "95%",
    maxWidth: "350px",
    position: "relative",
    zIndex: 1500,
    transform: "translateY(0px)",
  },
  totalCountWrapper: {
    margin: vh(1),
    width: "95%",
    maxWidth: "500px",
    textAlign: "end",
  },
  totalCountText: {
    fontSize: vh(1.8),
    color: "#ccc",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: vh(1.2),
    overflowY: "auto",
    paddingBottom: vh(8),
    height: `calc(100vh - ${vh(45)})`,
  },
  emptyText: {
    color: "#aaa",
    fontSize: vh(1.4),
    textAlign: "center",
  },
};
