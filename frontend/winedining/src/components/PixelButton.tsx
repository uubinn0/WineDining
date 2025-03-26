import React from "react";

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    fontFamily: "'Press Start 2P', sans-serif",
    boxShadow: "12px 12px 0px 0px #000000",
    cursor: "pointer",
    border: "none",
  },
};

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  width?: string;
  height?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  className?: string;
  fontFamily?: string;
}

const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  width = "290px",
  height = "58px",
  backgroundColor = "#ffffff",
  textColor = "#000000",
  fontSize = "18px",
  className = "",
  fontFamily = "PressStart2P",
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.button,
        width,
        height,
        backgroundColor,
        color: textColor,
        fontSize,
        fontFamily,
      }}
      className={className}
    >
      {children}
    </button>
  );
};

export default PixelButton;
