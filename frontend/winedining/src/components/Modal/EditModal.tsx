import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store"; // store 경로에 맞게 수정
import { updateNickname, deleteUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { vh } from "../../utils/vh";
import { motion } from "framer-motion";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
  onNicknameUpdated?: (newNickname: string) => void;
}

interface CustomAlertProps {
  message: string;
  onClose?: () => void;
}

const EditModal = ({ nickname: initialNickname, isOpen, onClose, onNicknameUpdated }: EditModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState("");
  const [customAlert, setCustomAlert] = useState<CustomAlertProps | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setNickname(initialNickname);
  }, [initialNickname]);

  if (!isOpen) return null;

  // 모던한 디자인의 커스텀 Alert 모달 컴포넌트
  const AlertModal = ({ message, onClose: handleAlertClose }: CustomAlertProps) => (
    <motion.div
      style={styles.alertOverlay}
      onClick={handleAlertClose}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div style={styles.alertModal} onClick={(e) => e.stopPropagation()}>
        <p style={styles.alertMessage}>{message}</p>
        <div style={styles.alertButtonContainer}>
          <button style={styles.alertButton} onClick={handleAlertClose}>
            확인
          </button>
        </div>
      </div>
    </motion.div>
  );

  const handleNicknameChange = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요!");
      return;
    }

    try {
      await dispatch(updateNickname(nickname)).unwrap();
      // 커스텀 alert 호출 (예시: "닉네임이 '정다인dㅇ'(으)로 변경되었습니다!")
      setCustomAlert({
        message: `닉네임이 '${nickname}'(으)로 변경되었습니다!`,
        onClose: () => {
          setCustomAlert(null);
          onClose();
        },
      });

      if (onNicknameUpdated) {
        onNicknameUpdated(nickname);
      }
      setError("");
    } catch (error) {
      setError("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("정말 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.")) {
      try {
        await dispatch(deleteUser()).unwrap();
        setCustomAlert({
          message: "탈퇴가 완료되었습니다. 이용해주셔서 감사합니다!",
          onClose: () => {
            setCustomAlert(null);
            navigate("/");
          },
        });
      } catch (err) {
        alert("탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <>
      <motion.div
        style={styles.overlay}
        onClick={onClose}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
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
      </motion.div>

      {customAlert && <AlertModal message={customAlert.message} onClose={customAlert.onClose} />}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  // EditModal 공통 오버레이 (변경 없음)
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
    width: "90%",
    maxWidth: "45vh",
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
    fontFamily: "Galmuri9",
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
    backgroundColor: "#FFFFFF",
    minWidth: "6.25vh",
    color: "#000000",
    fontSize: "1.25vh",
    border: "none",
    padding: "1vh 1vh",
    borderRadius: "0.75vh",
    cursor: "pointer",
    fontFamily: "Galmuri7",
    textAlign: "center",
    boxShadow: `${vh(0.6)} ${vh(0.6)} 0 #000`,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  confirmButton: {
    backgroundColor: "#FFFFFF",
    minWidth: "6.25vh",
    color: "#000000",
    fontSize: "1.25vh",
    border: "none",
    padding: "1vh 1vh",
    borderRadius: "0.75vh",
    cursor: "pointer",
    fontFamily: "Galmuri7",
    textAlign: "center",
    boxShadow: `${vh(0.6)} ${vh(0.6)} 0 #000`,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  // Alert 모달 관련 스타일 (배경 블러 효과 적용)
  alertOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // 배경 블러: backgroundColor와 함께 backdropFilter로 블러 처리를 적용
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1100,
  },
  alertModal: {
    backgroundColor: "rgba(42, 14, 53, 0.9)",
    border: "0.4vh solid #d4b27a",
    padding: "2vh 2.4vh",
    width: "100%",
    maxWidth: "45vh",
    borderRadius: "1.2vh",
    textAlign: "center",
    color: "white",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  },
  alertMessage: {
    fontSize: "1.8vh",
    marginBottom: "2vh",
  },
  alertButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  alertButton: {
    backgroundColor: "#FFFFFF",
    minWidth: "6.25vh",
    color: "#000000",
    fontSize: "1.25vh",
    border: "none",
    padding: "1vh 2vh",
    borderRadius: "0.75vh",
    cursor: "pointer",
    fontFamily: "Galmuri7",
    textAlign: "center",
    boxShadow: `${vh(0.6)} ${vh(0.6)} 0 #000`,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
};

export default EditModal;
