import React, { useEffect, useState, useRef, useCallback } from "react";
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
import BestWineFlipCard from "../components/BestWineFlipCard";
import PixelTitle from "../components/PixcelTitle";
import { fetchWineNotes } from "../api/noteApi";
import { useMemo } from "react";

const WineSellerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { bottles, bestBottles, status, totalCount } = useSelector((state: RootState) => state.cellar);

  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [noteCounts, setNoteCounts] = useState<{ [bottleId: number]: number }>({});

  // hasMore: 더 불러올 와인이 있는지 확인 (현재 불러온 bottles 수가 총 와인 수보다 적으면 true)
  const hasMore = bottles.length < totalCount;

  useEffect(() => {
    // 초기 페이지 1 데이터 불러오기
    dispatch(fetchCellar({ page: 1 }));
    dispatch(fetchBest());
  }, [dispatch]);

  // 무한 스크롤을 위한 IntersectionObserver
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBottleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (status === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          dispatch(fetchCellar({ page: nextPage }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [status, hasMore, page, dispatch]
  );

  useEffect(() => {
    const fetchNotesForBottles = async () => {
      const counts: { [bottleId: number]: number } = {};
      for (const bottle of bottles) {
        try {
          const res = await fetchWineNotes(bottle.bottleId);
          counts[bottle.bottleId] = res.notes.length;
        } catch (err) {
          console.warn(`노트 가져오기 실패: bottleId ${bottle.bottleId}`);
        }
      }
      setNoteCounts(counts);
    };

    if (bottles.length > 0) {
      fetchNotesForBottles();
    }
  }, [bottles]);

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
      } else {
        if (bestBottles.length >= 3) {
          alert("베스트 와인은 최대 3개까지만 등록할 수 있습니다!");
          return;
        }
        await dispatch(registerBest(bottleId)).unwrap();
      }
      dispatch(fetchBest());
    } catch (error) {
      dispatch(fetchBest());
      alert("베스트 와인 설정 중 오류가 발생했습니다.");
    }
  };

  const handleDetailClick = (bottle: Bottle) => {
    setSelectedBottle(bottle);
    setIsDetailOpen(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/mypage")} />
      </div>

      <PixelTitle
        text="MY WINE SELLER"
        imageSrc="/sample_image/yellow_lightning.png"
        fontSize="16px"
        color="#fefefe"
        imageSize="24px"
      />

      {/* 베스트 와인 영역 */}
      <div style={styles.bestWinesSection}>
        <div style={styles.bestWinesContainer}>
          {Array.from({ length: 3 }).map((_, index) => {
            const bottle = bestBottles[index];
            if (bottle) {
              return (
                <BestWineFlipCard key={bottle.bottleId} bottle={bottle} isBest={true} onBestClick={handleBestClick} />
              );
            } else {
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

      {/* 총 와인의 개수 */}
      <div style={styles.headerContainer}>
        <div style={styles.addButtonWrapper}>
          <CustomAddWineButton />
        </div>
        <div style={styles.totalCountWrapper}>
          <p style={styles.totalCountText}>총 {totalCount?.toLocaleString() || 0}개의 와인 수집</p>
        </div>
      </div>

      {/* 전체 와인 리스트 (무한 스크롤 적용) */}
      <div style={styles.list}>
        {bottles.map((bottle: Bottle, index: number) => {
          if (index === bottles.length - 1) {
            return (
              <div key={bottle.bottleId} ref={lastBottleRef}>
                <WineSellerCard
                  wine={bottle}
                  isBest={isBest(bottle.bottleId)}
                  onBestClick={handleBestClick}
                  onDetailClick={() => handleDetailClick(bottle)}
                  totalNote={noteCounts[bottle.bottleId] || 0}
                />
              </div>
            );
          } else {
            return (
              <div key={bottle.bottleId}>
                <WineSellerCard
                  wine={bottle}
                  isBest={isBest(bottle.bottleId)}
                  onBestClick={handleBestClick}
                  onDetailClick={() => handleDetailClick(bottle)}
                  totalNote={noteCounts[bottle.bottleId] || 0}
                />
              </div>
            );
          }
        })}
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
    padding: vh(2.2), // 필요에 따라 2.2vh로 조정 가능
    backgroundColor: "#27052E",
    minHeight: "100vh",
    overflowX: "hidden",
    overflowY: "auto",
    color: "white",
    fontFamily: "galmuri9",
  },
  backButtonWrapper: {
    position: "absolute",
    top: vh(2),
    left: vh(2),
  },
  bestWinesSection: {
    marginBottom: vh(3),
    display: "flex",
    justifyContent: "center",
  },
  bestWinesContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
  },
  bestWineCard: {
    position: "relative",
    maxWidth: vh(15),
    minWidth: vh(13),
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
  headerContainer: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backgroundColor: "#27052E",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  addButtonWrapper: {
    width: "95%",
    display: "flex",
    justifyContent: "center",
    maxWidth: "350px",
    position: "relative",
    zIndex: 1500,
    transform: "translateY(0px)",
    marginBottom: vh(2),
  },
  totalCountWrapper: {
    marginTop: vh(-1),
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
    paddingRight: "0.9vh",
    flexDirection: "column",
    overflowY: "auto",
    paddingBottom: vh(1.875), // 화면 맨 아래쪽 여백을 1.875로 지정 (약 15px)
    maxHeight: "45vh",
  },
  emptyText: {
    color: "#aaa",
    fontSize: vh(1.4),
    textAlign: "center",
  },
};
