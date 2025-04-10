import React from "react";

interface BackButtonProps {
  onClick: () => void; // 버튼 클릭 시 실행할 함수
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button style={styles.button} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 8 14" fill="none">
        <path d="M8 2L3 7L8 12L7 14L0 7L7 0L8 2Z" fill="#C1C1C1" />
      </svg>
    </button>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    position: "fixed",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "2.5vh 2.5vh",
    top: "1.875vh",
    marginLeft: "-2vh",
    zIndex: 99,
  },
};

export default BackButton;
