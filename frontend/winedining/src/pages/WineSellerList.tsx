import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { fetchWines } from "../store/slices/wineSlice";
import WineSellerCard from "../components/WineSellerCard";
import { Wine } from "../types/wine";

const WineSellerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { wines, status } = useSelector((state: RootState) => state.wine);
  const [bestWines, setBestWines] = useState<Wine[]>([]);

  useEffect(() => {
    dispatch(fetchWines()); // 필터 없이 전체 와인 불러오기 (내가 등록한 것만 가져와야 함)
  }, [dispatch]);

  const toggleBest = (wine: Wine) => {
    const alreadyBest = bestWines.some((w) => w.wine_id === wine.wine_id); // [1] 실제로, BEST 와인만 API 요청
    if (alreadyBest) {
      setBestWines((prev) => prev.filter((w) => w.wine_id !== wine.wine_id));
    } else {
      setBestWines((prev) => [...prev, wine]);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/mypage")}>뒤로가기</button>
      <h1 style={styles.title}>⚡ MY WINE SELLER ⚡</h1>

      {/*  BEST 캐러셀 */}
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
        {wines.map((wine) => (
          <WineSellerCard
            key={wine.wine_id}
            wine={wine}
            isBest={bestWines.some((w) => w.wine_id === wine.wine_id)}
            onBestClick={toggleBest}
          />
        ))}
      </div>
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
};

export default WineSellerList;
