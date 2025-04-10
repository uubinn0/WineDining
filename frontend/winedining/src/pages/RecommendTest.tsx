import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dialogue from "../components/Modal/RecommendDialogue";
import Homebackground from "../assets/images/background/Home.png";
import { sendPreferenceTest } from "../api/recommendtestApi";
import bartender from "../assets/icons/bartender.png";
import { setTestCompleted, setCurrentStep, setCameFromRecommendFlow } from "../store/slices/testSlice"; // 액션 import
import { vh } from "../utils/vh";
import { RootState } from "../store/store";
import { relative } from "path";
import { motion } from "framer-motion";
import BackButton from "../components/BackButton";

function RecommendTest() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nickname = useSelector((state: RootState) => state.auth.user?.nickname);

  const cameFromRecommendFlow = useSelector((state: RootState) => state.test.cameFromRecommendFlow); // 상태 가져오기
  // console.log("어디서옴?", cameFromRecommendFlow)
  const [currentStep, setCurrentStepLocal] = useState(0);

  const [responses, setResponses] = useState<string[]>([]);

  const [finalMessage, setFinalMessage] = useState<string | null>(null);

  const testCompleted = useSelector((state: RootState) => state.test.testCompleted);

  const dialogues = [
    { question: `취향테스트를 시작할게요. \n${nickname} 님의 취향을 알려주세요!`, options: [] },
    { question: "어떤 도수의 와인을 선호하시나요?", options: ["가볍게", "적당하게", "강하게"] },
    { question: "달콤함은 어느정도가 좋으신가요?", options: ["단 술은 싫어요", "적당히 달달하게", "단 술 최고!"] },
    {
      question: "와인을 마신 후, 입안에 남는 느낌은 어떠셨으면 좋겠나요?",
      options: ["매우 부드럽고 깔끔하게", "약간의 떫은 느낌이 있어 개성있게"],
    },
    {
      question: "와인의 상큼함, 입안에서 느껴지는 산뜻함은 어떤 게 좋으신가요?",
      options: ["부드럽게", "적당히 상큼하게", "톡 쏘게"],
    },
    {
      question: "와인을 마실 때 느끼고 싶은 무게감은 어느 정도인가요?",
      options: ["물처럼 가볍게", "중간 정도", "우유처럼 묵직하게"],
    },
    { question: "어떤 종류의 와인을 즐겨 드시나요?", options: ["레드", "로제", "화이트", "스파클링", "상관없음"] },
    { question: "취향을 기억할까요?", options: ["내 취향을 기억해줘!", "마음이 바꼈어. 잊어줘"] },
  ];

  useEffect(() => {
    if (currentStep === 0) {
      setTimeout(() => setCurrentStepLocal(1), 1500);
    }
  }, [currentStep]);


  const handleSelectOption = (selectedOption: string) => {
    const updatedResponses = [...responses, selectedOption];
    setResponses(updatedResponses);

    if (currentStep + 1 < dialogues.length) {
      setCurrentStepLocal(currentStep + 1);
    } else {
      if (selectedOption === "내 취향을 기억해줘!") {
        submitPreferences(updatedResponses);
      } else {
        setFinalMessage("알겠습니다! 다음에 다시 알려주세요!");

        if (cameFromRecommendFlow === "home") {
          navigate("/home"); // 홈에서 왔으면 홈으로
        } else if (cameFromRecommendFlow === "mypage") {
          navigate("/mypage"); // 마이페이지에서 왔으면 마이페이지로
        } else if (cameFromRecommendFlow === "recommend") {
          dispatch(setCurrentStep(6)); // **6번째 질문부터 시작**
          navigate("/recommendflow"); // recommendflow에서 왔으면 recommendflow로
        }
        // console.log("어디로 가니", cameFromRecommendFlow);
      }
    }
  };
  const submitPreferences = async (answers: string[]) => {
    const mapToNumber = (options: string[], answer: string) => options.indexOf(answer) + 1;
    const requestData = {
      alcoholContent: mapToNumber(dialogues[1].options, answers[0]),
      sweetness: mapToNumber(dialogues[2].options, answers[1]),
      tannin: mapToNumber(dialogues[3].options, answers[2]),
      acidity: mapToNumber(dialogues[4].options, answers[3]),
      body: mapToNumber(dialogues[5].options, answers[4]),
      preferredTypes: answers[5],
    };


    const response = await sendPreferenceTest(requestData);
    if (response.success) {
      dispatch(setTestCompleted(true)); // **테스트 완료 표시**

      if (cameFromRecommendFlow === "home") {
        navigate("/home"); // 홈에서 왔으면 홈으로
      } else if (cameFromRecommendFlow === "mypage") {
        navigate("/mypage"); // 마이페이지에서 왔으면 마이페이지로
      } else if (cameFromRecommendFlow === "recommend") {
        dispatch(setCurrentStep(6)); // **6번째 질문부터 시작**
        navigate("/recommendflow"); // recommendflow에서 왔으면 recommendflow로
      }
      // console.log("어디로 가니", cameFromRecommendFlow);
    } else {
      alert("취향테스트 실패");
      // dispatch(setTestCompleted(true)); // **테스트 완료 표시**
      navigate("/home"); // api 연결후 삭제 예정
      // console.error("API 호출 실패:", response.message);
    }
  };

  return (
    <motion.div
      style={styles.container}
    >
      <div style={styles.BackButton}>
      <BackButton onClick={()=> {navigate("/home"); dispatch(setCurrentStep(0));
} }/>      </div>
      <img src={bartender} alt="바텐더" style={styles.bartenderStyle} />
      <div style={styles.speechBubbleContainer}>
        <Dialogue
          question={finalMessage || dialogues[currentStep].question}
          options={finalMessage ? [] : dialogues[currentStep].options}
          onSelect={handleSelectOption}
        />
      </div>
    </motion.div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: `url(${Homebackground})`,
    backgroundSize: "contain",
    width: "100%",
    height: "100dvh",
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
    // paddingLeft : "5%",
    // width : "90%",
  },
  BackButton : {
    position : "fixed",
    paddingLeft : "2vh",
    zIndex : 99999
  }
};
export default RecommendTest;
