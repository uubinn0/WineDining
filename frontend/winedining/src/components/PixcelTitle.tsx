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
  fontSize = "1.875vh",
  color = "#ffffff",
  padding = "2.1vh 0 5vh",
  imageSize = "2.5vh",
  margin = "0vh",
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
        gap: "1.25vh", // 10px → 10/8 = 1.25vh
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
