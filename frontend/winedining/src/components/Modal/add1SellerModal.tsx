import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Wine } from "../../types/wine";
import { addNote } from "../../store/slices/noteSlice";
import { registerWineCellar } from "../../api/sellerApi";
import { createWineNote } from "../../api/noteApi";
import { registerCustomWine } from "../../store/slices/sellarSlice";
import { CustomWineRegistrationRequest } from "../../types/seller";
import { fetchCellar, fetchBest } from "../../store/slices/sellarSlice";
import closebutton from "../../assets/icons/closebutton.png";
import { vh } from "../../utils/vh";
import camera from "../../assets/icons/camera.png";
import redWineImage from "../../assets/types/red_wine.png";
import whiteWineImage from "../../assets/types/white_wine.png";
import roseWineImage from "../../assets/types/rose_wine.png";
import sparklingWineImage from "../../assets/types/sparkling_wine.png";
import { fetchNotes } from "../../store/slices/noteSlice";

interface Add1SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  drinkData: any;
  wineInfo: Wine;
  mode: "new" | "add";
  bottleId?: number;
  isCustom?: boolean;
  customWineForm?: CustomWineRegistrationRequest; // 추가
}

/* 국기 이미지 */
const flags = importAll(require.context("../../assets/flags", false, /\.png$/));

function importAll(r: __WebpackModuleApi.RequireContext) {
  let images: { [key: string]: string } = {};
  r.keys().forEach((item) => {
    const key = item.replace("./", "").replace(".png", ""); // '대한민국.png' → '대한민국'
    images[key] = r(item);
  });
  return images;
}

const Add1SellerModal = ({
  isOpen,
  onClose,
  onPrev,
  drinkData,
  wineInfo,
  mode,
  bottleId,
  isCustom = false,
  customWineForm, // 추가
}: Add1SellerModalProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;
    setIsSubmitting(true);
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

      // 성공적으로 저장된 후 상태 초기화
      setSelectedImages([]);
      setImageFiles([]);
      setIsSubmitting(false);

      alert("와인 노트가 저장되었습니다!");

      // ✅ 노트 새로고침!
      await dispatch(fetchNotes(finalBottleId));

      // 셀러 리스트 새로고침
      await dispatch(fetchCellar());
      await dispatch(fetchBest());

      onClose();
    } catch (error) {
      setIsSubmitting(false);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const getDefaultImageByType = (type: string | undefined) => {
    switch (type?.toLowerCase()) {
      case "레드":
        return redWineImage;
      case "화이트":
        return whiteWineImage;
      case "로제":
        return roseWineImage;
      case "스파클링":
        return sparklingWineImage;
      default:
        return redWineImage;
    }
  };

  const getWineImage = () => {
    const img = wineInfo.image;
    if (!img || img === "no_image" || img === "") {
      return getDefaultImageByType((wineInfo as any).type || (wineInfo as any).typeName);
    }
    return img;
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <img src={closebutton} alt="닫기" style={styles.closeButton} onClick={onClose} />

        <h2 style={styles.title}>와인 수집</h2>
        {wineInfo && (
          <p style={styles.subtitle}>
            {wineInfo.grape}{" "}
            {flags[wineInfo.country] ? (
              <img src={flags[wineInfo.country]} alt={wineInfo.country} style={styles.flagIcon} />
            ) : (
              <span style={{ fontSize: "1.4vh", color: "#FFD447", marginLeft: "0.5vh" }}>{wineInfo.country}</span>
            )}
          </p>
        )}

        <div style={styles.wineContainer}>
          {wineInfo && (
            <>
              <img src={getWineImage()} alt={wineInfo.name} style={styles.wineImage} />
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
                  <img src={camera} alt="" />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* 페이지 이동 */}
        <div style={styles.pagination}>
          <div style={styles.pageCenter}>
            <span style={styles.pageArrow} onClick={onPrev}>
              ←
            </span>
            <span style={styles.pageText}>3 / 3</span>
          </div>

          <button
            style={{
              ...styles.completeButton,
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            onClick={handleComplete}
            disabled={isSubmitting}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  /* 오버레이 스타일 */
  overlay: {
    position: "fixed",
    top: -6,
    left: -21,
    right: -20,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    transition: "opacity 0.3s ease",
  },
  /* 모달 스타일 */
  modal: {
    width: "90vw",
    maxWidth: "500px",
    height: "85vh",
    // top: "-32vh",
    left: 0,
    padding: "2.5vh",
    marginBottom: "auto",
    backgroundColor: "#2a0e35",
    border: "0.6vh solid #FDEBD0",
    borderRadius: "1.3vh",
    overflowY: "hidden",
    boxSizing: "border-box",
    scrollbarWidth: "none",
    flexDirection: "column",
    display: "flex",
    transition: "transform 0.3s ease",
    fontFamily: "Galmuri9",
    textAlign: "center",
    position: "relative",
  },
  /* 닫기 버튼 */
  closeButton: {
    position: "absolute",
    top: "1.2vh",
    right: "1.2vh",
    width: "4vh",
    height: "4vh",
    cursor: "pointer",
  },
  /* 제목 */
  title: {
    textAlign: "left",
    fontSize: "2vh",
    fontWeight: "bold",
    marginLeft: vh(-1),
    marginTop: "-1vh",
  },
  /* 부제목 */
  subtitle: {
    textAlign: "left",
    fontSize: "1.5vh",
    color: "#ccc",
    marginLeft: vh(-1),
    marginTop: "-1vh",
  },
  /* 국기 아이콘 */
  flagIcon: {
    width: vh(1.8),
    height: vh(1.2),
  },
  /* 와인 설명 감싸는 박스 */
  wineContainer: {
    textAlign: "center",
    marginBottom: vh(2),
  },
  wineImage: {
    width: vh(27),
    height: "auto",
    marginBottom: vh(2),
    marginTop: vh(2),
  },
  wineName: {
    fontSize: vh(1.6),
    fontWeight: "bold",
    color: "#ffcc00",
    marginTop: vh(0.8),
  },
  /* 오늘을 함께 기억할 사진*/
  sectionTitle: { fontSize: vh(1.8), textAlign: "left", marginBottom: vh(1.3), marginLeft: vh(1.7) },
  /* 사진 올리는 부분 */
  imageUploadContainer: {
    display: "flex",
    justifyContent: "center",
    gap: vh(1.5),
  },
  uploadBox: {
    width: vh(10),
    height: vh(10),
    borderRadius: vh(1.5),
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  uploadLabel: {
    fontSize: vh(2.5),
    cursor: "pointer",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: vh(0.8),
    objectFit: "cover",
  },
  /* 사진 제거 버튼 */
  removeButton: {
    position: "absolute",
    top: vh(0.5),
    right: vh(0.7),
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: vh(2),
    height: vh(2),
    fontSize: vh(1.5),
    cursor: "pointer",
  },
  /* 페이지네이션 */
  pagination: {
    marginTop: vh(12),
    position: "relative",
    height: vh(4),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: vh(1.5),
    color: "white",
  },
  pageCenter: {
    marginRight: vh(4.2),
    display: "flex",
    alignItems: "center",
    gap: vh(0),
  },
  pageArrow: {
    margin: `0 ${vh(1.5)}`,
    cursor: "pointer",
  },
  /* 완료 버튼 */
  completeButton: {
    position: "absolute",
    right: 0,
    backgroundColor: "white",
    color: "black",
    border: "none",
    padding: `${vh(1)} ${vh(1.5)}`,
    fontSize: vh(1.5),
    borderRadius: vh(0.8),
    cursor: "pointer",
  },
};

export default Add1SellerModal;
