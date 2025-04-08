import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { fetchWines, resetWines, fetchWineDetailThunk } from "../store/slices/wineSlice";
import { fetchWishes } from "../store/slices/wishSlice";
import WineInfoCard from "../components/WineInfoCard";
import WineFilterBar from "../components/WineFilterBar";
import WineDetailModal from "../components/Modal/WineDetailModal";
import { Wine, WineDetail, WineFilter } from "../types/wine";
import BackButton from "../components/BackButton";
import PixelTitle from "../components/PixcelTitle";
import { trackEvent } from "../utils/analytics"; // GA 이벤트 트래커
import { vh } from "../utils/vh";

const WineList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // wineSlice 상태
  const { wines, status, page, hasMore, totalCount } = useSelector((state: RootState) => state.wine);

  // 모달
  const [selectedWine, setSelectedWine] = useState<WineDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 검색
  const [searchTerm, setSearchTerm] = useState("");

  // 필터 상태
  const [filter, setFilter] = useState<WineFilter>({
    keyword: "",
    filters: {
      type: [],
      grape: [],
      country: [],
      minPrice: 0,
      maxPrice: 1500000,
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
          setFilter((prev) => ({ ...prev, page: nextPage }));
          dispatch(fetchWines({ ...filter, page: nextPage }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [status, hasMore, page, filter, dispatch]
  );

  // 초기 로드
  useEffect(() => {
    dispatch(resetWines());
    dispatch(fetchWishes());
    dispatch(fetchWines(filter));
  }, [dispatch]);

  // 검색어 입력 시 이벤트
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    // 이벤트 태깅: 검색어 입력
    trackEvent("wine_search_input", { query: keyword });

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

  // 와인 카드 클릭 시 상세 정보
  const handleWineClick = async (wine: Wine) => {
    // 이벤트 태깅: 와인 카드 클릭
    trackEvent("wine_click", { wineId: wine.wineId, wineName: wine.name });

    const result = await dispatch(fetchWineDetailThunk(wine.wineId));
    if (fetchWineDetailThunk.fulfilled.match(result)) {
      setSelectedWine(result.payload);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWine(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/home")} />
      </div>
      <PixelTitle
        text="WINE"
        imageSrc="/sample_image/yellow_lightning.png"
        fontSize="16px"
        color="#fefefe"
        imageSize="24px"
      />

      {/* 검색 */}
      <div style={styles.searchBox}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="와인을 검색하세요"
          style={styles.searchInput}
        />
      </div>

      {/* 필터 바 */}
      <WineFilterBar filter={filter} onChange={handleFilterChange} />

      {totalCount > 0 && <div style={styles.totalCountText}>총 {totalCount.toLocaleString()}개의 와인 검색</div>}

      {/* 와인 카드 리스트 + 무한 스크롤 */}
      <div style={styles.wineListContainer}>
        {wines.map((wine, index) => (
          <div key={`${wine.wineId}-${index}`} ref={index === wines.length - 1 ? lastWineRef : null}>
            <WineInfoCard wine={wine} onClick={handleWineClick} />
          </div>
        ))}
      </div>

      {/* 상세 모달 */}
      {selectedWine && (
        <WineDetailModal isOpen={isModalOpen} onClose={handleCloseModal} wine={selectedWine} fromPage="winelist" />
      )}
    </div>
  );
};

export default WineList;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#2a0e35",
    color: "white",
    minHeight: "100vh",
    padding: "2.2vh",
    position: "relative",
  },
  backButtonWrapper: {
    position: "absolute",
    top: "1.8vh",
    left: "1.8vh",
  },
  searchBox: {
    display: "flex",
    justifyContent: "center",
    margin: "1.1vh 0",
  },
  searchInput: {
    backgroundColor: "#381837",
    border: "0.22vh solid #D6BA91",
    color: "white",
    width: "100%",
    maxWidth: "320px",
    padding: "1.1vh",
    fontSize: "2vh",
    borderRadius: "1.8vh",
  },
  totalCountText: {
    textAlign: "right",
    fontSize: "1.8vh",
    color: "#ccc",
    marginRight: "2vh",
    marginTop: "-2vh",
  },
  wineListContainer: {
    maxHeight: "60vh",
    overflowY: "auto",
    paddingRight: "0.9vh",
    marginTop: "2vh",
  },
};
