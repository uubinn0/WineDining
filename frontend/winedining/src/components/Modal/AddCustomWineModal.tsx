import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { CustomWineRegistrationRequest, Bottle } from "../../types/seller";
import { registerCustomWine } from "../../store/slices/sellarSlice";
import { Wine } from "../../types/wine";
import { vh } from "../../utils/vh";
import closeButton from "../../assets/icons/closebutton.png";

interface AddCustomWineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { wine: Wine; customWineForm: CustomWineRegistrationRequest }) => void;
}

const AddCustomWineModal = ({ isOpen, onClose, onComplete }: AddCustomWineModalProps) => {
  const [form, setForm] = useState<CustomWineRegistrationRequest>({
    name: "",
    typeId: 1,
    country: "",
    grape: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.country || !form.grape) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 임시 와인 객체 생성
    const tempWine = {
      wineId: -1, // 임시 ID
      name: form.name,
      type: ["레드", "화이트", "스파클링", "로제"][form.typeId - 1],
      country: form.country,
      grape: form.grape,
      image: undefined,
      typeName: ["레드", "화이트", "스파클링", "로제"][form.typeId - 1],
      wish: false,
    };

    // form 데이터와 임시 와인 정보를 함께 전달
    onComplete({
      wine: tempWine,
      customWineForm: form,
    });
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: "center", color: "#FFD447", fontSize: "1.8vh" }}>커스텀 와인 등록</h2>
        <img src={closeButton} alt="닫기" style={styles.closeButton} onClick={onClose} />

        <label style={styles.label}>이름</label>
        <input style={styles.input} value={form.name} onChange={(e) => handleChange("name", e.target.value)} />

        <label style={styles.label}>타입</label>
        <select
          style={styles.select}
          value={form.typeId}
          onChange={(e) => handleChange("typeId", Number(e.target.value))}
        >
          <option value={1}>레드</option>
          <option value={2}>화이트</option>
          <option value={3}>스파클링</option>
          <option value={4}>로제</option>
        </select>

        <label style={styles.label}>국가</label>
        <input style={styles.input} value={form.country} onChange={(e) => handleChange("country", e.target.value)} />

        <label style={styles.label}>품종</label>
        <input style={styles.input} value={form.grape} onChange={(e) => handleChange("grape", e.target.value)} />

        <button style={styles.completeButton} onClick={handleSubmit}>
          등록하기
        </button>
        {/* <button style={styles.closeButton} onClick={onClose}>
          닫기
        </button> */}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 200,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    backgroundColor: "#2a0e35",
    color: "#fff",
    border: "0.3vh solid #FDEBD0",
    borderRadius: vh(2),
    padding: vh(2),
    width: vh(32),
    display: "flex",
    flexDirection: "column",
    gap: vh(1.5),
    marginBottom: vh(15),
  },
  /* 닫기 버튼 */
  closeButton: {
    position: "absolute",
    top: vh(-32),
    right: vh(2.4),
    width: vh(4),
    height: vh(4),
    cursor: "pointer",
  },
  label: {
    fontSize: vh(1.5),
    color: "white",
    marginBottom: vh(0.3),
  },
  input: {
    padding: vh(0.8),
    borderRadius: vh(0.4),
    border: "0.1vh solid #ccc",
    backgroundColor: "#fff",
    color: "black",
    fontSize: vh(1.5),
  },
  /* 타입 선택 박스 */
  select: {
    padding: vh(0.8),
    borderRadius: vh(0.4),
    border: "0.1vh solid #ccc",
    backgroundColor: "#fff",
    color: "black",
    fontSize: vh(1.3),
  },
  /* 등록 버튼 */
  completeButton: {
    width: "40%",
    margin: "0 auto", // 가운데 정렬을 위한 설정
    maxWidth: vh(44), // 약 350px 기준
    position: "relative",
    display: "inline-block",
    backgroundColor: "#ddd",
    color: "#000000",
    border: "none",
    borderRadius: vh(1),
    padding: `${vh(1)} ${vh(3)}`,
    cursor: "pointer",
    fontFamily: "Galmuri7",
    fontSize: vh(1.5),
    textAlign: "center",
    boxShadow: `${vh(0.6)} ${vh(0.6)} 0 #000`,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
};

export default AddCustomWineModal;
