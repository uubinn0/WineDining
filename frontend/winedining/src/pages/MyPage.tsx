import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store/store";

import EditModal from "../components/Modal/EditModal";
import BackButton from "../components/BackButton";
import PixelButton from "../components/PixelButton";
import MySellerAddFlow from "../components/MySellerAddFlow";
import pencilIcon from "../assets/icons/raphael_pensil.png";

function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // 전역 상태에서 사용자 정보 조회
  const { nickname, rank, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // nickname이 없거나 인증되지 않은 경우, 사용자 정보 fetch
  useEffect(() => {
    if (!nickname || !isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, nickname, isAuthenticated]);
  return (
    <div style={styles.container}>
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/home")} />
      </div>
      <h1 style={styles.title}>MY PAGE</h1>
      <img src={"/sample_image/myimg.png"} alt={"myimg"} style={styles.image} />

      <div style={styles.userInfo}>
        {!nickname ? (
          <div style={styles.placeholder}></div>
        ) : (
          <div style={styles.nicknameColumn}>
            <p style={styles.rank}>
              <span style={styles.rankText}>{rank}</span>
            </p>
            <div style={styles.nicknameRow}>
              <span style={styles.nickname}>{nickname}</span>
              <button onClick={() => setIsEditModalOpen(true)} style={styles.editIconButton}>
                <img src={pencilIcon} alt="수정" style={styles.editIcon} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <PixelButton onClick={() => navigate("/winesellerlist")}>MY WINE SELLER</PixelButton>
        <PixelButton onClick={() => navigate("/wishlist")}>WISH LIST</PixelButton>
        <PixelButton onClick={() => navigate("/recommendtest")}>WINE TEST</PixelButton>
      </div>

      {/*  수정 모달 닫힐 때 전역 상태 갱신 */}
      <EditModal nickname={nickname || ""} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

      <div style={styles.floatingAddButton}>
        <MySellerAddFlow />
      </div>
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
    alignItems: "flex-end",
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
    top: "1.6px",
  },
  floatingAddButton: {
    position: "absolute",
    bottom: "24px",
    right: "24px",
  },
};

export default MyPage;
