import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import closeButton from "../assets/icons/closebutton.png";
import MarkdownRenderer from "./MarkdownRenderer";
import { motion } from "framer-motion";
import { vh } from "../utils/vh";

interface KnowledgeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KnowledgeDetailModal: React.FC<KnowledgeDetailModalProps> = ({ isOpen, onClose }) => {
  const { selectedInfo } = useSelector((state: RootState) => state.info);

  if (!isOpen || !selectedInfo) return null;

  return (
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
          <img src={closeButton} alt="Close" style={styles.closeIcon} /> {/* 이미지 버튼 */}
        </button>
        <MarkdownRenderer markdownContent={selectedInfo.title} customStyle={styles.title} />
        <MarkdownRenderer markdownContent={selectedInfo.content} customStyle={styles.content} />
      </div>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100dvh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,

  },
  modal: {
    backgroundColor: "#21101B",
    border: "solid 0.8vh #D6BA91",
    padding: "2vh",
    paddingTop: "1vh",
    borderRadius: "1.3vh",
    width: "90dvw",
    maxWidth : "400px",
    color: "white",
    position: "relative",
    height: "90dvh",
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    boxSizing: "border-box",
    transition: "transform 0.5s ease",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
  },
  closeButton: {
    position: "absolute",
    top: "2vh",
    right: "2vh",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "3vh",
    cursor: "pointer",
  },
  closeIcon: {
    width: "5vh", // 아이콘 크기 조정
    height: "5vh", // 아이콘 크기 조정
  },
  title: {
    fontSize: "3vh",
    color: "#FFF7F7",
    textAlign: "center",
    // WebkitTextStroke: "1px #6A3512",
    textShadow: "1px 1px 0 #6A3512, -1px -1px 0 #6A3512, 1px -1px 0 #6A3512, -1px 1px 0 #6A3512",
    fontFamily: "Galmuri7",
    fontStyle: "normal",
    fontWeight: "400",
  },
  content: {
    textAlign: "start",
    color: "white",
    fontSize: "2vh",
    fontFamily: "Galmuri9",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "170%",
  },
};

export default KnowledgeDetailModal;
