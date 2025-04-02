import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Wine } from "../../types/wine";
import { addNote } from "../../store/slices/noteSlice";
import { registerWineCellar } from "../../api/sellerApi";
import { createWineNote } from "../../api/noteApi";
import { registerCustomWine } from "../../store/slices/sellarSlice";
import { CustomWineRegistrationRequest } from "../../types/seller";

interface AddSeller3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  drinkData: any;
  wineInfo: Wine;
  mode: "new" | "add";
  bottleId?: number;
  isCustom?: boolean;
  customWineForm?: CustomWineRegistrationRequest;  // 추가
}

const AddSeller3Modal = ({
  isOpen,
  onClose,
  onPrev,
  drinkData,
  wineInfo,
  mode,
  bottleId,
  isCustom = false,
  customWineForm,  // 추가
}: AddSeller3ModalProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);

    if (selectedImages.length + files.length > 3) {
      alert("최대 3장까지 업로드할 수 있습니다!");
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  // 이미지 제거
  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 와인 등록
  const handleComplete = async () => {
    try {
      let finalBottleId = bottleId;
      
      if (isCustom && customWineForm) {
        // 커스텀 와인 등록
        const customWineResult = await dispatch(registerCustomWine(customWineForm));
        if (registerCustomWine.fulfilled.match(customWineResult)) {
          finalBottleId = customWineResult.payload.bottleId;
        } else {
          throw new Error("커스텀 와인 등록 실패");
        }
      } else if (mode === "new") {
        // 일반 와인 등록
        const cellarResponse = await registerWineCellar(wineInfo.wineId);
        finalBottleId = cellarResponse.bottleId;
      }

      if (!finalBottleId) {
        alert("Bottle ID가 존재하지 않습니다.");
        return;
      }
      const noteData = {
        who: drinkData.companion,
        when: drinkData.drinkDate,
        pairing: drinkData.food ? drinkData.food.split(",") : [],
        nose: drinkData.taste,
        content: drinkData.note,
        rating: drinkData.rating,
        image: [],
      };

      // 이미지 FormData
      const formData = new FormData();
      formData.append("note", new Blob([JSON.stringify(noteData)], { type: "application/json" }));
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
      await fetch(`/api/v1/collection/note/${finalBottleId}/with-images`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      alert("와인 노트가 저장되었습니다!");
      onClose();
    } catch (error) {
      console.error("저장 중 오류:", error);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <h2 style={styles.title}>와인 수집</h2>
        {wineInfo && (
          <p style={styles.subtitle}>
            {wineInfo.grape}
            <img src={`/flags/${wineInfo.country}.png`} alt={wineInfo.country} style={styles.flagIcon} />
          </p>
        )}

        <div style={styles.wineContainer}>
          {wineInfo && (
            <>
              <img
                src={wineInfo.image || "/sample_image/wine_bottle.png"}
                alt={wineInfo.name}
                style={styles.wineImage}
              />
              <p style={styles.wineName}>{wineInfo.name}</p>
            </>
          )}
        </div>

        {/* 사진 업로드 */}
        <p style={styles.sectionTitle}>오늘을 함께 기억할 사진</p>
        <div style={styles.imageUploadContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} style={styles.uploadBox}>
              {selectedImages[index] ? (
                <>
                  <img src={selectedImages[index]} alt={`Uploaded ${index}`} style={styles.uploadedImage} />
                  <button style={styles.removeButton} onClick={() => removeImage(index)}>
                    ✕
                  </button>
                </>
              ) : (
                <label style={styles.uploadLabel}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  📷
                </label>
              )}
            </div>
          ))}
        </div>

        {/* 페이지 이동 */}
        <div style={styles.pagination}>
          <span style={styles.pageArrow} onClick={onPrev}>
            ←
          </span>
          <span style={styles.pageText}>3 / 3</span>
          <button style={styles.completeButton} onClick={handleComplete}>
            완료
          </button>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#2a0e35",
    padding: "20px",
    borderRadius: "25px",
    width: "350px",
    height: "600px",
    color: "#fff",
    position: "relative",
    border: "3px solid #d4a5ff",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  closeButton: {
    position: "absolute",
    right: "15px",
    top: "15px",
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#fff",
    cursor: "pointer",
  },
  title: { fontSize: "24px", fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: "14px", textAlign: "center", color: "#d4a5ff" },
  wineContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  wineImage: { width: "120px", height: "180px" },
  wineName: { fontSize: "16px", fontWeight: "bold", textAlign: "center", color: "#ffcc00" },
  sectionTitle: { fontSize: "14px", textAlign: "center", marginBottom: "10px" },
  imageUploadContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  uploadBox: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  uploadLabel: {
    fontSize: "24px",
    cursor: "pointer",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
    objectFit: "cover",
  },
  removeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "12px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  completeButton: {
    backgroundColor: "#ffcc00",
    color: "#2a0e35",
    border: "none",
    padding: "10px 15px",
    fontSize: "14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default AddSeller3Modal;
