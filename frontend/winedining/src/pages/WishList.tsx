import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWishes } from "../store/slices/wishSlice";
import { fetchWineDetailThunk } from "../store/slices/wineSlice";
import { RootState, AppDispatch } from "../store/store";
import WineWishCard from "../components/WineWishCard";
import WineDetailModal from "../components/Modal/WineDetailModal";
import { WineDetail } from "../types/wine";

const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.wish);
  const { wineDetail } = useSelector((state: RootState) => state.wine); // wineSlice에서 가져온 상세

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWishes());
  }, [dispatch]);

  const handleWishClick = (wineId: number) => {
    dispatch(fetchWineDetailThunk(wineId));
    setIsModalOpen(true);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/mypage")}>뒤로가기</button>
      <h1 style={styles.headertext}>
        <img src={"/sample_image/yellow_lightning.png"} alt="번개" style={styles.image} />
        MY WISH LIST
        <img src={"/sample_image/yellow_lightning.png"} alt="번개" style={styles.image} />
      </h1>

      {status === "loading" && <p>위시리스트를 불러오는 중...</p>}
      {status === "failed" && <p>위시리스트를 불러오는 데 실패했습니다.</p>}

      {items.length === 0 ? (
        <p>위시리스트가 비어 있습니다.</p>
      ) : (
        <div style={styles.grid}>
          {items.map((wish) => (
            <div key={wish.id} onClick={() => handleWishClick(wish.wine.wineId)}>
              <WineWishCard wish={wish} />
            </div>
          ))}
        </div>
      )}

      {isModalOpen && wineDetail && (
        <WineDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} wine={wineDetail} />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#27052E",
    height: "100vh",
  },
  headertext: {
    fontSize: "24px",
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    justifyContent: "center",
    padding: "10px",
  },
  image: {
    width: "18px",
    height: "20px",
  },
};

export default WishList;
