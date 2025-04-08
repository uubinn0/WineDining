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
      <div style={styles.headertext}>
        <img src={"/sample_image/yellow_lightning.png"} alt={"번개 이미지"} style={styles.image} />
        WINE DICTIONARY<img src={"/sample_image/yellow_lightning.png"} alt={"번개 이미지"} style={styles.image} />
      </div>
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
    height: "100%",
    display : "flex",
    flexDirection : "column",
    justifyContent : "center"
    
  },
  headertext: {
    fontFamily: "PressStart2P",
    fontSize: "1.8vh",
    color: "white",
    display: "flex",
    alignItems: "center", // ✅ 고친 부분
    justifyContent: "center",
    gap: "3vh", // 번개 이미지와 간격 조정
    textAlign: "center",
    marginTop : "10dvh"
  },

  image: {
    width: "2vh",
    height: "3vh",
  },
};

export default Dictionary;

export {};
