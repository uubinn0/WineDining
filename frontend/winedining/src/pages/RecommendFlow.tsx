import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dialogue from "../components/Modal/RecommendDialogue";
import RecommendationResult from "../components/Modal/RecommendationResult";
import Homebackground from "../assets/images/background/Home.png"
import bartender from "../assets/icons/bartender.png"
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep, resetTestState } from "../store/slices/testSlice"
import { vh } from "../utils/vh";
import { AppDispatch, RootState } from "../store/store"; // store 경로에 맞게 수정
import { fetchUserProfile } from "../store/slices/authSlice";



const RecommendFlow: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const testState = useSelector((state: any) => state.test); // Redux에서 상태 가져오기
  const dispatch = useDispatch<AppDispatch>();

  const { user, status } = useSelector((state: RootState) => state.auth);
  const username = user?.nickname ?? "고객님";
  
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, status]);


  const [currentStep, setCurrentStepState] = React.useState(testState.currentStep);

  const [userFoodInput, setUserFoodInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);


  const dialogues = [
    { question: `안녕하세요, ${username}님. \n와인 한 잔의 여유를 즐겨볼까요?`, options: [] },
    { question: "오늘의 와인을 추천해드릴까요?", options: ["예", "아니오"] },
    { question: "알겠습니다. \n추천을 원하시면, 저를 다시 불러주세요!", options: [] }, // '아니오' 선택 시 종료
    { question: `좋아요! \n${username}님께 Fit한 와인을 찾아드릴게요.`, options: []  },
    { question: `기존에 알려주신 취향이 바뀌었다면 \n저에게 알려주시겠어요?`, options:[]},
    { question: `저에게 알려주시겠어요?`, options: ["새로 취향테스트 하기", "기존 취향으로 추천 받기"] },
    { question: "알겠습니다! \n오늘의 와인은 어떤 걸 함께 드시나요?", input: true }, // 음식 입력받는 단계
    { question: "완벽하네요🍷 \n추천 와인을 찾는 중이에요!", options: [] },
    { question: "이런 와인은 어떠신가요?", options: ["추천 리스트 보기"] },
  ];

  
  const wineRecommendations = [
    {
      name: "LA MARCA",
      description: "이 와인은 해산물과 어울리는 달달한 와인이에요. 배럴 향이 많이 나는 모제카입니다.",
      image: "/assets/images/wine1.png",
    },
    {
      name: "LA MARCA",
      description: "이 와인은 해산물과 어울리는 달달한 와인이에요. 배럴 향이 많이 나는 모제카입니다.",
      image: "/assets/images/wine2.png",
    },
    {
      name: "LA MARCA",
      description: "이 와인은 해산물과 어울리는 달달한 와인이에요. 배럴 향이 많이 나는 모제카입니다.",
      image: "/assets/images/wine3.png",
    },
  ];

  useEffect(() => {
    if (testState.testCompleted && currentStep === 0) {
      setCurrentStepState(6); // **6번째 질문부터 시작**
      dispatch(setCurrentStep(6)); // Redux에서 currentStep 업데이트
    }
  }, [testState.testCompleted, currentStep, dispatch]);


  useEffect(() => {
    if (currentStep === 0) {
      setTimeout(() => setCurrentStepState(1), 2000);
    } else if (currentStep === 2) {
      setTimeout(() => navigate("/home"), 2000);
    } else if (currentStep === 3) {
      setTimeout(() => setCurrentStepState(4), 1500);
    } else if (currentStep === 4) {
      setTimeout(() => setCurrentStepState(5), 1500);
    } else if (currentStep === 7) {
      setTimeout(() => setCurrentStepState(8), 1500);
    }
  }, [currentStep, navigate]);


  const handleSelectOption = (selectedOption: string) => {
    if (currentStep === 1 && selectedOption === "아니오") {
      setCurrentStepState(2);
      return;
    }

    if (currentStep === 1 && selectedOption === "예") {
      setCurrentStepState(3);
      return;
    }


    if (currentStep === 5 && selectedOption === "새로 취향테스트 하기") {
      navigate("/recommendtest");
      return;
    }

    if (currentStep + 1 < dialogues.length) {
      setCurrentStepState(currentStep + 1);
    } else if (selectedOption === "추천 리스트 보기") {
      setShowModal(true); // 추천 리스트 모달 표시
    }
  };


  const handleInputSubmit = () => {
    // `input` 답변 저장
    const updatedResponses = [...responses, userFoodInput];
    setResponses(updatedResponses);

    // `input`을 입력한 후, 다음 질문으로 이동
    setCurrentStepState(currentStep + 1);
    setUserFoodInput(""); // 입력창 초기화
  };

  const handleReturnToHome = () => {
    dispatch(resetTestState()); // **Redux 상태 초기화**
    setCurrentStepState(0); // currentStep을 0으로 리셋
    navigate("/home"); // 메인 화면으로 이동
    console.log(currentStep, testState)
  };


  return (
<div style={styles.container}>
<img src={bartender} alt="바텐더" style={styles.bartenderStyle}/>

    <div style={styles.speechBubbleContainer}>
      <Dialogue
        question={dialogues[currentStep].question}
        options={dialogues[currentStep].options ?? []}
        
        input={dialogues[currentStep].input ? userFoodInput : undefined} // ✅ input이 필요한 경우만 전달
        onInputChange={dialogues[currentStep].input ? setUserFoodInput : undefined} // ✅ input이 있을 때만 핸들러 전달
        onSelect={handleSelectOption}
        onSubmit={handleInputSubmit}
        />
      </div>
        
      {showModal && <RecommendationResult wines={wineRecommendations} onClose={() => {setShowModal(false); handleReturnToHome()}} />}    </div>
  );
};




const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: `url(${Homebackground})`,
    backgroundSize: "contain",
    width: "100%",
    height: "calc(100 * var(--custom-vh))",
    position: "relative",
  },
  bartenderStyle: {
    position: "absolute",
    top: vh(53.9), // top 비율
    left: vh(20), // left 비율
    // width: vw(54.2), // width 비율
    height: vh(30.6), // height 비율
    transform: "rotate(0.69deg)", // 회전 적용
  },
  speechBubbleContainer: {
    position: "absolute",
    top: vh(23.9),
    // width : vh(30)
  },
  nextButton: {
    // width: "25%", // 버튼의 너비 설정
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  
};

export default RecommendFlow;
