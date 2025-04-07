import React from "react";

interface PixelTitleProps {
  text: string;
  imageSrc?: string;
  fontSize?: string;
  color?: string;
  padding?: string; // margin → padding 으로 변경
  imageSize?: string;
  margin?: string;
}

const PixelTitle: React.FC<PixelTitleProps> = ({
  text,
  imageSrc = "/sample_image/yellow_lightning.png",
  fontSize = "15px",
  color = "#ffffff",
  padding = "16px 0 20px", // 기본값 설정
  imageSize = "20px",
  margin = "0px",
}) => {
  return (
    <h1
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'PressStart2P'",
        fontSize,
        color,
        padding, // 패딩 prop 반영
        margin,
        gap: "10px",
        whiteSpace: "nowrap",
      }}
    >
      <img src={imageSrc} alt="icon" style={{ width: imageSize, height: imageSize }} />
      {text}
      <img src={imageSrc} alt="icon" style={{ width: imageSize, height: imageSize }} />
    </h1>
  );
};

export default PixelTitle;
