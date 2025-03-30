import React, { useEffect, useState } from "react";
import { Bottle } from "../../types/note";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { editNote, removeNote, fetchNotes } from "../../store/slices/noteSlice";
import { WineNoteRequest } from "../../types/note";
import { fetchCellar } from "../../store/slices/sellarSlice";
import AddSeller2Modal from "../Modal/AddSeller2Modal";
import AddSeller3Modal from "../Modal/AddSeller3Modal";

interface WineSellerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bottle: Bottle;
}

const WineSellerDetailModal = ({ isOpen, onClose, bottle }: WineSellerDetailModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { wine, bottleId } = bottle;
  const { notes } = useSelector((state: RootState) => state.note);
  const wineNotes = notes.filter((note) => note.bottleId === bottleId);
  const [page, setPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
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
      dispatch(fetchNotes(bottle.bottleId));
    }
  }, [dispatch, bottle.bottleId]);

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
        if (page > 0) setPage((prev) => prev - 1);
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
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <h2 style={styles.title}>와인 수집</h2>
        <p style={styles.subtitle}>
          {wine.grape} | <img src={`/flags/${wine.country}.png`} alt={wine.country} style={styles.flag} />
        </p>
        <img
          src={wine.image !== "no_image" ? wine.image : "/sample_image/wine_sample.jpg"}
          alt={wine.name}
          style={styles.wineImage}
        />
        <h3 style={styles.name}>{wine.name}</h3>

        {wineNotes.length > 0 && (
          <div style={styles.noteContainer}>
            {isEditing ? (
              <>
                <p>
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
                <p>
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
              <button style={styles.controlBtn} onClick={startAddNote}>
                기록 추가
              </button>
              <div>
                <button onClick={handlePrev} style={styles.arrow}>
                  ←
                </button>
                <span>
                  {page + 1} / {totalPages}
                </span>
                <button onClick={handleNext} style={styles.arrow}>
                  →
                </button>
              </div>
              <div>
                {isEditing ? (
                  <>
                    <button style={styles.controlBtn} onClick={saveEdit}>
                      저장
                    </button>
                    <button style={styles.controlBtn} onClick={cancelEdit}>
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button style={styles.controlBtn} onClick={startEdit}>
                      수정
                    </button>
                    <button style={styles.controlBtn} onClick={() => handleDelete(currentNote.noteId)}>
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <AddSeller2Modal
          isOpen={isAddStep2Open}
          onClose={() => setIsAddStep2Open(false)}
          onPrev={() => setIsAddStep2Open(false)}
          onNext={handleAddStep2Next}
          wineInfo={wine}
        />
        {newNoteData && (
          <AddSeller3Modal
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
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    backgroundColor: "#2a0035",
    border: "3px solid #FFD447",
    borderRadius: "20px",
    padding: "20px",
    width: "320px",
    color: "#fff",
    fontFamily: "Pixel, sans-serif",
    overflowY: "auto",
    maxHeight: "90vh",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "20px",
    color: "#fff",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  best: {
    color: "#FFD447",
    fontSize: "12px",
    marginLeft: "5px",
  },
  subtitle: {
    fontSize: "12px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  flag: {
    width: "18px",
    height: "12px",
  },
  wineImage: {
    width: "80px",
    height: "120px",
    display: "block",
    margin: "10px auto",
  },
  name: {
    textAlign: "center",
    color: "#FFD447",
    fontSize: "16px",
    marginBottom: "15px",
  },
  noteContainer: {
    backgroundColor: "#3a1145",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "12px",
    lineHeight: "1.5",
  },
  imageList: {
    display: "flex",
    gap: "10px",
    marginTop: "8px",
  },
  noteImage: {
    width: "60px",
    height: "60px",
    borderRadius: "6px",
    objectFit: "cover",
  },
  controlArea: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  controlBtn: {
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    padding: "6px 10px",
    fontSize: "12px",
    marginRight: "5px",
    cursor: "pointer",
  },
  arrow: {
    margin: "0 5px",
    fontSize: "14px",
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
};

export default WineSellerDetailModal;
