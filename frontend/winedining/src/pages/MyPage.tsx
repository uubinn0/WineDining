import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditModal from "../components/Modal/EditModal";
import AddSeller1Modal from "../components/Modal/AddSeller1Modal";
import AddSeller2Modal from "../components/Modal/AddSeller2Modal";
import AddSeller3Modal from "../components/Modal/AddSeller3Modal";
import { Wine } from "../types/wine";
import axios from "axios";

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
  const [isAddSellerModalOpen, setIsAddSellerModalOpen] = useState(false);
  const [isAddSeller2ModalOpen, setIsAddSeller2ModalOpen] = useState(false);
  const [isAddSeller3ModalOpen, setIsAddSeller3ModalOpen] = useState(false);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [drinkData, setDrinkData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  // 사용자 정보 로드
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 쿠키에서 Authorization 토큰 직접 추출
        const authToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("Authorization="))
          ?.split("=")[1];

        console.log("[DEBUG] Authorization:", authToken);

        const response = await axios.get(`${BASE_URL}/api/v1/users/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
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

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openAddSellerModal = () => setIsAddSellerModalOpen(true);
  const closeAddSellerModal = () => setIsAddSellerModalOpen(false);

  const openAddSeller2Modal = () => setIsAddSeller2ModalOpen(true);
  const closeAddSeller2Modal = () => setIsAddSeller2ModalOpen(false);

  const openAddSeller3Modal = () => setIsAddSeller3ModalOpen(true);
  const closeAddSeller3Modal = () => setIsAddSeller3ModalOpen(false);

  // 2번 모달이 변경될 때 확인
  useEffect(() => {
    console.log("2번:", isAddSeller2ModalOpen);
  }, [isAddSeller2ModalOpen]);

  // 1번 -> 2번
  const handleNextStep = (wine: Wine | null) => {
    if (!wine) return;
    setSelectedWine(wine);
    console.log("선택된 와인:", wine);

    setTimeout(() => {
      closeAddSellerModal();
      setIsAddSeller2ModalOpen(true);
    }, 100);
  };

  // 2번 -> 3번
  const handleNextStep2 = (drinkInfo: any) => {
    setDrinkData(drinkInfo);
    console.log("3번 모달 열기");
    console.log("2번 기록:", drinkInfo);
    closeAddSeller2Modal();
    setIsAddSeller3ModalOpen(true);
  };

  // 2번 -> 1번 이동 (뒤로가기)
  const handlePrevStep = () => {
    console.log("1번 모달 다시 열기");
    closeAddSeller2Modal();
    setIsAddSellerModalOpen(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>MY PAGE</h1>
      <div style={styles.buttonGroup}>
        <button onClick={() => navigate("/home")} style={styles.button}>
          홈으로 가기
        </button>
        <button onClick={() => navigate("/winesellerlist")} style={styles.button}>
          MY WINE SELLER
        </button>
        <button onClick={() => navigate("/wishlist")} style={styles.button}>
          WISH LIST
        </button>
        <button onClick={() => navigate("/test")} style={styles.button}>
          WINE TEST
        </button>
      </div>
      <div style={styles.modalButtonGroup}>
        <button onClick={openEditModal} style={styles.modalButton}>
          회원모달
        </button>
        <button onClick={openAddSellerModal} style={styles.modalButton}>
          내가 마신 와인 추가하기
        </button>
      </div>
      <EditModal isOpen={isEditModalOpen} onClose={closeEditModal} />
      <AddSeller1Modal isOpen={isAddSellerModalOpen} onClose={closeAddSellerModal} onNext={handleNextStep} />
      <AddSeller2Modal
        isOpen={isAddSeller2ModalOpen}
        onClose={closeAddSeller2Modal}
        onPrev={handlePrevStep}
        onNext={handleNextStep2}
        wineInfo={selectedWine!}
      />
      <AddSeller3Modal isOpen={isAddSeller3ModalOpen} onClose={closeAddSeller3Modal} drinkData={drinkData} />
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
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  modalButtonGroup: {
    marginTop: "20px",
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
};

export default MyPage;
