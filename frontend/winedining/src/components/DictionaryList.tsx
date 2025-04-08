import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchInfoDetailThunk, fetchInfos } from "../store/slices/infoSlice";
import { InfoItem } from "../types/info";
import KnowledgeCard from "./KnowledgeCard";
import KnowledgeDetailModal from "./KnowledgeDetailModal";
import ActiveBook from "../assets/images/modal/bookactive.png";
import DeactiveBook from "../assets/images/modal/bookdeactive.png";

const KnowledgeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { infos, selectedInfo, loading } = useSelector((state: RootState) => state.info);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);


  useEffect(() => {
    dispatch(fetchInfos());
    }, [dispatch]);

  // const handleCardClick = async (knowledge: InfoItem) => {
  //   await dispatch(fetchInfoDetailThunk(knowledge.id));
  //   setIsModalOpen(true);
  // };


  const handleCardClick = async (knowledge: InfoItem) => {
    if (knowledge.title === "???") {
      // 레벨 부족 메시지를 selectedInfo에 설정
      dispatch({
        type: 'info/setSelectedInfo', // selectedInfo 설정하는 액션
        payload: {
          title: "레벨이 부족합니다!",
          content: "아직 레벨이 부족하군요. \n와인기록을 통해 레벨을 올려오세요.",
        }
      });
      setIsModalOpen(true);
    } else {
      await dispatch(fetchInfoDetailThunk(knowledge.id));
      setIsModalOpen(true);
    }
  };


  const totalCards = 6;
  const cardsToDisplay = [
    ...infos.map((info) => ({
      id: info.id,
      title: info.title,
      image: ActiveBook,
      content: "",
    })),
    ...Array(totalCards - infos.length).fill({
      id: -1,
      title: "???",
      image: DeactiveBook,
      content: "아직 레벨이 부족하군요. \n와인기록을 통해 레벨을 올려오세요.",
    }),
  ];

  return (
    <div style={styles.container}>
      {/* 조건문 수정: user.rank가 "초보자"일 경우 메시지 표시 */}
      {user?.rank === "초보자" ? (
        <div style={styles.messageContainer}>
          <div style={styles.message}>
            초보자인 당신은 <br /> 아직 접근이 불가합니다. <br /> 기록을 쌓아 다시오세요.
          </div>
        </div>
      ) : (
        <div style={styles.cardContainer}>
          {cardsToDisplay.map((knowledge, index) => (
            <KnowledgeCard
              key={index}
              image={knowledge.image}
              title={knowledge.title}
              isColor={knowledge.title !== "???"}
              onClick={() => handleCardClick(knowledge)}
            />
          ))}
        </div>
      )}

      {/* 클릭된 카드에 대한 정보 모달 */}
      {isModalOpen && selectedInfo && (
        <KnowledgeDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    // alignItems : "center",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 2개의 컬럼으로 설정
    justifyContent: "center",
  },
  messageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "100vh",
  },
  message: {
    fontSize: "2.5vh",
    
    color: "white", // 메시지 색상
    fontFamily: "Galmuri9",
  },
};

export default KnowledgeList;
