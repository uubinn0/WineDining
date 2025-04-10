import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import MBTIBackground from "../assets/images/background/wineMbti.png";
import questions from "../data/MBTIQuestion";
import speechbubble from "../assets/icons/speechbubble.png";
import { vh } from "../utils/vh";
import { trackEvent } from "../utils/analytics";
import { useLocation } from "react-router-dom"; // 추가

const MBTITest = () => {
  const location = useLocation();
  const from = location.state?.from;

  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  // const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, F: 0, T: 0, P: 0, J: 0 });
  const [scores, setScores] = useState<{
    E: number;
    I: number;
    S: number;
    N: number;
    F: number;
    T: number;
    P: number;
    J: number;
  }>({
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
      // console.log(newScores);

      setScores(newScores);
    };

    // 선택된 옵션의 personality 값을 받아서 점수 업데이트
    updateScores(option.personality as keyof typeof scores);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // 테스트 완료 이벤트 추적
        trackEvent("mbti_test_completed", { scores });
        // 마지막 질문에 도달하면 결과 페이지로 이동
        navigate("/MBTIresults", { state: { scores, from } });
      }
    }, 100); // 선택 후 약간의 딜레이 후 다음 질문으로 이동
  };

  const currentQuestion = questions[currentQuestionIndex];

  const [hoveredOption, setHoveredOption] = useState<number | null>(null); // 현재 호버된 옵션을 추적

  return (
    <div style={styles.container}>
      <BackButton onClick={() => navigate(from === "mypage" ? "/mypage" : "/")} />
      <div style={styles.mainContent}>
        {/* <div> */}
        <div style={styles.speechBubbleContainer}>
          <img src={speechbubble} style={styles.speechbubble} alt="" />
          <div style={styles.speechtext}>당신은 어떤 와인인가요?</div>
        </div>
        <div style={styles.chatItself}>
          <div style={styles.chatContainer}>
            <div style={styles.questionContainer}>
              <div style={styles.questionText}>Q. {currentQuestion.question}</div>
            </div>

            <div style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  // style={styles.optionButton}
                  style={{
                    ...styles.optionButton,
                    ...(hoveredOption === index ? styles.optionButtonHover : {}),
                  }}
                  onClick={() => handleOptionSelect(option)} // 옵션 텍스트 선택
                  onMouseEnter={() => setHoveredOption(index)} // 마우스가 올라간 버튼 인덱스 설정
                  onMouseLeave={() => setHoveredOption(null)} // 마우스가 벗어난 버튼 인덱스 초기화
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
          <div style={styles.progressText}>
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    color: "white",
    backgroundImage: `url(${MBTIBackground})`,
    backgroundSize: "contain",
    width: "100vw",
    maxWidth: "430px", // 디자인 한계 지정 (선택)
    maxHeight: "100vh",
    height: "calc(100 * var(--custom-vh))",
    margin: "0 auto",
    position: "relative",
    // display : "flex",
    // justifyContent : "center"
  },
  chatItself: {
    position: "absolute",
    bottom: vh(8),
    width: "100vw",
    maxWidth: "430px", // 디자인 한계 지정 (선택)
    // maxHeight: "100vh",
    // height: "calc(100 * var(--custom-vh))",
    display: "flex",
    justifyContent: "center",
  },
  chatContainer: {
    backgroundColor: "#21101B",
    border: "solid 5px #D6BA91",
    padding: vh(3),
    borderRadius: "10px",
    margin: vh(2),
  },
  questionContainer: {
    marginBottom: "20px",
  },
  questionText: {
    fontSize: vh(2.3),
    lineHeight: "1.5",
    // wordBreak : "keep-all"
  },
  optionsContainer: {},
  optionButton: {
    backgroundColor: "transparent",
    color: "white",
    padding: vh(1),
    fontFamily: "Galmuri9",
    fontSize: vh(2.2),
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    // wordBreak : "keep-all",
    textAlign: "start",
    transition: "transform 150ms cubic-bezier(0, 0, 0.58, 1), background-color 150ms cubic-bezier(0, 0, 0.58, 1)",
  },
  optionButtonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.20)",
    transform: "translateY(-0.2em)",
  },
  progressContainer: {
    position: "absolute",
    bottom: vh(3),
    width: "80%",
    textAlign: "right",
  },
  progressBar: {
    height: vh(1.3),
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressFill: {
    height: vh(1.3),
    backgroundColor: "#C9C0CA",
    transition: "width 0.5s ease",
    bottom: vh(3.5),
  },
  progressText: {
    fontSize: vh(1.5),
  },
  speechBubbleContainer: {
    position: "absolute", // ✅ 기준만 설정
    top: vh(7),
    width: "80%",
    height: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  speechbubble: {
    width: "100%",
    height: "auto",
  },

  speechtext: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)", // ✅ 정확한 중앙 배치
    textAlign: "center",
    color: "black",
    fontSize: vh(2.3),
    fontFamily: "Galmuri7",
    width: "100%",
  },
  mainContent: {
    display: "flex",
    justifyContent: "center",
  },
};

export default MBTITest;
