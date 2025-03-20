import React, { useState, useEffect } from "react";
import { Wine } from "../../types/wine";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
// 더미데이터 api
import { fetchFilteredWines } from "../../mocks/mockApi";

interface AddSeller1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (wine: Wine | null) => void;
}

const AddSeller1Modal = ({ isOpen, onClose, onNext }: AddSeller1ModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // 와인 검색
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const wines = (await fetchFilteredWines()) as Wine[];
      const filteredResults = wines.filter(
        (wine: Wine) =>
          wine.kr_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wine.en_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("와인 검색 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 검색한 와인 선택하기
  const handleSelectWine = (wine: Wine) => {
    setSelectedWine(wine);
  };

  // 다음 페이지로 이동
  const handleNextStep = () => {
    if (!selectedWine) {
      alert("와인을 선택해주세요!");
      return;
    }
    // console.log("선택한 와인:", selectedWine);
    onNext(selectedWine);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchResults([]);
      setSelectedWine(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <h2 style={styles.title}>와인 수집</h2>
        <p style={styles.subtitle}>내가 마신 와인 등록</p>

        {/* 검색창 */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="와인 상품명을 입력하세요"
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchButton} disabled={loading}>
            🔍
          </button>
        </div>

        {/* 검색 리스트 */}
        {loading && <p style={styles.loadingText}>검색 중...</p>}
        {searchResults.length > 0 && (
          <div style={styles.resultContainer}>
            {searchResults.map((wine) => (
              <div
                key={wine.wine_id}
                style={{
                  ...styles.wineItem,
                  backgroundColor: selectedWine?.wine_id === wine.wine_id ? "#d4a017" : "transparent",
                }}
                onClick={() => handleSelectWine(wine)}
              >
                <p>
                  {wine.kr_name} ({wine.en_name})
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 와인 선택 */}
        {selectedWine && (
          <div style={styles.selectedWineContainer}>
            <p style={styles.selectedTitle}>선택한 와인</p>
            <img
              src={selectedWine.image || "/sample_image/default_wine.jpg"}
              alt={selectedWine.kr_name}
              style={styles.wineImage}
            />
            <p>{selectedWine.kr_name}</p>
            <p>{selectedWine.en_name}</p>
            <p>
              {selectedWine.country} | {selectedWine.type}
            </p>
            <p>포도 품종: {selectedWine.grape}</p>
            <button onClick={handleNextStep} style={styles.nextButton}>
              다음
            </button>
          </div>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#2a0e35",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "400px",
    position: "relative",
    textAlign: "center",
    border: "3px solid #d4a017",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    right: "10px",
    top: "10px",
    fontSize: "18px",
    cursor: "pointer",
    color: "white",
  },
  title: { fontSize: "18px", fontWeight: "bold" },
  searchContainer: { display: "flex", justifyContent: "center", marginBottom: "10px" },
  searchInput: { flex: 1, padding: "8px", fontSize: "14px" },
  searchButton: { padding: "8px", cursor: "pointer" },
  loadingText: { textAlign: "center", fontSize: "14px" },
  resultContainer: { marginTop: "10px", maxHeight: "200px", overflowY: "auto", borderTop: "1px solid #ccc" },
  wineItem: { padding: "10px", cursor: "pointer", borderBottom: "1px solid #ccc", transition: "background 0.2s" },
  selectedWineContainer: { marginTop: "15px", padding: "10px", background: "#3b1845", borderRadius: "5px" },
  selectedTitle: { fontSize: "16px", fontWeight: "bold" },
  wineImage: { width: "100px", height: "150px", marginTop: "10px" },
  nextButton: { marginTop: "10px", padding: "10px", backgroundColor: "#ffcc00", cursor: "pointer" },
};

export default AddSeller1Modal;
