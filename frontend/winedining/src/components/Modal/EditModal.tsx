import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store"; // store 경로에 맞게 수정
import { updateNickname } from "../../store/slices/authSlice";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
  onNicknameUpdated?: (newNickname: string) => void;
}

const EditModal = ({ nickname: initialNickname, isOpen, onClose, onNicknameUpdated }: EditModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState("");

  useEffect(() => {
    setNickname(initialNickname);
  }, [initialNickname]);

  if (!isOpen) return null;

  const handleNicknameChange = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요!");
      return;
    }

    try {
      await dispatch(updateNickname(nickname)).unwrap();
      alert(`닉네임이 '${nickname}'(으)로 변경되었습니다!`);

      if (onNicknameUpdated) {
        onNicknameUpdated(nickname); // 부모에 전달
      }

      setError("");
      onClose();
    } catch (error) {
      console.error("닉네임 변경 실패:", error);
      setError("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <h2 style={styles.title}>회원 정보 수정</h2>

        <div style={styles.inputRow}>
          <span style={styles.label}>닉네임:</span>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} style={styles.input} />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.buttonRow}>
          <button style={styles.cancelButton} onClick={onClose}>
            회원탈퇴
          </button>
          <button style={styles.confirmButton} onClick={handleNicknameChange}>
            수정완료
          </button>
        </div>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    backgroundColor: "#2a0e35",
    border: "4px solid #d4b27a",
    padding: "20px 24px",
    width: "80%",
    maxWidth: "340px",
    borderRadius: "12px",
    textAlign: "left",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "16px",
    color: "white",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    fontSize: "18px",
    marginBottom: "30px",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  label: {
    fontSize: "16px",
    color: "white",
    marginRight: "10px",
  },
  input: {
    flexGrow: 1,
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "2px solid white",
    color: "white",
    padding: "4px",
    fontSize: "16px",
    outline: "none",
  },
  error: {
    fontSize: "10px",
    color: "#ff4d4d",
    textAlign: "center",
    marginTop: "-8px",
    marginBottom: "8px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "5px",
    marginTop: "10px",
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    color: "#000",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "2px solid #000",
    fontSize: "10px",
    cursor: "pointer",
  },
  confirmButton: {
    backgroundColor: "#ffffff",
    color: "#000",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "2px solid #000",
    fontSize: "10px",
    cursor: "pointer",
  },
};

export default EditModal;
