import { useNavigate } from "react-router-dom";
import { vh } from "../utils/vh";


function DicLoading() {
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    // 동영상이 끝났을 때 메인 페이지로 이동
    navigate("/dictionary");
  };

  return (
    <div style={styles.container} onClick={() => {navigate("/dictionary")}}>
      <video autoPlay playsInline muted onEnded={handleVideoEnd} style={styles.video}>
        <source src="/videos/bookvideos.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor : "black",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "calc(100 * var(--custom-vh))",
    position: "relative",
    display : "flex",
    justifyContent : "center",
    alignItems:"center",
  },
  video: {
    width : "100%",
  }
};

export default DicLoading;
