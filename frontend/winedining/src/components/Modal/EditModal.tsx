import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { RootState } from "../../store/store";
// import { updateNickName, deleteAccount } from "../../store/slices/authSlice";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditModal = ({ isOpen, onClose }: EditModalProps) => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleNicknameChange = () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요!");
      return;
    }
    setError("");
    alert(`닉네임이 '${nickname}'(으)로 변경되었습니다!`);
    setNickname("");
    onClose();
  };

  const handleDeleteAccount = () => {
    if (window.confirm("정말 회원 탈퇴하시겠습니까?")) {
      alert("회원 탈퇴가 완료되었습니다.");
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <h2 style={styles.title}>회원 정보 관리</h2>

        {/* 닉네임 변경 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>닉네임 변경</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="새로운 닉네임 입력"
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button onClick={handleNicknameChange} style={styles.saveButton}>
            닉네임 변경하기
          </button>
        </div>

        <button onClick={handleDeleteAccount} style={styles.deleteButton}>
          ❌ 회원탈퇴
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#2a0e35",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "400px",
    position: "relative",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: "10px",
    top: "10px",
    border: "none",
    background: "none",
    fontSize: "18px",
    color: "white",
    cursor: "pointer",
  },
  title: {
    marginBottom: "15px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  error: {
    color: "#ff4d4d",
    fontSize: "12px",
    marginTop: "5px",
  },
  saveButton: {
    marginTop: "10px",
    backgroundColor: "#5a1a5e",
    color: "white",
    padding: "8px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
  },
};

export default EditModal;
