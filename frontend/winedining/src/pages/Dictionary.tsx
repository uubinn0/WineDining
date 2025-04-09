import { useNavigate } from "react-router-dom";
import DictionaryBackground from "../assets/images/background/Dictionary.png";
import DictionaryList from "../components/DictionaryList";
import BackButton from "../components/BackButton"; // BackButton 컴포넌트 임포트
import { motion } from "framer-motion";

function Dictionary() {
  const navigate = useNavigate();

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >

      <button style={styles.button} onClick={() => navigate("/home")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="2.5vh" height="2.5vh" viewBox="0 0 8 14" fill="none">
          <path d="M8 2L3 7L8 12L7 14L0 7L7 0L8 2Z" fill="#C1C1C1" />
        </svg>
      </button>
      <div style={styles.content}>

      <div style={styles.headertext}>
        <img src={"/sample_image/yellow_lightning.png"} alt={"번개 이미지"} style={styles.image} />
        WINE DICTIONARY
        <img src={"/sample_image/yellow_lightning.png"} alt={"번개 이미지"} style={styles.image} />
      </div>
      <DictionaryList />

              
      </div>
    </motion.div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    position: "fixed",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "3vh",
    top: "0",
    zIndex: 99,
  },
  content :{
    height: "100%",
    position : "relative",
    zIndex : 1,
  },
  container: {
    backgroundImage: `url(${DictionaryBackground})`,
    backgroundSize: "cover",
    width: "100%",
    height: "100dvh",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
  },
  headertext: {
    fontFamily: "PressStart2P",
    fontSize: "2vh",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2vh", // 번개 이미지와 간격 조정
    textAlign: "center",
    marginTop: "6dvh",
    position: "sticky",
    // zIndex: 2,
  },
  image: {
    width: "2vh",
    height: "3vh",
  },
};

export default Dictionary;

export {};
