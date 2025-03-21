import React from "react";
import winemenu from "../../assets/images/modal/winemenu.png";

interface Wine {
    name: string;
    description: string;
    image: string;
  }
  
  interface ModalProps {
    wines: Wine[];
    onClose: () => void;
  }
  

interface ModalProps {
  wines: Wine[];
  onClose: () => void;
}

const RecommendationResult: React.FC<ModalProps> = ({ wines, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <img src={winemenu} alt="와인 메뉴판" style={styles.menuImage} />
        <h2 style={styles.title}>✨ 추천 리스트 ✨</h2>
        <ul style={styles.wineList}>
          {wines.map((wine, index) => (
            <li key={index} style={styles.wineItem}>
              <img src={wine.image} alt={wine.name} style={styles.wineImage} />
              <div style={styles.wineText}>
                <h3>{wine.name}</h3>
                <p>{wine.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <button style={styles.closeButton} onClick={onClose}>
          메인으로 돌아가기
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
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    width: "320px",
    height: "550px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  menuImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1,
  },
  title: {
    marginTop: "40px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
  },
  wineList: {
    listStyle: "none",
    padding: 0,
    width: "85%",
    marginTop: "30px",
  },
  wineItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "10px",
    borderRadius: "10px",
  },
  wineImage: {
    width: "50px",
    height: "120px",
    objectFit: "contain",
    marginRight: "10px",
  },
  wineText: {
    flex: 1,
    fontSize: "14px",
    color: "#333",
  },
  closeButton: {
    marginTop: "10px",
    padding: "8px 16px",
    border: "none",
    backgroundColor: "#d32f2f",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default RecommendationResult;