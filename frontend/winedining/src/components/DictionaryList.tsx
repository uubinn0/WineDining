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
    

  const handleCardClick = async (knowledge: InfoItem) => {
    if (knowledge.title === "???") {
      // "???" 카드를 클릭했을 때, 레벨 부족 메시지 설정
      dispatch({
        type: 'info/setSelectedInfo', // selectedInfo 설정하는 액션
        payload: {
          id: -1,
          title: "미공개 정보",
          image: DeactiveBook,
          content: "5월 1일 공개 예정",
        }
      });
      setIsModalOpen(true); // 모달 열기
    } else {
      // 기존 정보 클릭 시, 와인 상세 정보 가져오기
      await dispatch(fetchInfoDetailThunk(knowledge.id));
      setIsModalOpen(true); // 모달 열기
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
      content: "",
    }),
  ];

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
<div style={styles.gridScrollWrapper}>
  


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


      {/* 클릭된 카드에 대한 정보 모달 */}
      {isModalOpen && selectedInfo && (
        <KnowledgeDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
    
    </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    height : "85%",
    paddingBottom : "3vh",
  },
  cardContainer: {
    padding : "2vh",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 2개의 컬럼으로 설정
    gap : "2vh",
  },
  messageContainer: {
    paddingTop : "50%",
    textAlign: "center",
  },
  message: {
    fontSize: "2.5vh",
    color: "white", // 메시지 색상
    fontFamily: "Galmuri9",
  },
  gridScrollWrapper: {
    height: "100%", // 카드 영역의 스크롤 한계 높이
    overflowY: "auto",
    paddingBottom : "5vh",
    WebkitOverflowScrolling: "touch", // iOS 부드러운 스크롤
  },
};

export default KnowledgeList;
