import React, { useState, useEffect } from "react";
import { Wine, WineFilter } from "../../types/wine";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import closeButton from "../../assets/icons/closebutton.png";
import { fetchFilteredWines } from "../../api/wineApi";
import AddCustomWineModal from "./AddCustomWineModal";
import { Bottle } from "../../types/seller";

interface AddSeller1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (wine: Wine) => void;
  onCustomNext: (customBottle: Bottle) => void;
}

const AddSeller1Modal = ({ isOpen, onClose, onNext, onCustomNext }: AddSeller1ModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("검색어를 입력해주세요");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const filter: WineFilter = {
        keyword: searchTerm,
        filters: {
          type: [],
          grape: [],
          country: [],
          minPrice: 0,
          maxPrice: 1000000,
          minSweetness: 1,
          maxSweetness: 5,
          minAcidity: 1,
          maxAcidity: 5,
          minTannin: 1,
          maxTannin: 5,
          minBody: 1,
          maxBody: 5,
          pairing: [],
        },
        sort: { field: "price", order: "desc" },
        page: 1,
        limit: 20,
      };

      const response = await fetchFilteredWines(filter);
      const filteredResults = response.wines.filter((wine: Wine) =>
        wine.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredResults.length === 0) {
        setError("검색 결과가 없습니다");
      }

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("와인 검색 오류:", error);
      setError("검색 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWine = (wine: Wine) => {
    setSelectedWine(wine);
    setError(null);
  };

  const handleNextStep = () => {
    if (!selectedWine) {
      setError("와인을 선택해주세요!");
      return;
    }
    onNext(selectedWine);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchResults([]);
      setSelectedWine(null);
      setError(null);
      setIsCustomModalOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <img src={closeButton} alt="닫기" style={styles.closeButton} onClick={onClose} />
          <h2 style={styles.title}>와인 수집</h2>
          <p style={styles.subtitle}>내가 마신 와인 등록</p>

          <div style={styles.searchContainer}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder="와인 상품명을 입력하세요"
              style={styles.searchInput}
            />
            <button onClick={handleSearch} style={styles.searchButton} disabled={loading}>
              🔍
            </button>
          </div>

          {error && (
            <>
              <p style={styles.errorText}>{error}</p>
              {error === "검색 결과가 없습니다" && (
                <button onClick={() => setIsCustomModalOpen(true)} style={styles.customButton}>
                  직접 와인 등록하기
                </button>
              )}
            </>
          )}

          {loading ? (
            <p style={styles.loadingText}>검색 중...</p>
          ) : searchResults.length > 0 ? (
            <div style={styles.resultContainer}>
              {searchResults.map((wine) => (
                <div
                  key={wine.wineId}
                  style={{
                    ...styles.wineItem,
                    backgroundColor: selectedWine?.wineId === wine.wineId ? "#d4a017" : "transparent",
                  }}
                  onClick={() => handleSelectWine(wine)}
                >
                  <div style={styles.wineItemContent}>
                    <img
                      src={wine.image || "/sample_image/default_wine.jpg"}
                      alt={wine.name}
                      style={styles.wineItemImage}
                    />
                    <div>
                      <p style={styles.wineName}>{wine.name}</p>
                      <p style={styles.wineDetail}>
                        {wine.country} | {wine.typeName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p style={styles.bottomText}>내가 마신 와인을 찾아주세요!</p>
              <p style={styles.pagination}>1 / 3</p>
            </>
          )}

          {selectedWine && (
            <div style={styles.selectedWineContainer}>
              <p style={styles.selectedTitle}>선택한 와인</p>
              <img
                src={selectedWine.image || "/sample_image/default_wine.jpg"}
                alt={selectedWine.name}
                style={styles.wineImage}
              />
              <p style={styles.selectedWineName}>{selectedWine.name}</p>
              <p style={styles.selectedWineDetail}>
                {selectedWine.country} | {selectedWine.typeName}
              </p>
              <p style={styles.selectedWineGrape}>포도 품종: {selectedWine.grape}</p>
              <button onClick={handleNextStep} style={styles.nextButton}>
                다음
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 커스텀 와인 등록 모달 */}
      {isCustomModalOpen && (
        <AddCustomWineModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onComplete={(newBottle) => {
            setIsCustomModalOpen(false);
            onCustomNext(newBottle);
          }}
        />
      )}
    </>
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
    width: "80%",
    maxWidth: "400px",
    border: "5px solid #d4a017",
    position: "relative",
    color: "white",
    fontFamily: "Galmuri9",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "24px",
    height: "24px",
    cursor: "pointer",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "13px",
    marginBottom: "16px",
    color: "#ccc",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
    gap: "4px",
  },
  searchInput: {
    flex: 1,
    padding: "8px",
    fontSize: "14px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid white",
    color: "white",
    outline: "none",
  },
  searchButton: {
    fontSize: "16px",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  errorText: { fontSize: "13px", color: "tomato", marginTop: "6px" },
  loadingText: {
    fontSize: "14px",
    marginTop: "10px",
  },
  resultContainer: {
    marginTop: "10px",
    maxHeight: "200px",
    overflowY: "auto",
    borderTop: "1px solid #ccc",
  },
  wineItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
    transition: "background 0.2s",
  },
  wineItemContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  wineItemImage: {
    width: "50px",
    height: "75px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  wineName: { fontSize: "14px", fontWeight: "bold" },
  wineDetail: { fontSize: "12px", color: "#aaa" },
  bottomText: {
    fontSize: "14px",
    color: "#ffcc00",
    fontWeight: "bold",
    marginTop: "12px",
  },
  pagination: {
    fontSize: "12px",
    color: "white",
    marginBottom: "8px",
  },
  customButton: {
    backgroundColor: "#FFD447",
    color: "#2a0e35",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  selectedWineContainer: {
    marginTop: "15px",
    padding: "10px",
    background: "#3b1845",
    borderRadius: "5px",
  },
  selectedTitle: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  wineImage: {
    width: "100px",
    height: "150px",
    marginTop: "10px",
  },
  selectedWineName: {
    fontWeight: "bold",
    marginTop: "10px",
  },
  selectedWineDetail: {
    fontSize: "12px",
    color: "#ccc",
  },
  selectedWineGrape: {
    fontSize: "12px",
    marginTop: "4px",
  },
  nextButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#ffcc00",
    color: "#2a0e35",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AddSeller1Modal;
