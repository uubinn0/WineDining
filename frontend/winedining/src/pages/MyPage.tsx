import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditModal from "../components/Modal/EditModal";
import BackButton from "../components/BackButton";
import PixelButton from "../components/PixelButton";
import MySellerAddFlow from "../components/MySellerAddFlow";
import pencilIcon from "../assets/icons/raphael_pensil.png";
import { fetchUserProfile } from "../store/slices/authSlice";
import { RootState, AppDispatch } from "../store/store";
import { setCameFromRecommendFlow } from "../store/slices/testSlice";

function MyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const goToRecommendTest = () => {
    dispatch(setCameFromRecommendFlow("mypage")); // 마이페이지에서 넘어갔음을 설정
    navigate("/recommendtest");
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user, status } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, status]);

  return (
    <div style={styles.container}>
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/home")} />
      </div>
      <h1 style={styles.title}>MY PAGE</h1>

      <img src={"/sample_image/myimg.png"} alt={"myimg"} style={styles.image} />

      <div style={styles.userInfo}>
        {status === "loading" || !user ? (
          <div style={styles.placeholder}>로딩 중...</div>
        ) : (
          <div style={styles.nicknameColumn}>
            <p style={styles.rank}>
              <span style={styles.rankText}>{user.rank}</span>
            </p>
            <div style={styles.nicknameRow}>
              <span style={styles.nickname}>{user.nickname}</span>
              <button onClick={() => setIsEditModalOpen(true)} style={styles.editIconButton}>
                <img src={pencilIcon} alt="수정" style={styles.editIcon} />
              </button>
            </div>
          </div>
        )}

        <EditModal nickname={user?.nickname || ""} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      </div>

      <div style={styles.buttonGroup}>
        <PixelButton onClick={() => navigate("/winesellerlist")}>MY WINE SELLER</PixelButton>
        <PixelButton onClick={() => navigate("/wishlist")}>WISH LIST</PixelButton>
        <PixelButton onClick={goToRecommendTest}>WINE TEST</PixelButton>
      </div>

      {/* <div style={styles.floatingAddButton}>
        <MySellerAddFlow />
      </div> */}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "20px",
    color: "white",
    backgroundColor: "#2a0e35",
    minHeight: "100vh",
  },
  image: {
    width: "100px",
    height: "100px",
    border: "4px solid #d4b27a",
    backgroundColor: "#F5F4E6",
    borderRadius: "50px",
    marginTop: "40px",
  },
  title: {
    fontFamily: "PressStart2P",
    fontSize: "24px",
    marginBottom: "20px",
  },
  nickname: {
    fontSize: "18px",
    paddingLeft: "25px",
  },
  backButtonWrapper: {
    position: "absolute",
    top: "16px",
    left: "16px",
  },
  buttonGroup: {
    padding: "30px 0",
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },
  modalButtonGroup: {
    marginBottom: "40px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  button: {
    backgroundColor: "#5a1a5e",
    color: "white",
    border: "none",
    padding: "10px 15px",
    fontSize: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },
  modalButton: {
    backgroundColor: "#ffcc00",
    color: "#2a0e35",
    border: "none",
    padding: "10px 15px",
    fontSize: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },
  userInfo: {
    margin: "10px 0",
    minHeight: "70px",
  },
  placeholder: {
    height: "100%",
  },
  nicknameRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    marginBottom: "4px",
  },

  nicknameColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  },

  editIconButton: {
    height: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  editIcon: {
    width: "18px",
    height: "18px",
  },
  rank: {
    display: "flex",
    alignItems: "flex-end", // 왕관 기준으로 맞추기
    justifyContent: "center",
    gap: "4px",
    fontSize: "12px",
    color: "#FFD700",
    marginBottom: "5px",
  },

  crown: {
    fontSize: "12px",
    lineHeight: 1,
  },

  rankText: {
    fontSize: "12px",
    lineHeight: 1,
    position: "relative",
    top: "1.6px", // 왕관과 수직 정렬 위해 아래로 살짝 내림
  },

  floatingAddButton: {
    position: "absolute",
    bottom: "24px",
    right: "24px",
  },
};

export default MyPage;
