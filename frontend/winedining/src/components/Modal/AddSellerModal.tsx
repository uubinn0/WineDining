import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { postWineBySearch, postWineByImage } from "../../store/slices/wineSlice";

interface AddSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSellerModal = ({ isOpen, onClose }: AddSellerModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWineId, setSelectedWineId] = useState<number | null>(null);
  const [uploadedImages, setUploadedImages] = useState<(File | null)[]>([null, null, null]);

  // ✅ 2페이지 입력 데이터 상태
  const [drinkDate, setDrinkDate] = useState("");
  const [whoWith, setWhoWith] = useState<string | null>(null);
  const [sideDish, setSideDish] = useState("");
  const [note, setNote] = useState("");
  const [flavor, setFlavor] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  if (!isOpen) return null;

  // ✅ 다음 단계 이동
  const nextStep = () => setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));

  // ✅ 이전 단계 이동
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  // ✅ 와인 선택 핸들러 (검색)
  const handleWineSelect = (wineId: number) => {
    setSelectedWineId(wineId);
    nextStep(); // 와인 선택 후 다음 단계 이동
  };

  // ✅ 이미지 업로드 핸들러
  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newImages = [...uploadedImages];
      newImages[index] = file;
      setUploadedImages(newImages);
    }
  };

  // ✅ 완료 버튼 클릭 시
  const handleComplete = () => {
    if (!drinkDate || !whoWith || !rating) {
      alert("마신 날짜, 함께한 사람, 평점을 선택해주세요!");
      return;
    }

    console.log({
      wineId: selectedWineId,
      drinkDate,
      whoWith,
      sideDish,
      note,
      flavor,
      rating,
    });

    if (selectedWineId) {
      dispatch(postWineBySearch(selectedWineId))
        .then(() => onClose()) // 성공하면 모달 닫기
        .catch(() => alert("와인 등록 실패!"));
    } else {
      alert("와인을 선택하세요!");
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {/* ✅ 1페이지: 와인 검색 */}
        {currentStep === 1 && (
          <>
            <h2 style={styles.title}>와인 수집</h2>
            <p style={styles.subtitle}>내가 마신 와인 등록</p>

            <div style={styles.searchBox}>
              <input type="text" placeholder="와인 상품명을 입력하세요" style={styles.input} />
              <span style={styles.searchIcon}>🔍</span>
            </div>

            <p style={styles.searchOption} onClick={() => handleWineSelect(123)}>
              {" "}
              {/* 예제 wineId */}
              와인사진으로 검색
              <br />
              와인 추가
            </p>

            <img src="/sample_image/default_wine.jpg" alt="와인 이미지" style={styles.wineImage} />
            <p style={styles.infoText}>내가 마신 와인을 찾아주세요!</p>
          </>
        )}

        {/* ✅ 2페이지: 마신 기록 입력 */}
        {currentStep === 2 && (
          <>
            <h2 style={styles.title}>와인 수집</h2>
            <p style={styles.subtitle}>기록을 입력하세요 🇫🇷</p>

            <img src="/sample_image/default_wine.jpg" alt="와인 이미지" style={styles.wineImage} />
            <p style={styles.wineName}>LA MARCA WINE</p>

            <div style={styles.recordBox}>
              {/* ✅ 마신 날짜 선택 */}
              <label>마신 날짜:</label>
              <input type="date" value={drinkDate} onChange={(e) => setDrinkDate(e.target.value)} />

              {/* ✅ 누구랑? 선택 */}
              <label>누구랑?:</label>
              <div style={styles.buttonGroup}>
                {["친구", "연인", "가족", "혼자"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setWhoWith(option)}
                    style={{
                      ...styles.selectButton,
                      backgroundColor: whoWith === option ? "#d4a017" : "#555",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* ✅ 안주 입력 */}
              <label>안주는?:</label>
              <input type="text" value={sideDish} onChange={(e) => setSideDish(e.target.value)} />

              {/* ✅ 내용 입력 */}
              <label>내용:</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} />

              {/* ✅ 맛 입력 */}
              <label>맛:</label>
              <input type="text" value={flavor} onChange={(e) => setFlavor(e.target.value)} />

              {/* ✅ 평점 선택 */}
              <label>평점:</label>
              <div style={styles.buttonGroup}>
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => setRating(score)}
                    style={{
                      ...styles.selectButton,
                      backgroundColor: rating === score ? "#d4a017" : "#555",
                    }}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ✅ 3페이지: 완료 */}
        {currentStep === 3 && (
          <>
            <h2 style={styles.title}>와인 수집</h2>
            <p style={styles.subtitle}>오늘을 함께 기억할 사진을 업로드하세요 🇫🇷</p>

            <button style={styles.completeButton} onClick={handleComplete}>
              완료
            </button>
          </>
        )}

        {/* ✅ 페이지 이동 버튼 */}
        <div style={styles.pagination}>
          {currentStep > 1 && <button onClick={prevStep}>←</button>}
          {currentStep} / 3{currentStep < 3 && <button onClick={nextStep}>→</button>}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#2a0e35",
    padding: "25px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "420px",
    position: "relative",
    textAlign: "center",
    border: "3px solid #d4a017",
    color: "white",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  },
  closeButton: {
    position: "absolute",
    right: "15px",
    top: "15px",
    fontSize: "22px",
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "15px",
    marginBottom: "15px",
    color: "#f4d03f",
  },
  selectButton: {
    padding: "8px 14px",
    margin: "5px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #d4a017",
    backgroundColor: "#3e1c47",
    color: "white",
    transition: "0.3s",
  },
  selectedButton: {
    backgroundColor: "#d4a017",
    color: "#2a0e35",
    fontWeight: "bold",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #d4a017",
    backgroundColor: "#3e1c47",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #d4a017",
    backgroundColor: "#3e1c47",
    color: "white",
    fontSize: "14px",
    outline: "none",
    resize: "none",
  },
  completeButton: {
    backgroundColor: "#ffcc00",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    transition: "0.3s",
    marginTop: "10px",
  },
  completeButtonHover: {
    backgroundColor: "#e0b300",
  },
  pagination: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#ccc",
  },
  pageButton: {
    backgroundColor: "#3e1c47",
    border: "none",
    color: "#d4a017",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "0.2s",
  },
  pageButtonHover: {
    backgroundColor: "#d4a017",
    color: "#3e1c47",
  },
};

export default AddSellerModal;
