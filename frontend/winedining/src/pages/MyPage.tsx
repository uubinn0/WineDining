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
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom"; // 추가

function MyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from; // "mypage" or undefined

  const handleMBTITestClick = () => {
    navigate("/MBTITest");
  };

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

  // 등급에 따라 이미지와 색상 반환 함수
  const getLevelAssets = (rank: string) => {
    switch (rank) {
      case "주정뱅이":
        return { img: "/sample_image/rank_100.png", color: "#A83A9D", level: "Lv.6" };
      case "마스터":
        return { img: "/sample_image/rank_20.png", color: "#444EBF", level: "Lv.5" };
      case "소믈리에":
        return { img: "/sample_image/rank_10.png", color: "#5AB5A4", level: "Lv.4" };
      case "애호가":
        return { img: "/sample_image/rank_5.png", color: "#CCA742", level: "Lv.3" };
      case "입문자":
        return { img: "/sample_image/rank_1.png", color: "#BE7272", level: "Lv.2" };
      case "초보자":
      default:
        return { img: "/sample_image/rank_0.png", color: "#FFE2E2", level: "Lv.1" };
    }
  };

  const { img, color, level } = getLevelAssets(user?.rank ?? "초보자");
  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/home")} />
      </div>
      <h1 style={styles.title}>MY PAGE</h1>

      {/* <img src={"/sample_image/myimg.png"} alt={"myimg"} style={styles.image} /> */}

      <img src={img} alt="레벨 이미지" style={styles.image} />
      <div style={styles.userInfo}>
        {status === "loading" || !user ? (
          <div style={styles.placeholder}>로딩 중...</div>
        ) : (
          <div style={styles.nicknameColumn}>
            <p style={styles.rank}>
              <span style={{ ...styles.rankText, color }}>
                {level} {user.rank}
              </span>
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
        <PixelButton onClick={() => navigate("/winesellerlist")}>MY WINE CELLAR</PixelButton>
        <PixelButton onClick={() => navigate("/wishlist")}>WISH LIST</PixelButton>
        <PixelButton onClick={goToRecommendTest}>WINE TEST</PixelButton>
        <PixelButton onClick={() => navigate("/MBTITest", { state: { from: "mypage" } })}>WINE MBTI TEST</PixelButton>
      </div>

      {/* <div style={styles.floatingAddButton}>
        <MySellerAddFlow />
      </div> */}
    </motion.div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "2.7vh",
    color: "white",
    backgroundColor: "#2a0e35",
    minHeight: "100vh",
  },
  image: {
    width: "12vh",
    height: "12vh",
    border: "0.6vh solid #d4b27a",
    backgroundColor: "#F5F4E6",
    borderRadius: "6vh",
    marginTop: "5vh",
  },
  title: {
    fontFamily: "PressStart2P",
    fontSize: "3vh",
    marginBottom: "2.4vh",
  },
  nickname: {
    fontSize: "2.2vh",
    paddingLeft: "1.8vh",
  },
  backButtonWrapper: {
    position: "absolute",
    top: "1.6vh",
    left: "1.6vh",
  },
  buttonGroup: {
    padding: "4vh 0",
    display: "flex",
    justifyContent: "center",
    gap: "3.8vh",
    flexWrap: "wrap",
  },
  modalButtonGroup: {
    marginBottom: "4vh",
    display: "flex",
    justifyContent: "center",
    gap: "1.3vh",
  },
  button: {
    backgroundColor: "#5a1a5e",
    color: "white",
    border: "none",
    padding: "1.2vh 1.8vh",
    fontSize: "1.6vh",
    borderRadius: "1vh",
    cursor: "pointer",
    transition: "0.2s",
  },
  modalButton: {
    backgroundColor: "#ffcc00",
    color: "#2a0e35",
    border: "none",
    padding: "1.2vh 1.7vh",
    fontSize: "1.6vh",
    borderRadius: "0.8vh",
    cursor: "pointer",
    transition: "0.2s",
  },
  userInfo: {
    margin: "1.2vh 0",
    minHeight: "70px",
  },
  placeholder: {
    height: "100%",
  },
  nicknameRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6vh",
    marginBottom: "0.6vh",
  },

  nicknameColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6vh",
  },

  editIconButton: {
    height: "1.8vh",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  editIcon: {
    width: "2vh",
    height: "2vh",
  },
  rank: {
    display: "flex",
    alignItems: "flex-end", // 왕관 기준으로 맞추기
    justifyContent: "center",
    gap: "0.6vh",
    fontSize: "1.5vh",
    color: "#FFD700",
    marginBottom: "0.7vh",
  },

  crown: {
    fontSize: "1.4vh",
    lineHeight: 1,
  },

  rankText: {
    fontSize: "1.7vh",
    lineHeight: 1,
    position: "relative",
    top: "1.6px", // 왕관과 수직 정렬 위해 아래로 살짝 내림
  },

  floatingAddButton: {
    position: "absolute",
    bottom: "2.6vh",
    right: "2.6vh",
  },
};

export default MyPage;
