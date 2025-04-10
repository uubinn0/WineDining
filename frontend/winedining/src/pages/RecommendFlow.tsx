import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dialogue from "../components/Modal/RecommendDialogue";
import RecommendationResult from "../components/Modal/RecommendationResult";
import Homebackground from "../assets/images/background/Home.png";
import bartender from "../assets/icons/bartender.png";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep, resetTestState } from "../store/slices/testSlice";
import { vh } from "../utils/vh";
import { AppDispatch, RootState } from "../store/store"; // store 경로에 맞게 수정
import { fetchUserProfile } from "../store/slices/authSlice";
import { setCameFromRecommendFlow } from "../store/slices/testSlice";
import { getWineRecommendations } from "../api/recommendResultApi";
import { WineRecommendation } from "../types/wine";
import { motion } from "framer-motion";
import BackButton from "../components/BackButton";

const RecommendFlow: React.FC = () => {
  const navigate = useNavigate();
  const testState = useSelector((state: any) => state.test); // Redux에서 상태 가져오기
  const dispatch = useDispatch<AppDispatch>();

  const { user, status } = useSelector((state: RootState) => state.auth);
  const username = user?.nickname ?? "소믈리에";
  const [wineRecommendations, setWineRecommendations] = useState<WineRecommendation[]>([]); // 와인 추천 리스트 상태

  const goToRecommendTest = () => {
    dispatch(setCameFromRecommendFlow("recommend")); // recommendflow에서 넘어갔음을 설정
    navigate("/recommendtest");
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, status]);

  const currentStep = useSelector((state: RootState) => state.test.currentStep);
  const [userFoodInput, setUserFoodInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);

  const dialogues = [
    { question: `안녕하세요, ${username}님. \n와인 한 잔의 여유를 즐겨볼까요?`, options: [] },
    { question: "오늘의 와인을 추천해드릴까요?", options: ["예", "아니오"] },
    { question: "알겠습니다. \n추천을 원하시면, 저를 다시 불러주세요!", options: [] }, // '아니오' 선택 시 종료
    { question: `좋아요! \n${username}님께 Fit한 와인을 찾아드릴게요.`, options: [] },
    { question: `기존에 알려주신 취향이 바뀌었다면 \n저에게 알려주시겠어요?`, options: [] },
    { question: `저에게 알려주시겠어요?`, options: ["새로 취향테스트 하기", "기존 취향으로 추천 받기"] },
    { question: "알겠습니다! \n오늘의 와인은 어떤 걸 함께 드시나요?", input: true }, // 음식 입력받는 단계
    { question: "완벽하네요🍷 \n추천 와인을 찾는 중이에요!", options: [] },
    { question: "이런 와인은 어떠신가요?", options: ["추천 리스트 보기"] },
  ];

  useEffect(() => {
    // console.log("지금 몇단계?", currentStep)
    if (currentStep === 0) {
      setTimeout(() => dispatch(setCurrentStep(1)), 2000);
    } else if (currentStep === 2) {
      setTimeout(() => {
        navigate("/home");
        dispatch(setCurrentStep(0));
      }, 2000);
    } else if (currentStep === 3) {
      setTimeout(() => dispatch(setCurrentStep(4)), 2000);
    } else if (currentStep === 4) {
      setTimeout(() => dispatch(setCurrentStep(5)), 2000);
    } else if (currentStep === 7) {
      setTimeout(() => dispatch(setCurrentStep(8)), 2000);
    }
  }, [currentStep, dispatch, navigate]);

  const handleSelectOption = (selectedOption: string) => {
    if (currentStep === 1 && selectedOption === "아니오") {
      dispatch(setCurrentStep(2));

      // setCurrentStepState(2);
      return;
    }

    if (currentStep === 1 && selectedOption === "예") {
      // setCurrentStepState(3);
      dispatch(setCurrentStep(3));
      return;
    }

    if (currentStep === 5 && selectedOption === "새로 취향테스트 하기") {
      goToRecommendTest();
      return;
    }

    if (currentStep + 1 < dialogues.length) {
      // setCurrentStepState(currentStep + 1);
      dispatch(setCurrentStep(currentStep + 1));
    } else if (selectedOption === "추천 리스트 보기") {
      setShowModal(true); // 추천 리스트 모달 표시
    }
  };

  const handleInputSubmit = async () => {
    const pairingValue = userFoodInput ? userFoodInput : ""; // userFoodInput이 null이면 빈 문자열로 설정

    // console.log("pairing 값:", pairingValue); // 디버깅을 위한 로그

    // `input` 답변 저장
    const updatedResponses = [...responses, pairingValue];
    setResponses(updatedResponses);

    try {
      const response = await getWineRecommendations({ pairing: pairingValue });

      if (response.success) {
        setWineRecommendations(response.data);
      } else {
      }
      // `input`을 입력한 후, 다음 질문으로 이동
      dispatch(setCurrentStep(currentStep + 1));
      setUserFoodInput(""); // 입력창 초기화
    } catch (error) {
      console.log("api 호출 중 오류 발생: ", error);
    }
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.BackButton}>
        <BackButton onClick={()=> {navigate("/home"); dispatch(setCurrentStep(0));
} }/>
      </div>
      <img src={bartender} alt="바텐더" style={styles.bartenderStyle} />

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

      {showModal && (
        <RecommendationResult
          wines={wineRecommendations}
          onClose={() => {
            setShowModal(false);
            navigate("/home");
            dispatch(setCurrentStep(0));
          }}
        />
      )}
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    // backgroundImage: `url(${Homebackground})`,
    // backgroundSize: "contain",
    // width: "100%",
    // height: "calc(100 * var(--custom-vh))",
    // position: "relative",
    backgroundImage: `url(${Homebackground})`,
    backgroundSize: "contain",
    width: "100vw",
    maxWidth: "430px", // 디자인 한계 지정 (선택)
    maxHeight: "100vh",
    height: "calc(100 * var(--custom-vh))",
    margin: "0 auto",
    position: "relative",
  },
  bartenderStyle: {
    position: "absolute",
    top: "54%", // top 비율
    left: "40%", // left 비율
    height: vh(30.6), // height 비율
    transform: "rotate(0.69deg)", // 회전 적용
  },
  speechBubbleContainer: {
    paddingTop: "25dvh",
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
  BackButton : {
    position : "fixed",
    paddingLeft : "2vh",
    zIndex : 99999
  }
};

export default RecommendFlow;
