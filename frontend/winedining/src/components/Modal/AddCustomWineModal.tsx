import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { CustomWineRegistrationRequest, Bottle } from "../../types/seller";
import { registerCustomWine } from "../../store/slices/sellarSlice";

interface AddCustomWineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (bottle: Bottle) => void;
}

const AddCustomWineModal = ({ isOpen, onClose, onComplete }: AddCustomWineModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<CustomWineRegistrationRequest>({
    name: "",
    typeId: 1,
    country: "",
    grape: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("📦 [AddCustomWineModal] 제출 시작");
    console.log("📝 제출 데이터:", form);

    if (!form.name || !form.country || !form.grape) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    try {
      const resultAction = await dispatch(registerCustomWine(form));
      console.log("✅ 커스텀 와인 등록 성공:", resultAction);
      if (registerCustomWine.fulfilled.match(resultAction)) {
        alert("커스텀 와인이 등록되었습니다!");
        onComplete(resultAction.payload);
      } else {
        alert("등록 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("❌ 커스텀 와인 등록 오류:", error);
      alert("알 수 없는 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: "center", color: "#FFD447", fontSize: "18px" }}>커스텀 와인 등록</h2>

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

        <button style={styles.button} onClick={handleSubmit}>
          등록하기
        </button>
        <button style={styles.closeButton} onClick={onClose}>
          닫기
        </button>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    backgroundColor: "#2a0e35",
    color: "#fff",
    border: "3px solid #FFD447",
    borderRadius: "20px",
    padding: "20px",
    width: "320px",
    fontFamily: "Pixel, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "13px",
    color: "#FFD447",
    marginBottom: "4px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "13px",
  },
  select: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "13px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#FFD447",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#2a0e35",
    fontSize: "14px",
  },
  closeButton: {
    padding: "10px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#000",
    fontSize: "14px",
  },
};

export default AddCustomWineModal;
