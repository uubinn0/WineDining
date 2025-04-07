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
  return (
    <div style={styles.speechBubbleContainer}>
      <div style={styles.speechBubble}>
        <div style={styles.question}>{question}</div>

        {input !== undefined && onInputChange && (
          <div style={styles.foodInputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
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
  speechBubbleContainer: {
    // backgroundImage: `url(${speechbubble})`,
    // backgroundPosition: "center",
    // backgroundRepeat: "no-repeat",
    // display: "flex",
    // alignItems: "center",
    // height :"40dvh",
  },
  speechBubble: {
    backgroundImage: `url(${speechbubble})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    boxSizing: "border-box",
    display: "flex",
    // alignItems : "center",
    gap : vh(2),
    justifyContent: "center",
    flexDirection: "column",
    width: "100dvw", 
    height : "30dvh"
  },
  optionList: {
    // textAlign: "left",
    listStyle: "none",
    display:"flex",
    // flexDirection: "column",
    flexWrap:"wrap",
    padding : 0,
    marginLeft : "5dvh",
    marginRight : "5dvh",
   
  },
  optionItem: {
    marginBottom: "2px",
  },
  optionButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: "inherit",



  },
  question: {
    whiteSpace: "pre-line", // 줄바꿈을 처리하도록 설정
    marginLeft : "5dvh",
    lineHeight: "1.8", // 줄 간격을 넓게 설정
  },
  input: {
    marginTop: "10px",
    padding : "5px",
    borderRadius: "5px",
    border: "1px solid #cccccc",
    textAlign: "center",
    width: "70%",
    fontFamily:"inherit",
    fontSize : "12px",
  },
  foodInputContainer : {
    display:"flex",
    justifyContent: "center",
    gap : "10px",

  },
  submitButton : {
    background: "white",
    // border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "inherit",
    marginTop: "10px",
    
    // color : "white"
  }
};

export default RecommendDialogue;
