import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import MBTIBackground from "../assets/images/background/wineMbti.png";
import questions from "../data/MBTIQuestion";
import speechbubble from "../assets/icons/speechbubble.png";



const MBTITest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    // 진행률 계산
    setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
  }, [currentQuestionIndex]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // 마지막 질문에 도달하면 결과 페이지로 이동
        navigate("/MBTIresults");
      }
    }, 500); // 선택 후 약간의 딜레이 후 다음 질문으로 이동
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={styles.container}>
      <BackButton  onClick={() => navigate("/")}/>
        <div style={styles.speechBubbleContainer}>
          당신은 어떤 와인인가요?
        </div>
        <div style={styles.chatItself}>
      <div style={styles.chatContainer}>
        <div style={styles.questionContainer}>
          <p style={styles.questionText}>Q. {currentQuestion.question}</p>
        </div>

        <div style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              style={styles.optionButton}
              onClick={() => handleOptionSelect(option.option)} // 옵션 텍스트 선택
            >
              {option.option}
            </button>
          ))}
        </div>
      </div>

        </div>

      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          ></div>
        </div>
        <p style={styles.progressText}>{currentQuestionIndex + 1} / {questions.length}</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: `url(${MBTIBackground})`,
    backgroundSize: "contain",
    backgroundRepeat : "no-repeat",
    width: "100vw",
    height: "100vh",
    color: "white",

  },
  chatItself : {
    position : "absolute",
    bottom : "100px",
    display : "flex",
    justifyContent : "center",
  },
  chatContainer: {
    backgroundColor: "#21101B",
    // borderRadius: "8px",
    border : "solid 5px #D6BA91",
    padding: "20px",
    borderRadius: "10px",
    width: "80%",
  },
  questionContainer: {
    marginBottom: "20px",
  },
  questionText: {
    fontSize: "18px",
    lineHeight: "1.5",
    wordWrap : "break-word",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",  // 옵션 간 간격을 줌
  },
  optionButton: {
    backgroundColor: "transparent",
    color: "white",
    padding: "10px 20px",
    fontFamily : "Galmuri9",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  progressContainer: {
    position: "absolute",
    bottom: "10px",
    left: "10%",
    right: "10%",
    width: "80%",
    textAlign: "right",
  },
  progressBar: {
    width: "100%",
    height: "10px",
    // backgroundColor: "#ddd",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#C9C0CA",
    transition: "width 0.5s ease",
  },
  progressText: {
    marginTop: "5px",
    fontSize: "14px",
  },
  speechBubbleContainer: {
    backgroundImage: `url(${speechbubble})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height :"220px",
    width : "100%",
    color : "black",
    fontFamily : "Galmuri7",
    fontSize : "20px"
  },
};

export default MBTITest;
