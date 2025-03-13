import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWines } from "../store/slices/wineSlice";
import { RootState, AppDispatch } from "../store/store";
import WineInfoCard from "../components/WineInfoCard";
import WineDetailModal from "../components/Modal/WineDetailModal";
import { Wine } from "../types/wine";

const WineList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { wines, status, error } = useSelector((state: RootState) => state.wine);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") dispatch(fetchWines());
  }, [dispatch, status]);

  const handleWineClick = (wine: Wine) => {
    setSelectedWine(wine);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWine(null);
  };

  if (status === "loading") {
    return <div>로딩 중</div>;
  }

  if (status === "failed") {
    return <div>오류 {error} </div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/home")}>홈으로가기</button>
      <h2>🍷 와인 리스트</h2>

      <div style={styles.grid}>
        {wines.map((wine) => (
          <WineInfoCard key={wine.id} wine={wine} onClick={handleWineClick} />
        ))}
      </div>

      {selectedWine && <WineDetailModal isOpen={isModalOpen} onClose={handleCloseModal} wine={selectedWine} />}
    </div>
  );
};

// style 명시해줘야 한다넹? 타입 스크립트에서는?
// 위나 아래 둘 중 편한거 쓰면 될듯 (모르면 물어보삼)
// const styles: Record<string, React.CSSProperties> = { /* 스타일 객체 */ };

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    textAlign: "center",
  },

  /* 와인 리스트 두개 씩 정렬 */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    marginTop: "20px",
  },
};

export default WineList;
