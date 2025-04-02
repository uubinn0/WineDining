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

  useEffect(() => {
    dispatch(fetchInfos());
  }, [dispatch]);

  const handleCardClick = async (knowledge: InfoItem) => {
    await dispatch(fetchInfoDetailThunk(knowledge.id));
    setIsModalOpen(true);
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
      content: "아직 비밀입니다...두둥둥",
    }),
  ];

  return (
    <div style={styles.container}>
      <div style={styles.cardContainer}>
        {cardsToDisplay.map((knowledge, index) => (
          <KnowledgeCard
            key={index}
            image={knowledge.image}
            title={knowledge.title}
            isColor={knowledge.title !== "???"}
            onClick={() => {
              if (knowledge.title !== "???") {
                handleCardClick(knowledge);
              }
            }}
          />
        ))}
      </div>

      {/* 클릭된 카드에 대한 정보 모달 */}
      {isModalOpen && selectedInfo && (
        <KnowledgeDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    // alignItems : "center",
    // height : "100%"
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 2개의 컬럼으로 설정
    justifyContent: "center",
  },
};

export default KnowledgeList;
