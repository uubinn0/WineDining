import React from "react";
import speechbubble from "../../assets/icons/speechbubble.png";
import { vh } from "../../utils/vh";

interface DialogueProps {
  question: string;
  options?: string[];
  input?: string;
  onInputChange?: (value: string) => void;
  onSelect: (selectedOption: string) => void;
  onSubmit?: () => void; // onSubmit prop 추가
}

const RecommendDialogue: React.FC<DialogueProps> = ({
  question,
  options = [],
  input,
  onInputChange,
  onSelect,
  onSubmit,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit?.(); // onSubmit이 정의되어 있으면 호출
    }
  };

  return (
    <div style={styles.container}>
      <img src={speechbubble} alt="대화창" style={styles.speechBubbleContainer} />
      <div style={styles.speechBubble}>
        <div style={styles.question}>{question}</div>

        {input !== undefined && onInputChange && (
          <div style={styles.foodInputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
              placeholder="ex. 스테이크, 치즈, 해산물"
            />
            <button style={styles.submitButton} onClick={onSubmit}>다음</button>
          </div>
        )}

        <div style={styles.optionList}>
          {options.map((option, idx) => (
            <li key={idx} style={styles.optionItem}>
              <button style={styles.optionButton} onClick={() => onSelect(option)}>
                ▶ {option}
              </button>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container : {
    position : "relative",
    width : "100%",
    minHeight : "200px",
    height : "25vh",
    display : "flex",
    justifyContent : "center",
  },
  speechBubbleContainer: {
    position : "absolute",
    width : "100%",
    minHeight : "200px",
    height : "25vh",
    zIndex : 0,
  },
  speechBubble: {
    position : "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems : "stretch",
    gap : vh(1),
    width : "85%",
    maxWidth : "500px",

    zIndex : 1,
    transform: "translate(-50%, -50%)", // 중앙 정렬을 위한 transform
    top: "35%",
    left: "45%", // 부모(container)의 중앙에 위치하도록 설정
    margin : "20px",
    marginLeft : "5%",
  },
  optionList: {
    listStyle: "none",
    width : "100%",
    display : "flex",
    flexWrap : "wrap",
    flexDirection : "row",
    justifyContent : "start",
    gap : "5px",
    

  },
  
  optionItem: {
    marginBottom: "2px",
    whiteSpace: "wrap", // 버튼 내 텍스트가 자동으로 줄바꿈 되도록 설정
    wordWrap: "break-word", // 긴 단어가 잘리거나 줄바꿈이 되도록 설정 
    
  },
  optionButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: "inherit",
    whiteSpace: "wrap", // 버튼 내 텍스트가 자동으로 줄바꿈 되도록 설정
    wordBreak: "normal",
    // wordWrap: "break-word", // 긴 단어가 잘리거나 줄바꿈이 되도록 설정    
    textAlign : "start",
  },
  question: {
    whiteSpace: "pre-line",
    wordWrap : "break-word", // 줄바꿈을 처리하도록 설정
    lineHeight: "1.8", // 줄 간격을 넓게 설정
  },
  input: {
    borderRadius: "5px",
    border: "1px solid #cccccc",
    textAlign: "center",
    width: "100%",
    fontFamily:"inherit",
    fontSize : "12px",
  },
  foodInputContainer : {
    display:"flex",
    justifyContent: "center",
    gap : "1vh",

  },
  submitButton : {
    background: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "inherit",
    textWrap : "nowrap"
  }
};

export default RecommendDialogue;
