import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store"; // store 경로에 맞게 수정
import { updateNickname } from "../../store/slices/authSlice";
import { deleteUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
      // console.error("닉네임 변경 실패:", error);
      setError("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("정말 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.")) {
      try {
        await dispatch(deleteUser()).unwrap();
        alert("탈퇴가 완료되었습니다. 이용해주셔서 감사합니다!");
        navigate("/");
      } catch (err) {
        // console.error("회원탈퇴 실패:", err);
        alert("탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
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
          <button style={styles.cancelButton} onClick={handleDeleteUser}>
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
    border: "0.4vh solid #d4b27a",
    padding: "2vh 2.4vh",
    width: "80%",
    maxWidth: "340px",
    borderRadius: "1.2vh",
    textAlign: "left",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    top: "1vh",
    right: "1.2vh",
    background: "none",
    border: "none",
    fontSize: "1.6vh",
    color: "white",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    fontSize: "2.2vh",
    marginBottom: "3.3vh",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2vh",
  },
  label: {
    fontSize: "1.8vh",
    color: "white",
    marginRight: "1.2vh",
  },
  input: {
    flexGrow: 1,
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "0.2vh solid white",
    color: "white",
    padding: "0.4vh",
    fontSize: "1.8vh",
    outline: "none",
  },
  error: {
    fontSize: "1.3vh",
    color: "#ff4d4d",
    textAlign: "center",
    marginTop: "-1vh",
    marginBottom: "1vh",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1vh",
    marginTop: "1vh",
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    color: "#000",
    padding: "1vh 1.3vh",
    borderRadius: "0.5vh",
    border: "0.3vh solid #000",
    fontSize: "1.2vh",
    cursor: "pointer",
  },
  confirmButton: {
    backgroundColor: "#ffffff",
    color: "#000",
    padding: "1vh 1.3vh",
    borderRadius: "0.5vh",
    border: "0.3vh solid #000",
    fontSize: "1.2vh",
    cursor: "pointer",
  },
};

export default EditModal;
