import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import MBTIBackground from "../assets/images/background/wineMbti.png";
import questions from "../data/MBTIQuestion";
import speechbubble from "../assets/icons/speechbubble.png";
import { vh } from "../utils/vh";



const MBTITest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  // const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, F: 0, T: 0, P: 0, J: 0 });
  const [scores, setScores] = useState<{ E: number; I: number; S: number; N: number; F: number; T: number; P: number; J: number }>({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    F: 0,
    T: 0,
    P: 0,
    J: 0,
  });

  useEffect(() => {
    // 진행률 계산
    setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
  }, [currentQuestionIndex]);


  // const handleOptionSelect = (option: string) => {
  //   setSelectedOption(option);

    const handleOptionSelect = (option: { option: string; personality: string }) => {
      setSelectedOption(option.option);
  
      // 성격 유형 점수 증가 함수
      const updateScores = (personality: keyof typeof scores) => {
        const newScores = { ...scores };
        // 선택된 personality 키에 해당하는 점수를 증가
        if (newScores[personality] !== undefined) {
          newScores[personality] += 1;
        }
        console.log(newScores)

        setScores(newScores);
      };
  
      // 선택된 옵션의 personality 값을 받아서 점수 업데이트
      updateScores(option.personality as keyof typeof scores);


    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // 마지막 질문에 도달하면 결과 페이지로 이동
        navigate("/MBTIresults", { state: scores });
      }
    }, 100); // 선택 후 약간의 딜레이 후 다음 질문으로 이동
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
              onClick={() => handleOptionSelect(option)} // 옵션 텍스트 선택
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
    position : "relative",
    padding : vh(1.5)

  },
  chatItself : {
    position : "absolute",
    bottom : vh(13),
    // width : "100vw",
    display : "flex",
    justifyContent : "center",
  },
  chatContainer: {
    backgroundColor: "#21101B",
    // borderRadius: "8px",
    border : "solid 5px #D6BA91",
    padding: "20px",
    borderRadius: "10px",
    width: vh(37.5),
  },
  questionContainer: {
    // marginBottom: "20px",
  },
  questionText: {
    fontSize: "18px",
    lineHeight: "1.5",
    // wordWrap : "break-word",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",  // 옵션 간 간격을 줌
  },
  optionButton: {
    backgroundColor: "transparent",
    color: "white",
    padding: vh(1),
    fontFamily : "Galmuri9",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    // wordWrap : "break-word",
  },
  progressContainer: {
    position: "absolute",
    bottom: vh(3.5),
    left: vh(2),
    // right: vh(4),
    width: vh(41),
    textAlign: "right",
  },
  progressBar: {
    // width: vh(35),
    height: vh(1.3),
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
    // position : "absolute",

    // marginTop: "5px",
    fontSize: vh(1.5),
    
  },
  speechBubbleContainer: {
    backgroundImage: `url(${speechbubble})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height :vh(25),
    width : vh(45),
    color : "black",
    fontFamily : "Galmuri7",
    fontSize : vh(2.3)
  },
};

export default MBTITest;
