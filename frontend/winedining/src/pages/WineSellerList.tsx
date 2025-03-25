import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { fetchWines } from "../store/slices/wineSlice";
import { fetchNotes } from "../store/slices/noteSlice";
import WineSellerCard from "../components/WineSellerCard";
import WineSellerDetailModal from "../components/Modal/WineSellerDetailModal";
import { Wine } from "../types/wine";
import { WineNote } from "../types/note";
import { fetchAllNotes } from "../store/slices/noteSlice";

const WineSellerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { wines, status } = useSelector((state: RootState) => state.wine);
  const { notes } = useSelector((state: RootState) => state.note);
  const [bestWines, setBestWines] = useState<Wine[]>([]);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWines());
    dispatch(fetchNotesAll()); // 모든 노트 불러오기
  }, [dispatch]);

  // 노트를 가진 와인만 필터링
  const winesWithNotes = wines.filter((wine) => notes.some((note) => note.bottle_id === wine.wine_id));

  const toggleBest = (wine: Wine) => {
    const alreadyBest = bestWines.some((w) => w.wine_id === wine.wine_id);
    if (alreadyBest) {
      setBestWines((prev) => prev.filter((w) => w.wine_id !== wine.wine_id));
    } else {
      setBestWines((prev) => [...prev, wine]);
    }
  };

  // 셀러 디테일 모달 열기
  const openDetailModal = (wine: Wine) => {
    setSelectedWine(wine);
    setIsDetailOpen(true);
  };

  // 셀러 디테일 모달 닫기
  const closeDetailModal = () => {
    setSelectedWine(null);
    setIsDetailOpen(false);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/mypage")}>뒤로가기</button>
      <h1 style={styles.title}>⚡ MY WINE SELLER ⚡</h1>

      <div style={styles.carousel}>
        {bestWines.length > 0 ? (
          bestWines.map((wine) => (
            <img
              key={wine.wine_id}
              src={wine.image !== "no_image" ? wine.image : "/sample_image/wine_sample.jpg"}
              alt={wine.kr_name}
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
        {winesWithNotes.map((wine) => (
          <WineSellerCard
            key={wine.wine_id}
            wine={wine}
            isBest={bestWines.some((w) => w.wine_id === wine.wine_id)}
            onBestClick={toggleBest}
            onDetailClick={() => openDetailModal(wine)}
          />
        ))}
      </div>

      {selectedWine && isDetailOpen && (
        <WineSellerDetailModal wine={selectedWine} isOpen={isDetailOpen} onClose={closeDetailModal} />
      )}
    </div>
  );
};

const fetchNotesAll = () => async (dispatch: AppDispatch) => {
  // NOTE: 이건 전체 note를 위한 mock 함수. 실제 백엔드에서는 사용자별로 필터링 필요
  const allBottleIds = Array.from({ length: 40 }, (_, i) => i + 1); // bottle_id 1~40
  for (const id of allBottleIds) {
    await dispatch(fetchNotes(id));
  }
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
  },
  emptyText: {
    color: "#aaa",
    fontSize: "14px",
  },
};

export default WineSellerList;
