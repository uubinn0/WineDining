import React from "react";
import { motion } from "framer-motion";

interface KnowledgeCardProps {
  image: string;
  title: string;
  isColor: boolean;
  onClick: () => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ image, title, isColor, onClick }) => {
  return (
    <motion.div
      style={styles.card}
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 1.5vh rgba(255, 255, 255, 0.3)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src={image}
        alt={title}
        style={{
          ...styles.image,
          filter: isColor ? "none" : "grayscale(100%)", // 컬러/흑백 처리
        }}
      />
      <div style={styles.cardContent}>
        <div>{title}</div>
      </div>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "auto",
    height: "80%",
    borderRadius: "1vh",
    backgroundColor: "#21101B",
    border: "solid 5px #D6BA91",
    cursor: "pointer",
    padding: "2vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "1vh",
  },
  image: {
    width: "13vh",
  },
  cardContent: {
    fontSize: "1.5vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    fontFamily: "Galmuri9",
    fontWeight: "700",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: "1vh",
    width: "80%",
    padding: "1vh",
    wordBreak: "keep-all",
  },
};

export default KnowledgeCard;
