import { useNavigate } from "react-router-dom";

function DicLoading() {
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    // 동영상이 끝났을 때 메인 페이지로 이동
    navigate("/dictionary");
  };

  return (
    <div style={styles.container}>
      <video autoPlay muted onEnded={handleVideoEnd} style={styles.video}>
        <source src="/videos/bookvideos.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor : "black",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh",
    display : "flex",
    justifyContent : "center",
    alignItems:"center",
  },
  video: {
    maxWidth : "100%",
    maxHeight : "100%"
    
  }
};

export default DicLoading;
