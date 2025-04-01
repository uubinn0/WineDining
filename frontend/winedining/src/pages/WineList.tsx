import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { fetchWines, resetWines } from "../store/slices/wineSlice";
import { fetchWishes } from "../store/slices/wishSlice";
import WineInfoCard from "../components/WineInfoCard";
import WineFilterBar from "../components/WineFilterBar";
import WineDetailModal from "../components/Modal/WineDetailModal";
import { Wine, WineDetail, WineFilter } from "../types/wine";
import { fetchWineDetailThunk } from "../store/slices/wineSlice";
import BackButton from "../components/BackButton";

const WineList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { wines, status, page, hasMore } = useSelector((state: RootState) => state.wine);

  const [selectedWine, setSelectedWine] = useState<WineDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // WineFilter 전체 관리
  const [filter, setFilter] = useState<WineFilter>({
    keyword: "",
    filters: {
      type: [],
      grape: [],
      country: [],
      minPrice: 0,
      maxPrice: 300000,
      minSweetness: 1,
      maxSweetness: 5,
      minAcidity: 1,
      maxAcidity: 5,
      minTannin: 1,
      maxTannin: 5,
      minBody: 1,
      maxBody: 5,
      pairing: [],
    },
    sort: { field: "krName", order: "desc" },
    page: 1,
    limit: 20,
  });

  // 무한 스크롤 옵저버
  const observer = useRef<IntersectionObserver | null>(null);
  const lastWineRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (status === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          // filter.page를 nextPage로 업데이트
          setFilter((prev) => ({ ...prev, page: nextPage }));
          dispatch(fetchWines({ ...filter, page: nextPage }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [status, hasMore, page, filter, dispatch]
  );

  useEffect(() => {
    dispatch(resetWines());
    dispatch(fetchWishes());
    dispatch(fetchWines(filter));
  }, [dispatch]);

  // 와인 카드 클릭 시 상세 정보
  const handleWineClick = async (wine: Wine) => {
    const result = await dispatch(fetchWineDetailThunk(wine.wineId));
    if (fetchWineDetailThunk.fulfilled.match(result)) {
      setSelectedWine(result.payload);
      setIsModalOpen(true);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWine(null);
  };

  // 검색어 입력
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    const newFilter = { ...filter, keyword, page: 1 };
    setFilter(newFilter);

    dispatch(resetWines());
    dispatch(fetchWines(newFilter));
  };

  // 필터 변경 (WineFilter 통째로)
  const handleFilterChange = (newFilter: WineFilter) => {
    setFilter(newFilter);
    dispatch(resetWines());
    dispatch(fetchWines(newFilter));
  };

  return (
    <div style={{ backgroundColor: "#2a0e35", color: "white", minHeight: "100vh", padding: "20px" }}>
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/home")} />
      </div>
      <h2 style={{ textAlign: "center", fontSize: "22px" }}>⚡ WINE LIST ⚡</h2>

      {/* 검색 */}
      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="와인을 검색하세요"
          style={{
            width: "80%",
            maxWidth: "300px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
          }}
        />
      </div>

      {/* 필터 드롭다운 (WineFilter 전체 전달) */}
      <WineFilterBar filter={filter} onChange={handleFilterChange} />

      {/* 와인 카드 리스트 + 무한 스크롤 */}
      <div style={styles.wineListContainer}>
        {wines.map((wine, index) => (
          <div
            ref={index === wines.length - 1 ? lastWineRef : null}
            key={`${wine.wineId}-${index}`} // 복합 key를 사용하여 유니크함 보장
          >
            <WineInfoCard wine={wine} onClick={handleWineClick} />
          </div>
        ))}
      </div>

      {/* 상세 모달 */}
      {selectedWine && <WineDetailModal isOpen={isModalOpen} onClose={handleCloseModal} wine={selectedWine} />}
    </div>
  );
};

export default WineList;

const styles: { [key: string]: React.CSSProperties } = {
  backButtonWrapper: {
    position: "absolute",
    top: "16px",
    left: "16px",
  },
  wineListContainer: {
    maxHeight: "60vh",
    overflowY: "auto",
    paddingRight: "8px",
    marginTop: "20px", // 필터바와의 간격을 위해 추가
  },
};
