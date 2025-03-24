import React, { useState } from "react";
import { KNOWLEDGE } from "../mocks/knowledge"; // 목업 데이터 가져오기
import KnowledgeCard from "./KnowledgeCard";
import KnowledgeDetailModal from "./KnowledgeDetailModal";
import ActiveBook from "../assets/images/modal/bookactive.png"
import DeactiveBook from "../assets/images/modal/bookdeactive.png"


interface Knowledge {
  title: string;
  image: string;  // 이미지 URL
  content: string; // 내용 (모달에서 보여줄 내용)
}

const KnowledgeList: React.FC = () => {
  // KNOWLEDGE 데이터에서 title만 가져와서 knowledgeData에 저장
  const [knowledgeData, setKnowledgeData] = useState<Knowledge[]>(KNOWLEDGE.infos.map(info => ({
    title: info.title,
    image: ActiveBook,  // 기본 이미지 경로 (원하는 이미지로 교체 가능)
    content: "포트 와인은 주로 포르투갈의 도우로(Douro) 지역에서 생산되는 강화 와인입니다. \n포트 와인의 특징은 발효 중에 브랜디(증류주)를 추가하여 알코올 도수를 높이고 발효를 멈추기 때문에, 설탕이 남아 단맛이 강한 와인입니다. 이런 방식 덕분에 포트 와인은 오랫동안 숙성될 수 있습니다.\n주요 포트 와인 종류는 다음과 같습니다.\n레드 포트: 과일 향과 짙은 색감을 가지고 있으며, 보통 더 진하고 달콤합니다. \n화이트 포트: 레드 포트보다 가벼운 맛과 색상을 가지며, 드라이한 종류도 있습니다.\n틴트 포트: 오래된 레드 포트 와인을 의미하며, 깊고 복잡한 맛이 특징입니다. \n타우니 포트: 오랜 시간 동안 나무통에서 숙성된 포트 와인으로, 캐러멜, 견과류, 건포도 같은 맛이 나며, 일반적으로 부드럽고 깊은 맛을 가집니다.\n포트 와인은 디저트 와인으로 많이 즐기지만, 치즈, 견과류, 초콜릿과 함께 마시기도 좋습니다."  // 기본 내용 (추후 데이터에 맞게 수정)
  })));

  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null); // 클릭된 카드의 상세 데이터 저장
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 열기/닫기 상태

  const handleCardClick = (knowledge: Knowledge) => {
    setSelectedKnowledge(knowledge);
    setIsModalOpen(true);
  };


 // 기본 카드 채우기 로직: 데이터가 부족하면 default 카드로 채우기
 const totalCards = 6;  // 항상 6개의 카드
 const cardsToDisplay = [
   ...knowledgeData,  // 기존 카드 데이터
   ...Array(totalCards - knowledgeData.length).fill({
     title: "???",
     image: DeactiveBook,
     content: "아직 비밀입니다..두둥둥" // 기본 카드 내용
   })  // 부족한 카드만큼 기본 카드 추가
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
            onClick={() => handleCardClick(knowledge)}
          />
        ))}
      </div>

      {/* 클릭된 카드에 대한 정보 모달 */}
      {selectedKnowledge && (
        <KnowledgeDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          knowledge={selectedKnowledge}
        />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: "20px",
        textAlign: "center",
        display : "flex",
        justifyContent : "center",
        // alignItems : "center",
        // height : "100%"
      },
      cardContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",  // 2개의 컬럼으로 설정
        justifyContent: "center",
      },
};

export default KnowledgeList;
