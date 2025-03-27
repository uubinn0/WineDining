import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWines } from "../store/slices/wineSlice";
import { RootState, AppDispatch } from "../store/store";
import WineInfoCard from "../components/WineInfoCard";
import WineDetailModal from "../components/Modal/WineDetailModal";
import { Wine, WineFilter } from "../types/wine";
import { fetchWineDetailThunk } from "../store/slices/wineSlice";
import { WineDetail } from "../types/wine";

const WineList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { wines, status, error } = useSelector((state: RootState) => state.wine);
  const [selectedWine, setSelectedWine] = useState<WineDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "idle") {
      const defaultFilter: WineFilter = {
        keyword: "",
        filters: {
          type: [],
          grape: [],
          country: [],
          minPrice: 0,
          maxPrice: 1000000,
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
        sort: {
          field: "price",
          order: "desc",
        },
        page: 1,
        limit: 20,
      };

      dispatch(fetchWines(defaultFilter));
    }
  }, [dispatch, status]);

  const handleWineClick = async (wine: Wine) => {
    const result = await dispatch(fetchWineDetailThunk(wine.wineId));
    if (fetchWineDetailThunk.fulfilled.match(result)) {
      setSelectedWine(result.payload); // WineDetail 객체
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWine(null);
  };

  const filteredWines = wines.filter((wine) => wine.name.toLowerCase().includes(searchTerm.trim().toLowerCase()));

  if (status === "loading") {
    return <div style={styles.loading}>로딩 중...</div>;
  }

  if (status === "failed") {
    return <div style={styles.error}>오류 발생: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/home")}>◀️</button>
      <h2 style={styles.title}>⚡ WINE LIST ⚡</h2>

      {/* 검색창 */}
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="러시안잭 소비뇽 블랑"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* 필터 아이콘 */}
      <div style={styles.filterSection}>
        <span role="img" aria-label="종류">
          🍷 종류
        </span>
        <span role="img" aria-label="품종">
          🍇 품종
        </span>
        <span role="img" aria-label="맛">
          🌊 맛
        </span>
        <span role="img" aria-label="국가">
          📍 국가
        </span>
        <span role="img" aria-label="가격">
          💲 가격
        </span>
        <span role="img" aria-label="페어링">
          🍽 페어링
        </span>
      </div>

      {/* 와인 리스트 */}
      <div style={styles.list}>
        {filteredWines.map((wine) => (
          <WineInfoCard key={wine.wineId} wine={wine} onClick={handleWineClick} />
        ))}
      </div>

      {selectedWine && <WineDetailModal isOpen={isModalOpen} onClose={handleCloseModal} wine={selectedWine} />}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#2a0e35",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Press Start 2P', cursive",
    textAlign: "center",
  },
  title: {
    fontSize: "22px",
    marginBottom: "10px",
    textTransform: "uppercase",
  },
  searchBar: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  searchInput: {
    width: "90%",
    maxWidth: "300px",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    textAlign: "center",
    backgroundColor: "#5a1a5e",
    color: "white",
  },
  filterSection: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
    fontSize: "12px",
    backgroundColor: "#3b0b40",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  loading: {
    fontSize: "16px",
    textAlign: "center",
    marginTop: "20px",
  },
  error: {
    fontSize: "16px",
    color: "#ff4d4d",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default WineList;
