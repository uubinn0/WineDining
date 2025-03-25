import React from "react";

interface KnowledgeCardProps {
  image: string;
  title: string;
  isColor: boolean;
  onClick: () => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ image, title, isColor, onClick }) => {
  return (
    <div style={styles.card} onClick={onClick}>
      <img
        src={image}
        alt={title}
        style={{
          ...styles.image,
          filter: isColor ? "none" : "grayscale(100%)", // 컬러/흑백 처리
        }}
      />
      <div style={styles.cardContent}>
        <h3>{title}</h3>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "130px",
    height: "170px",
    margin: "10px",
    borderRadius: "8px",
    backgroundColor: "#21101B",
    border : "solid 5px #D6BA91",
    cursor: "pointer",
    padding : "10px",
    display : "flex",
    flexDirection: "column",
    justifyContent : "center",
    alignItems : "center"
  },
  image: {
    width: "80%",
  },
  cardContent: {
    fontSize : "10px",
    display : "flex",
    flexDirection : "column",
    justifyContent : "center",
    textAlign: "center",
    backgroundColor : "white",
    borderRadius : "4px",
    width: "122px",
    height: "28px",
    wordBreak : "keep-all",
  },
};

export default KnowledgeCard;
