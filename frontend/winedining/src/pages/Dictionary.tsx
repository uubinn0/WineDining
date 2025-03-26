import { useNavigate } from "react-router-dom";
import DictionaryBackground from "../assets/images/background/Dictionary.png"
import DictionaryList from "../components/DictionaryList"
import BackButton from "../components/BackButton"; // BackButton 컴포넌트 임포트

function Dictionary() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <BackButton onClick={() => navigate("/home")}/>
      {/* <button onClick={() => navigate("/home")}>뒤로가기</button> */}
      <h1 style={styles.headertext}>
        <img src={"/sample_image/yellow_lightning.png"} alt={"번개 이미지"} style={styles.image} />
        WINE DICTIONARY<img src={"/sample_image/yellow_lightning.png"} alt={"번개 이미지"} style={styles.image} />
      </h1>
      <DictionaryList/> 
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: `url(${DictionaryBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "calc(100 * var(--custom-vh))",
  },
  headertext: {
    fontFamily: "PressStart2P",
    fontSize: "16px",
    color: "white",
    display: "flex",
    alignItems: "center", // ✅ 고친 부분
    justifyContent: "center",
    gap: "10px", // 번개 이미지와 간격 조정
    textAlign: "center",
    marginTop: "16px",
  },
  grid: {
    // display: "grid",
    // gridTemplateColumns: "repeat(2, 1fr)",
    // gap: "12px",
    // justifyContent: "center",
    // padding: "10px",
  },
  image: {
    width: "18px",
    height: "20px",
  },
};

export default Dictionary;

export {};
