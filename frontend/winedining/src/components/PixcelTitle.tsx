import React from "react";

interface PixelTitleProps {
  text: string;
  imageSrc?: string;
  fontSize?: string;
  color?: string;
  margin?: string;
  imageSize?: string;
}

const PixelTitle: React.FC<PixelTitleProps> = ({
  text,
  imageSrc = "/sample_image/yellow_lightning.png",
  fontSize = "15px",
  color = "#ffffff",
  margin = "50px 0 20px 0",
  imageSize = "20px",
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
