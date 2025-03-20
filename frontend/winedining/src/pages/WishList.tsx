import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWishList } from "../store/slices/wishSlice";
import { RootState, AppDispatch } from "../store/store";
import WineWishCard from "../components/WineWishCard";

/* 지금 구현안되어 있는 부분
- 위시리스트에서 눌렀을때 상세페이지가 안뜸.
*/

const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { wishes, status } = useSelector((state: RootState) => state.wish);

  useEffect(() => {
    dispatch(fetchWishList());
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/mypage")}>뒤로가기</button>
      <h1 style={styles.headertext}>
        <img src={"/sample_image/yellow_lightning.png"} alt={"번개 이미지"} style={styles.image} />
        MY WISH LIST <img src={"/sample_image/yellow_lightning.png"} alt={"번개 이미지"} style={styles.image} />
      </h1>

      {status === "loading" && <p>위시리스트를 불러오는 중...</p>}
      {status === "failed" && <p>위시리스트를 불러오는 데 실패했습니다.</p>}

      {wishes.length === 0 ? (
        <p>위시리스트가 비어 있습니다.</p>
      ) : (
        <div style={styles.grid}>
          {wishes.map((wish) => (
            <WineWishCard key={wish.id} wish={wish} />
          ))}
        </div>
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
    fontSize: "24px", // 텍스트 크기 조정
    color: "#FFFFFF", // 흰색으로 변경
    fontWeight: "bold", // 굵게 강조
    textAlign: "center",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px", // 번개 이미지와 간격 조정
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 1줄에 2개씩 배치
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

export {};
