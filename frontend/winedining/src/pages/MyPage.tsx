import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditModal from "../components/Modal/EditModal";
import axios from "axios";
import BackButton from "../components/BackButton";
import PixelButton from "../components/PixelButton";
import MySellerAddFlow from "../components/MySellerAddFlow";
import { Wine } from "../types/wine";
import pencilIcon from "../assets/icons/raphael_pensil.png";

interface UserProfile {
  userId: number;
  nickname: string;
  email: string | null;
  rank: string | null;
}

function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/v1/user/profile`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("성공, 사용자 정보:", response.data.data);
        setUserProfile(response.data.data);
      } catch (error) {
        console.error("실패, 사용자 정보 로딩 오류:", error);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [BASE_URL]);

  return (
    <div style={styles.container}>
      <div style={styles.backButtonWrapper}>
        <BackButton onClick={() => navigate("/home")} />
      </div>
      <h1 style={styles.title}>MY PAGE</h1>
      <img src={"/sample_image/myimg.png"} alt={"myimg"} style={styles.image} />
      <div style={styles.userInfo}>
        {isLoading || !userProfile ? (
          <div style={styles.placeholder}></div>
        ) : (
          <>
            <div style={styles.nicknameColumn}>
              <p style={styles.rank}>
                {/* <span style={styles.crown}>👑</span> */}
                <span style={styles.rankText}>{userProfile.rank}</span>
                {/* <span style={styles.crown}>👑</span> */}
              </p>
              <div style={styles.nicknameRow}>
                <span style={styles.nickname}>{userProfile.nickname}</span>
                <button onClick={() => setIsEditModalOpen(true)} style={styles.editIconButton}>
                  <img src={pencilIcon} alt="수정" style={styles.editIcon} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <PixelButton onClick={() => navigate("/winesellerlist")}>MY WINE SELLER</PixelButton>
        <PixelButton onClick={() => navigate("/wishlist")}>WISH LIST</PixelButton>
        <PixelButton onClick={() => navigate("/recommendtest")}>WINE TEST</PixelButton>
      </div>

      <EditModal
        nickname={userProfile?.nickname || ""}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
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
