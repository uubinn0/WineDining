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
import PixelTitle from "../components/PixcelTitle";

const WineList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { wines, status, page, hasMore, totalCount } = useSelector((state: RootState) => state.wine);

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

    const newFilter = { ...filter, keyword, page: 1, totalCount };
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
    <div
      style={{
        backgroundColor: "#2a0e35",
        color: "white",
        minHeight: "100vh", // 이미 vh 단위임
        padding: "2.2vh", // 약 20px (900px 높이 기준)
      }}
    >
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
      <div style={{ display: "flex", justifyContent: "center", margin: "1.1vh 0" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder=" 와인을 검색하세요"
          style={{
            backgroundColor: "#381837",
            border: "0.22vh solid #D6BA91", // 약 2px
            color: "white",
            width: "100%",
            maxWidth: "320px", // width는 고정값으로 두어도 좋습니다.
            padding: "1.1vh", // 약 10px
            fontSize: "2vh",
            borderRadius: "1.8vh", // 약 16px
          }}
        />
      </div>

      {/* 필터 드롭다운 (WineFilter 전체 전달) */}
      <WineFilterBar filter={filter} onChange={handleFilterChange} />

      {totalCount > 0 && (
        <div style={{ textAlign: "right", fontSize: "1.8vh", color: "#ccc", marginRight: "2vh" }}>
          총 {totalCount.toLocaleString()}개의 와인 검색
        </div>
      )}
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
    top: "1.8vh", // 약 16px
    left: "1.8vh", // 약 16px
  },
  wineListContainer: {
    maxHeight: "60vh", // vh 단위
    overflowY: "auto",
    paddingRight: "0.9vh", // 약 8px
    marginTop: "2.2vh", // 약 20px
  },
};
