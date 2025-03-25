import React from "react";
import closeButton from "../assets/icons/closebutton.png"


interface KnowledgeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledge: { title: string; content: string };
}

const KnowledgeDetailModal: React.FC<KnowledgeDetailModalProps> = ({ isOpen, onClose, knowledge }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}  >
        <img src={closeButton} alt="Close" style={styles.closeIcon} /> {/* 이미지 버튼 */}
        </button>
        <h2 style={styles.title}>{knowledge.title}</h2>
        <p style={styles.content}>{knowledge.content}</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#21101B",
    border : "solid 5px #D6BA91",
    padding: "20px",
    borderRadius: "8px",
    width: "75%",
    color: "white",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "20px",
    cursor: "pointer",
  },
  closeIcon: {
    width: "30px",   // 아이콘 크기 조정
    height: "30px",  // 아이콘 크기 조정
  },
  title: {
    fontSize: "20px",
    color: "#FFF7F7",
    textAlign: "center",
    // WebkitTextStroke: "1px #6A3512",
    textShadow: "1px 1px 0 #6A3512, -1px -1px 0 #6A3512, 1px -1px 0 #6A3512, -1px 1px 0 #6A3512", 
    fontFamily: "Galmuri7",
    fontStyle: "normal",
    fontWeight : "400",
  },
  content: {
    textAlign: "start",
    color: "white",
    fontSize: "14px",
    fontFamily: "Galmuri9",  
    fontStyle: "normal",     
    fontWeight: "400",       
    lineHeight: "170%", 
  }
  
};

export default KnowledgeDetailModal;
