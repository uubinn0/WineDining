import React, { useEffect, useState } from "react";
import { Bottle } from "../../types/note";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { editNote, removeNote, fetchNotes } from "../../store/slices/noteSlice";
import { WineNoteRequest } from "../../types/note";
import { fetchCellar } from "../../store/slices/sellarSlice";
import closeButton from "../../assets/icons/closebutton.png";
import AddSellerModal from "./AddSellerModal";
import Add1SellerModal from "./add1SellerModal";
import { vh } from "../../utils/vh";
import redWineImage from "../../assets/types/red_wine.png";
import whiteWineImage from "../../assets/types/white_wine.png";
import roseWineImage from "../../assets/types/rose_wine.png";
import sparklingWineImage from "../../assets/types/sparkling_wine.png";
import { motion } from "framer-motion";

interface WineSellerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bottle: Bottle;
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

const WineSellerDetailModal = ({ isOpen, onClose, bottle }: WineSellerDetailModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { wine, bottleId } = bottle;
  const { notes } = useSelector((state: RootState) => state.note);
  const wineNotes = notes.filter((note) => note.bottleId === bottleId);
  const [page, setPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isNoteReady, setIsNoteReady] = useState(false);
  const [readyToRender, setReadyToRender] = useState(false);
  const [editData, setEditData] = useState<WineNoteRequest>({
    who: "",
    when: "",
    pairing: [],
    nose: "",
    content: "",
    rating: 0,
    image: [],
  });

  // 기록 추가 상태
  const [isAddStep2Open, setIsAddStep2Open] = useState(false);
  const [isAddStep3Open, setIsAddStep3Open] = useState(false);
  const [newNoteData, setNewNoteData] = useState<any>(null);

  useEffect(() => {
    if (bottle.bottleId) {
      setIsNoteReady(false); // 처음엔 false
      dispatch(fetchNotes(bottle.bottleId)).then(() => {
        setIsNoteReady(true); // 받아오고 나면 true
      });
    }
  }, [dispatch, bottle.bottleId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => setShowModal(true), 100);
    } else {
      setShowModal(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (wineNotes.length > 0 && wineNotes[0].bottleId === bottleId) {
      setReadyToRender(true);
    }
  }, [wineNotes, bottleId]);

  if (!isOpen) return null;

  const totalPages = wineNotes.length;
  const currentNote = wineNotes[page];

  const handleDelete = async (noteId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await dispatch(removeNote(noteId));

      const updatedNotes = notes.filter((n) => n.noteId !== noteId);

      if (updatedNotes.length === 0) {
        alert("노트가 모두 삭제되어 셀러에서 해당 와인이 제거됩니다.");
        onClose();
        dispatch(fetchCellar());
      } else {
        if (page >= updatedNotes.length) {
          setPage(updatedNotes.length - 1);
        }
      }
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };

  const startEdit = () => {
    setIsEditing(true);
    setEditData({ ...currentNote });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({
      who: "",
      when: "",
      pairing: [],
      nose: "",
      content: "",
      rating: 0,
      image: [],
    });
  };

  const saveEdit = () => {
    dispatch(editNote({ noteId: currentNote.noteId, note: editData }));
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const startAddNote = () => setIsAddStep2Open(true);

  const handleAddStep2Next = (drinkData: any) => {
    setNewNoteData(drinkData);
    setIsAddStep2Open(false);
    setIsAddStep3Open(true);
  };

  const handleAddStep3Close = () => {
    setIsAddStep3Open(false);
    setNewNoteData(null);
    setIsAddStep2Open(false); // 추가: 두 번째 단계 모달도 닫기
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

  const getWineImage = (image: string | null | undefined, type: string | undefined) => {
    if (!image || image === "no_image" || image === "") {
      return getDefaultImageByType(type);
    }
    return image;
  };

  if (!currentNote) return null;

  return (
    <motion.div
      style={styles.overlay}
      onClick={onClose}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
    >
      <div
        style={{
          ...styles.modal,
          opacity: showModal ? 1 : 0,
          transform: showModal ? "scale(1)" : "scale(0.95)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={closeButton} alt="닫기" style={styles.closeButton} onClick={onClose} />

        <h2 style={styles.title}>와인 수집</h2>
        {/* 국기 이미지 */}
        <p style={styles.subtitle}>
          {wine.type} 와인 / {wine.grape}
          {" / "}
          {flags[wine.country] ? (
            <img src={flags[wine.country]} alt={wine.country} style={styles.flagIcon} />
          ) : (
            <span style={{ fontSize: "1.4vh", color: "#FFD447", marginLeft: "0.5vh" }}>{wine.country}</span>
          )}
        </p>
        {/* 와인 이미지 */}
        <img src={getWineImage(wine.image, wine.type)} alt={wine.name} style={styles.wineImage} />
        <h3 style={styles.name}>{wine.name}</h3>

        {readyToRender && (
          <div style={styles.noteContainer}>
            {isEditing ? (
              <>
                <p style={styles.label}>
                  마신 날짜: <input value={editData.when} onChange={(e) => handleChange("when", e.target.value)} />
                </p>
                <p>
                  누구랑? <input value={editData.who} onChange={(e) => handleChange("who", e.target.value)} />
                </p>
                <p>
                  안주는?{" "}
                  <input
                    value={editData.pairing?.join(", ")}
                    onChange={(e) => handleChange("pairing", e.target.value.split(","))}
                  />
                </p>
                <p style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                  내용:
                  <br />
                  <textarea value={editData.content} onChange={(e) => handleChange("content", e.target.value)} />
                </p>
                <p>
                  맛: <input value={editData.nose} onChange={(e) => handleChange("nose", e.target.value)} />
                </p>
                <p>
                  평점:{" "}
                  <input
                    type="number"
                    value={editData.rating}
                    onChange={(e) => handleChange("rating", Number(e.target.value))}
                  />
                </p>
              </>
            ) : (
              <>
                <p>마신 날짜: {currentNote.when}</p>
                <p>누구랑? {currentNote.who}</p>
                <p>안주는? {currentNote.pairing.join(" ")}</p>
                <p>
                  내용:
                  <br />
                  {currentNote.content}
                </p>
                <p>맛: {currentNote.nose}</p>
                <p>평점: {currentNote.rating} 점</p>
              </>
            )}

            {currentNote.image && currentNote.image.length > 0 && (
              <>
                <p>함께 기억한 사진</p>
                <div style={styles.imageList}>
                  {currentNote.image.map((img, idx) => (
                    <img key={idx} src={img} alt={`note-img-${idx}`} style={styles.noteImage} />
                  ))}
                </div>
              </>
            )}

            <div style={styles.controlArea}>
              {/* 기록 추가 */}
              <span style={styles.addButton} onClick={startAddNote}>
                기록 추가
              </span>
              {/* 페이지네이션 */}
              <div style={styles.pagination}>
                <span onClick={handlePrev} style={styles.pageArrow}>
                  ←
                </span>
                <span>
                  {page + 1} / {totalPages}
                </span>
                <span onClick={handleNext} style={styles.pageArrow}>
                  →
                </span>
              </div>
              {/* 수정 / 삭제 */}
              <div>
                {isEditing ? (
                  <div style={{ display: "flex", marginTop: vh(4) }}>
                    <span style={styles.editButton} onClick={saveEdit}>
                      저장
                    </span>
                    <span style={styles.deleteButton} onClick={cancelEdit}>
                      취소
                    </span>
                  </div>
                ) : (
                  <div style={{ display: "flex", marginTop: vh(4) }}>
                    <span style={styles.editButton} onClick={startEdit}>
                      수정
                    </span>
                    <span style={styles.deleteButton} onClick={() => handleDelete(currentNote.noteId)}>
                      삭제
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <AddSellerModal
          isOpen={isAddStep2Open}
          onClose={() => setIsAddStep2Open(false)}
          onPrev={() => setIsAddStep2Open(false)}
          onNext={handleAddStep2Next}
          wineInfo={wine}
        />
        {newNoteData && (
          <Add1SellerModal
            isOpen={isAddStep3Open}
            onClose={handleAddStep3Close}
            onPrev={() => {
              setIsAddStep3Open(false);
              setIsAddStep2Open(true);
            }}
            drinkData={newNoteData}
            wineInfo={wine}
            mode="add"
            bottleId={bottle.bottleId}
          />
        )}
      </div>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    backgroundColor: "#2a0035",
    border: "0.3vh solid #FDEBD0",
    borderRadius: vh(2),
    padding: vh(2),
    width: "80%",
    color: "#fff",
    fontFamily: "Galmuri9",
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    maxHeight: "80vh",
    position: "relative",
    maxWidth: "360px",
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
  /* 와인 이미지 */
  wineImage: {
    width: vh(20),
    height: vh(20),
    display: "block",
    margin: `${vh(1)} auto`,
  },
  /* 와인 이름 */
  name: {
    textAlign: "center",
    color: "#FFD447",
    fontSize: "1.9vh",
    marginBottom: "1.5vh",
  },

  /* 리뷰 감싸는 박스 */
  noteContainer: {
    padding: vh(1),
    borderRadius: vh(1),
    fontSize: vh(1.4),
    lineHeight: vh(2),
  },
  /* 리뷰 사진 리스트 */
  imageList: {
    display: "flex",
    gap: vh(1.5),
    marginTop: "0.8vh",
  },
  /* 리뷰 사진 */
  noteImage: {
    width: "8vh",
    height: "7vh",
    borderRadius: vh(0.6),
    objectFit: "cover",
  },
  label: {
    fontWeight: "bold",
    width: vh(10),
    fontSize: vh(1.8),
  },
  /* 기록 추가, 페이지네이션, 수정, 삭제 부분 */
  controlArea: {
    display: "flex",
    gap: vh(1.5),
  },
  /* 기록 추가 버튼 */
  addButton: {
    padding: `${vh(0.5)} ${vh(0.5)}`,
    border: "none",
    marginTop: vh(4.4),
  },
  /* 수정 버튼 */
  editButton: {
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    borderRadius: vh(0.4),
    padding: `${vh(0.6)} ${vh(1)}`,
    fontSize: vh(1.4),
    marginRight: vh(0.5),
    marginTop: vh(0.4),
  },
  /* 삭제 버튼 */
  deleteButton: {
    backgroundColor: "#fff",
    color: "#000",
    marginTop: vh(0.4),
    borderRadius: vh(0.4),
    padding: `${vh(0.6)} ${vh(1)}`,
    fontSize: vh(1.4),
  },
  /* 페이지네이션 */
  pagination: {
    marginTop: vh(5),
    textAlign: "center",
    fontSize: vh(1.3),
    color: "white",
    marginLeft: vh(2.5),
  },
  pageArrow: {
    margin: `0 ${vh(1.5)}`,
    cursor: "pointer",
  },
};

export default WineSellerDetailModal;
