import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditModal from "../components/Modal/EditModal";
import AddSellerModal from "../components/Modal/AddSellerModal"; // ✅ 추가

function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSellerModalOpen, setIsAddSellerModalOpen] = useState(false); // ✅ 추가

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openAddSellerModal = () => setIsAddSellerModalOpen(true); // ✅ 추가
  const closeAddSellerModal = () => setIsAddSellerModalOpen(false); // ✅ 추가

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
      <AddSellerModal isOpen={isAddSellerModalOpen} onClose={closeAddSellerModal} /> {/* ✅ 추가 */}
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
