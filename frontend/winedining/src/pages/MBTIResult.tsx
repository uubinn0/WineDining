import { useNavigate } from "react-router-dom";

function MBTIResults() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
        <div>결과 페이지</div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor : "",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh",
    display : "flex",
    justifyContent : "center",
    alignItems:"center",
  },
};

export default MBTIResults;
