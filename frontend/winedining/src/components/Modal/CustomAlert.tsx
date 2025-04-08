import React from "react";

interface CustomAlertProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.message}>{message}</p>
        <button style={styles.button} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "3vh 5vw",
    borderRadius: "1vh",
    textAlign: "center",
    maxWidth: "80vw",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  },
  message: {
    marginBottom: "2vh",
    fontSize: "2vh",
    fontFamily: "Galmuri9",
  },
  button: {
    padding: "1vh 3vh",
    fontSize: "1.6vh",
    backgroundColor: "#ffcc00",
    color: "#000",
    border: "none",
    borderRadius: "1vh",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: "Galmuri7",
  },
};
