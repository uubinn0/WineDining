import React, { useState, useEffect } from "react";
import { Wine, WineFilter } from "../../types/wine"; // WineFilter 추가
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import closeButton from "../../assets/icons/closebutton.png";
import { fetchFilteredWines } from "../../api/wineApi"; // Add this import

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
        sort: {
          field: "price" as const, // Fix the type by explicitly setting it as a const
          order: "desc" as const,
        },
        page: 1,
        limit: 20,
      };

      const response = await fetchFilteredWines(filter);
      const filteredResults = response.wines.filter((wine: Wine) =>
        wine.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Update the JSX part
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <img src={closeButton} alt="닫기" style={styles.closeButton} onClick={onClose} />

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
                key={wine.wineId}
                style={{
                  ...styles.wineItem,
                  backgroundColor: selectedWine?.wineId === wine.wineId ? "#d4a017" : "transparent",
                }}
                onClick={() => handleSelectWine(wine)}
              >
                <p>{wine.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* 선택 전 병 이미지 + 안내 문구 */}
        {!selectedWine && (
          <>
            {/* <div style={styles.centerBottleContainer}>
              <img src="/images/wine1.png" alt="와인병" style={styles.centerBottleImage} />
            </div> */}
            <p style={styles.bottomText}>내가 마신 와인을 찾아주세요!</p>
            <p style={styles.pagination}> 1 / 3 </p>
          </>
        )}

        {/* 와인 선택 후 정보 */}
        {selectedWine && (
          <div style={styles.selectedWineContainer}>
            <p style={styles.selectedTitle}>선택한 와인</p>
            <img
              src={selectedWine.image || "/sample_image/default_wine.jpg"}
              alt={selectedWine.name}
              style={styles.wineImage}
            />
            <p>{selectedWine.name}</p>
            <p>
              {selectedWine.country} | {selectedWine.typeName}
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
  centerBottleContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "32px",
    marginBottom: "24px",
  },
  centerBottleImage: {
    width: "80px",
    height: "auto",
  },
  bottomText: {
    fontSize: "14px",
    color: "#ffcc00",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  pagination: {
    fontSize: "12px",
    color: "white",
    fontFamily: "Galmuri9",
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
