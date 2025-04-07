import React, { useState, useEffect, useRef, useCallback } from "react";
import { Wine, WineFilter } from "../../types/wine";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import closeButton from "../../assets/icons/closebutton.png";
import { fetchFilteredWines } from "../../api/wineApi";
import AddCustomWineModal from "./AddCustomWineModal";
import { Bottle } from "../../types/seller";
import { CustomWineRegistrationRequest } from "../../types/seller";
import searchbutton from "../../assets/icons/searchbutton.png";
import customSampleWine from "../../assets/icons/customsample.png";
import { title } from "process";
import { vh } from "../../utils/vh";
import redWineImage from "../../assets/types/red_wine.png";
import whiteWineImage from "../../assets/types/white_wine.png";
import roseWineImage from "../../assets/types/rose_wine.png";
import sparklingWineImage from "../../assets/types/sparkling_wine.png";

interface AddSeller1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (wine: Wine) => void;
  onCustomNext: (data: { wine: Wine; customWineForm: CustomWineRegistrationRequest }) => void;
}

const AddSeller1Modal = ({ isOpen, onClose, onNext, onCustomNext }: AddSeller1ModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchNextPage = async (currentPage: number) => {
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
        sort: { field: "price", order: "desc" },
        page: currentPage,
        limit: 20,
      };

      const response = await fetchFilteredWines(filter);
      if (currentPage === 1) {
        setSearchResults(response.wines);
      } else {
        setSearchResults((prev) => [...prev, ...response.wines]);
      }
      setHasMore(response.wines.length === 20);
    } catch (error) {
      console.error("와인 검색 오류:", error);
      setError("검색 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError("검색어를 입력해주세요");
      return;
    }
    setPage(1);
    setSearchResults([]);
    setHasMore(true);
    fetchNextPage(1);
  };

  const lastWineRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreResults = async (pageToLoad: number) => {
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
        sort: { field: "price", order: "desc" },
        page: pageToLoad,
        limit: 20,
      };

      const response = await fetchFilteredWines(filter);

      const newWines = response.wines;

      setSearchResults((prev) => {
        const wineIds = new Set(prev.map((wine) => wine.wineId));
        const uniqueNewWines = newWines.filter((wine) => !wineIds.has(wine.wineId));
        return [...prev, ...uniqueNewWines];
      });

      setHasMore(newWines.length === 20);
    } catch (error) {
      console.error("와인 검색 오류:", error);
      setError("검색 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page > 1) {
      loadMoreResults(page);
    }
  }, [page]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchResults([]);
      setSelectedWine(null);
      setError(null);
      setIsCustomModalOpen(false);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <img src={closeButton} alt="닫기" style={styles.closeButton} onClick={onClose} />
          <div style={styles.titlewrapper}>
            <h2 style={styles.title}>와인 수집</h2>
            <p style={styles.subtitle}>내가 마신 와인 등록</p>
          </div>
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
              <img src={searchbutton} alt="" style={styles.searchButtonImage} />
            </button>
          </div>

          <button onClick={() => setIsCustomModalOpen(true)} style={styles.customButton}>
            직접 와인 등록하기
          </button>

          {error && <p style={styles.errorText}>{error}</p>}

          {loading && page === 1 ? (
            <p style={styles.loadingText}>검색 중...</p>
          ) : searchResults.length > 0 ? (
            <div style={styles.resultContainer}>
              {searchResults.map((wine, idx) => {
                const isLast = idx === searchResults.length - 1;
                return (
                  <div
                    key={wine.wineId}
                    ref={isLast ? lastWineRef : null}
                    style={{
                      ...styles.wineItem,
                      backgroundColor: selectedWine?.wineId === wine.wineId ? "#d4a017" : "transparent",
                    }}
                    onClick={() => handleSelectWine(wine)}
                  >
                    <div style={styles.wineItemContent}>
                      <img src={getWineImage(wine.image, wine.type)} alt={wine.name} style={styles.wineItemImage} />
                      <div>
                        <p style={styles.wineName}>{wine.name}</p>
                        <p style={styles.wineDetail}>
                          {wine.country} | {wine.type}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            !loading &&
            searchResults.length === 0 && (
              <div style={styles.emptyStateContainer}>
                <img src={customSampleWine} alt="와인 샘플" style={styles.sampleWineImage} />
                <p style={styles.bottomText}>내가 마신 와인을 찾아주세요!</p>
                <p style={styles.pagination}>1 / 3</p>
              </div>
            )
          )}

          {selectedWine && (
            <div style={styles.selectedWineContainer}>
              <p style={styles.selectedTitle}>선택한 와인</p>
              <img
                src={getWineImage(selectedWine.image, selectedWine.type)}
                alt={selectedWine.name}
                style={styles.wineImage}
              />
              <p style={styles.selectedWineName}>{selectedWine.name}</p>
              <p style={styles.selectedWineDetail}>
                {selectedWine.country} | {selectedWine.type}
              </p>
              <p style={styles.selectedWineGrape}>품종: {selectedWine.grape}</p>
              <button onClick={handleNextStep} style={styles.nextButton}>
                선택
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 커스텀 와인 등록 */}
      {isCustomModalOpen && (
        <AddCustomWineModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onComplete={(data) => {
            setIsCustomModalOpen(false);
            onCustomNext(data);
          }}
        />
      )}
    </>
  );
};

// styles 객체 내부
const styles: { [key: string]: React.CSSProperties } = {
  /* 오버레이 스타일 */
  overlay: {
    position: "fixed",
    top: 25,
    left: -20,
    // width: "100%",
    // height: "100%",
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
    top: "-32vh",
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
  /* 제목, 부제목 박스 */
  titlewrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: "-1vh",
    marginBottom: "1vh",
  },
  /* 제목 */
  title: {
    textAlign: "left",
    fontSize: "2vh",
    fontWeight: "bold",
    marginLeft: 0,
    marginTop: "-1vh",
  },
  /* 부제목 */
  subtitle: {
    textAlign: "left",
    fontSize: "1.5vh",
    color: "#ccc",
    marginLeft: 0,
    marginTop: "-1vh",
  },
  /* 검색 박스 */
  searchContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vh(1),
    borderBottom: `${vh(0.15)} solid white`,
    gap: 0,
  },
  /* 검색창 */
  searchInput: {
    flex: 1,
    padding: "1vh",
    fontSize: "1.6vh",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    outline: "none",
  },
  /* 검색 버튼 */
  searchButton: {
    fontSize: "2vh",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0.8vh 1.2vh",
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  /* 검색 버튼 이미지 */
  searchButtonImage: {
    width: "4vh",
    height: "4vh",
    marginRight: "-1.9vh",
    marginBottom: "-1vh",
  },
  /* 에러 메시지 */
  errorText: { fontSize: "1.4vh", color: "tomato", marginTop: "0.5vh" },
  /* 로딩 텍스트 */
  loadingText: {
    fontSize: "1.6vh",
    marginTop: "1vh",
  },
  /* 결과박스 */
  resultContainer: {
    marginTop: "1vh",
    maxHeight: "60vh",
    overflowY: "auto",
    borderTop: "0.2vh solid #ccc",
  },
  wineItem: {
    padding: "1vh",
    cursor: "pointer",
    borderBottom: "0.15vh solid #ccc",
    transition: "background 0.2s",
  },
  wineItemContent: {
    display: "flex",
    alignItems: "center",
    gap: "1vh",
  },
  wineItemImage: {
    width: "5vh",
    height: "9vh",
    objectFit: "cover",
    borderRadius: vh(0.4),
  },
  wineName: { fontSize: "1.4vh", fontWeight: "bold" },
  wineDetail: { fontSize: "1.2vh", color: "#aaa" },

  /* 내가 마신 와인을 찾아주세요! */
  bottomText: {
    fontSize: "1.6vh",
    color: "white",
    fontWeight: "bold",
    marginTop: vh(10),
  },
  /* 페이지네이션 */
  pagination: {
    fontSize: vh(1.5),
    color: "white",
    marginTop: vh(8),
  },
  /* 커스텀 와인 등록 버튼 */
  customButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: vh(21.7),
    fontSize: vh(1.5),
  },

  /* 선택된 와인 박스 */
  selectedWineContainer: {
    marginTop: vh(1.5),
    padding: vh(1),
    background: "#3b1845",
    borderRadius: vh(0.5),
  },
  selectedTitle: {
    fontSize: vh(1.6),
    fontWeight: "bold",
  },
  wineImage: {
    width: vh(10),
    height: vh(15),
    marginTop: vh(1),
  },
  selectedWineName: {
    fontWeight: "bold",
    marginTop: vh(1),
  },
  selectedWineDetail: {
    fontSize: vh(1.2),
    color: "#ccc",
  },
  selectedWineGrape: {
    fontSize: vh(1.2),
    marginTop: vh(0.4),
  },
  nextButton: {
    width: "30%",
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
  emptyStateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: vh(2),
  },
  /* 샘플 와인 이미지 */
  sampleWineImage: {
    width: vh(30),
    height: vh(20),
    objectFit: "contain",
    marginBottom: vh(5),
    marginTop: vh(10),
  },
};

export default AddSeller1Modal;
