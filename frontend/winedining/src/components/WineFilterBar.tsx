import React, { useState } from "react";
import { WineFilter } from "../types/wine";
import { trackEvent } from "../utils/analytics";

interface WineFilterBarProps {
  filter: WineFilter;
  onChange: (newFilter: WineFilter) => void;
}

const WineFilterBar = ({ filter, onChange }: WineFilterBarProps) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [grapeSearch, setGrapeSearch] = useState("");

  const filterOptions = {
    type: ["레드", "화이트", "로제", "스파클링"],
    grape: [
      "글레라",
      "소비뇽",
      "쉬라즈",
      "그르나슈",
      "네비올로",
      "모스카토",
      "샤도네이",
      "템프라니요",
      "게뷔르츠트라미너 ",
      "네그로아마로 ",
      "몬테풀치아노 ",
      "가르가네가 ",
      "람브루스코 ",
      "마르제미노 ",
      "모나스트렐 ",
      "무르베드르 ",
      "베르나키아 ",
      "베르멘티노 ",
      "산지오베제 ",
      "시라쉬라즈 ",
      "알리아니코 ",
      "카르메네르 ",
      "코르비노네 ",
      "템프라니요 ",
      "트레비아노 ",
      "프로카니코 ",
      "프리미티보 ",
      "피에디로쏘 ",
      "그레카니코 도라토  ",
      "베르디키오 비앙코  ",
      "산지오베제 그로쏘  ",
      "가르나차 ",
      "고바이오 ",
      "그르나슈 ",
      "까리네나 ",
      "네비올로 ",
      "라크리마 ",
      "마르산느 ",
      "마카베오 ",
      "말바시아 ",
      "모스카텔 ",
      "모스카토 ",
      "뮈스까델 ",
      "뮈스카데 ",
      "바르베라 ",
      "보나르다 ",
      "브라케토 ",
      "브루넬로 ",
      "비오니에 ",
      "샤르도네 ",
      "쇼이레베 ",
      "알리고테 ",
      "오쎄후와 ",
      "인졸리아 ",
      "코르비나 ",
      "코르테제 ",
      "콜로리노 ",
      "콜롱바르 ",
      "팔랑기나 ",
      "푸르민트 ",
      "프레이자 ",
      "프로세코 ",
      "피노타주 ",
      "코르비나 베로네제  ",
      "카베르네 소비뇽  ",
      "프루놀로 젠타일  ",
      "그르나슈 블랑  ",
      "카베르네 프랑  ",
      "가메이 ",
      "그릴로 ",
      "글레라 ",
      "까리냥 ",
      "돈펠더 ",
      "돌체토 ",
      "리바너 ",
      "리슬링 ",
      "메를로 ",
      "뮈스까 ",
      "블렌드 ",
      "비우라 ",
      "세미용 ",
      "시에나 ",
      "실바너 ",
      "아이렌 ",
      "진판델 ",
      "콩코드 ",
      "클레렛 ",
      "프랑스 ",
      "플로라 ",
      "피뇰로 ",
      "소비뇽 블랑",
      "까넬리 모스카토  ",
      "투리가 나시오날  ",
      "보르도 블렌드 레드   ",
      "그레코 비앙코  ",
      "오렌지 뮈스까  ",
      "내츄럴 하니 자연산 꿀  ",
      "뮈스까 블랑 쁘띠 그랑    ",
      "그롤로 그리  ",
      "소비뇽 블랑  ",
      "말벡 ",
      "모작 ",
      "보발 ",
      "비달 ",
      "피노 그리지오",
      "틴타 프란키스카  ",
      "블랙 그르나슈  ",
      "피노 그리지오  ",
      "틴타 네그라 몰레   ",
      "네로 다볼라  ",
      "틴타 로리즈  ",
      "기타 품종  ",
      "쁘띠 만생  ",
      "슈냉 블랑  ",
      "우니 블랑  ",
      "테레 블랑  ",
      "피노 그리  ",
      "피노 누아  ",
      "코다 디 볼페   ",
    ],
    country: [
      "프랑스",
      "이탈리아",
      "미국",
      "독일",
      "칠레",
      "호주",
      "그리스",
      "레바논",
      "스페인",
      "캐나다",
      "헝가리",
      "뉴질랜드",
      "루마니아",
      "이스라엘",
      "포르투갈",
      "남아프리카",
      "아르헨티나",
    ],
    pairing: [
      "소고기",
      "돼지고기",
      "닭/오리",
      "양고기",
      "생선",
      "해산물",
      "건육",
      "채소/샐러드",
      "튀김",
      "치즈",
      "과일/건과일",
      "디저트",
      "한식",
      "중식",
      "양식",
      "아시아음식",
      "견과",
    ],
  };

  const categories = [
    { key: "type", label: "종류", icon: "type.png" },
    { key: "grape", label: "품종", icon: "grape.png" },
    { key: "taste", label: "맛", icon: "taste.png" },
    { key: "country", label: "국가", icon: "country.png" },
    { key: "price", label: "가격", icon: "price.png" },
    { key: "pairing", label: "페어링", icon: "pairing.png" },
  ];

  const toggleOption = (category: keyof typeof filterOptions, value: string) => {
    const current = filter.filters[category];
    let action = "";
    if (Array.isArray(current)) {
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      action = current.includes(value) ? "remove" : "add";
      onChange({
        ...filter,
        page: 1,
        filters: {
          ...filter.filters,
          [category]: updated,
        },
      });
      // 이벤트 추적: 필터 옵션 토글
      trackEvent("filter_change", { filter_type: category, value, action });
    }
  };

  const handlePriceRangeChange = (newMin: number, newMax: number) => {
    const min = Math.min(newMin, newMax);
    const max = Math.max(newMin, newMax);
    onChange({
      ...filter,
      page: 1,
      filters: {
        ...filter.filters,
        minPrice: min,
        maxPrice: max,
      },
    });
    // 이벤트 추적: 가격 필터 변경
    trackEvent("filter_change", { filter_type: "price", min, max });
  };

  const handleTasteRangeChange = (
    minKey: keyof typeof filter.filters,
    maxKey: keyof typeof filter.filters,
    newMin: number,
    newMax: number
  ) => {
    const min = Math.min(newMin, newMax);
    const max = Math.max(newMin, newMax);
    onChange({
      ...filter,
      page: 1,
      filters: {
        ...filter.filters,
        [minKey]: min,
        [maxKey]: max,
      },
    });
    // 이벤트 추적: 맛(당도, 산도, 바디, 타닌) 필터 변경
    trackEvent("filter_change", { filter_type: "taste", taste_filter: { [minKey]: min, [maxKey]: max } });
  };

  const tasteFields: {
    label: string;
    minKey: keyof Pick<WineFilter["filters"], "minSweetness" | "minAcidity" | "minBody" | "minTannin">;
    maxKey: keyof Pick<WineFilter["filters"], "maxSweetness" | "maxAcidity" | "maxBody" | "maxTannin">;
  }[] = [
    { label: "당도", minKey: "minSweetness", maxKey: "maxSweetness" },
    { label: "산도", minKey: "minAcidity", maxKey: "maxAcidity" },
    { label: "바디", minKey: "minBody", maxKey: "maxBody" },
    { label: "타닌", minKey: "minTannin", maxKey: "maxTannin" },
  ];

  const hasAnyFilter = Object.entries(filter.filters).some(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (key === "minPrice" && value !== 0) return true;
    if (key === "maxPrice" && value !== 1500000) return true;
    if (key.startsWith("min") || key.startsWith("max")) {
      const defaultRange = { min: 0, max: 5 };
      return (
        (key.startsWith("min") && value !== defaultRange.min) || (key.startsWith("max") && value !== defaultRange.max)
      );
    }
    return false;
  });

  return (
    <div style={styles.bar}>
      <div style={styles.tabRow}>
        {categories.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => {
              // 탭 전환 이벤트 추적
              trackEvent("filter_tab_change", { tab: key });
              setOpenFilter(openFilter === key ? null : key);
            }}
            style={{
              ...styles.tabButton,
              ...(openFilter === key ? styles.activeTab : {}),
            }}
          >
            <img src={require(`../assets/icons/filtericons/${icon}`)} alt={label} style={styles.icon} />
            {label}
          </button>
        ))}
      </div>

      {openFilter && (
        <div style={styles.dropdown}>
          {openFilter === "price" && (
            <div style={styles.tasteBox}>
              <div style={styles.tasteRow}>
                <div style={styles.tasteLabel}>가격</div>
                <div style={styles.sliderGroup}>
                  <input
                    type="range"
                    min={0}
                    max={1500000}
                    step={10000}
                    value={filter.filters.minPrice}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), filter.filters.maxPrice)}
                    style={styles.slider}
                  />
                  <input
                    type="range"
                    min={0}
                    max={300000}
                    step={1000}
                    value={filter.filters.maxPrice}
                    onChange={(e) => handlePriceRangeChange(filter.filters.minPrice, Number(e.target.value))}
                    style={styles.slider}
                  />
                </div>
                <span style={styles.priceRangeLabel}>
                  최소 {filter.filters.minPrice.toLocaleString()} 원 ~<br /> 최대{" "}
                  {filter.filters.maxPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          )}
          {openFilter === "grape" && (
            <div style={styles.scrollBox}>
              <input
                type="text"
                placeholder="품종 검색"
                value={grapeSearch}
                onChange={(e) => setGrapeSearch(e.target.value)}
                style={styles.searchInput}
              />
              {filterOptions.grape
                .filter((g) => g.includes(grapeSearch))
                .map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleOption("grape", option)}
                    style={filter.filters.grape.includes(option) ? styles.activeOption : styles.option}
                  >
                    {option}
                  </button>
                ))}
            </div>
          )}

          {openFilter === "taste" && (
            <div style={styles.tasteBox}>
              {tasteFields.map(({ label, minKey, maxKey }) => {
                const min = filter.filters[minKey as keyof typeof filter.filters] as number;
                const max = filter.filters[maxKey as keyof typeof filter.filters] as number;
                return (
                  <div key={label} style={styles.tasteRow}>
                    <div style={styles.tasteLabel}>{label}</div>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      value={min}
                      onChange={(e) => handleTasteRangeChange(minKey, maxKey, Number(e.target.value), max)}
                      style={styles.slider}
                    />
                    <input
                      type="range"
                      min={0}
                      max={5}
                      value={max}
                      onChange={(e) => handleTasteRangeChange(minKey, maxKey, min, Number(e.target.value))}
                      style={styles.slider}
                    />
                    <span style={styles.rangeLabel}>
                      {min} ~ {max}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {openFilter === "country" && (
            <div style={styles.scrollBox}>
              <input
                type="text"
                placeholder="국가 검색"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                style={styles.searchInput}
              />
              {filterOptions.country
                .filter((c) => c.includes(countrySearch))
                .map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleOption("country", option)}
                    style={filter.filters.country.includes(option) ? styles.activeOption : styles.option}
                  >
                    {option}
                  </button>
                ))}
            </div>
          )}

          {openFilter !== "price" && openFilter !== "taste" && openFilter !== "country" && openFilter !== "grape" && (
            <>
              {(filterOptions as any)[openFilter].map((option: string) => (
                <button
                  key={option}
                  onClick={() => toggleOption(openFilter as keyof typeof filterOptions, option)}
                  style={
                    (filter.filters[openFilter as keyof typeof filterOptions] as string[]).includes(option)
                      ? styles.activeOption
                      : styles.option
                  }
                >
                  {option}
                </button>
              ))}
            </>
          )}
        </div>
      )}
      {/* 선택된 필터 태그 리스트 */}
      {hasAnyFilter && (
        <div style={styles.selectedFiltersWrapper}>
          {Object.entries(filter.filters).flatMap(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              return value.map((v) => (
                <span key={`${key}-${v}`} style={styles.filterTag}>
                  {v}{" "}
                  <button
                    style={styles.closeButton}
                    onClick={() => {
                      const updated = value.filter((item) => item !== v);
                      onChange({
                        ...filter,
                        page: 1,
                        filters: {
                          ...filter.filters,
                          [key]: updated,
                        },
                      });
                    }}
                  >
                    ×
                  </button>
                </span>
              ));
            }

            if (
              (key === "minSweetness" || key === "minAcidity" || key === "minBody" || key === "minTannin") &&
              typeof value === "number"
            ) {
              const maxKey = key.replace("min", "max") as keyof typeof filter.filters;
              const maxValue = filter.filters[maxKey] as number;
              if (value !== 0 || maxValue !== 5) {
                const tasteLabelMap: { [key: string]: string } = {
                  minSweetness: "당도",
                  minAcidity: "산도",
                  minBody: "바디",
                  minTannin: "타닌",
                };
                return [
                  <span key={`${key}-taste`} style={styles.filterTag}>
                    {tasteLabelMap[key]} {value} ~ {maxValue}
                    <button
                      style={styles.closeButton}
                      onClick={() => {
                        onChange({
                          ...filter,
                          page: 1,
                          filters: {
                            ...filter.filters,
                            [key]: 0,
                            [maxKey]: 5,
                          },
                        });
                      }}
                    >
                      ×
                    </button>
                  </span>,
                ];
              }
            }

            if (key === "minPrice" && typeof value === "number") {
              const maxValue = filter.filters.maxPrice;
              if (!(value === 0 && maxValue === 1500000000)) {
                return [
                  <span key="price-range" style={styles.filterTag}>
                    <span style={styles.priceRangeLabel}>{value.toLocaleString()}원</span>
                    <span style={styles.priceRangeLabel}>~</span>
                    <span style={styles.priceRangeLabel}>{maxValue.toLocaleString()}원</span>
                    <button
                      style={styles.closeButton}
                      onClick={() => {
                        onChange({
                          ...filter,
                          page: 1,
                          filters: {
                            ...filter.filters,
                            minPrice: 0,
                            maxPrice: 1500000000,
                          },
                        });
                      }}
                    >
                      ×
                    </button>
                  </span>,
                ];
              }
            }

            return [];
          })}
        </div>
      )}
    </div>
  );
};

export default WineFilterBar;

const styles: { [key: string]: React.CSSProperties } = {
  bar: {
    backgroundColor: "#2A0E35",
    borderRadius: "1.1vh", // 10px ≒ 1.1vh
    padding: "1.1vh", // 10px ≒ 1.1vh
    marginBottom: "1.8vh", // 16px ≒ 1.8vh
  },
  tabRow: {
    display: "flex",
    justifyContent: "space-around",
  },
  tabButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    fontSize: "1.6vh", // 14px ≒ 1.6vh
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "5.6vh", // 50px ≒ 5.6vh
    padding: "0.9vh 0.4vh", // 8px 4px ≒ 0.9vh 0.4vh
    gap: "0.22vh", // 2px ≒ 0.22vh
    borderRadius: "0.6vh", // 5px ≒ 0.6vh
    transition: "all 0.2s ease-in-out",
  },
  activeTab: {
    backgroundColor: "#3b0b40",
    color: "#fefefe",
    fontWeight: "bold",
  },
  icon: {
    width: "40%",
    height: "45%",
    marginBottom: "0.4vh", // 4px ≒ 0.4vh
  },
  dropdown: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.9vh", // 8px ≒ 0.9vh
    padding: "2.2vh 0", // 20px 0 ≒ 2.2vh 0
    backgroundColor: "#3b0b40",
    justifyContent: "center",
    borderRadius: "1.1vh", // 10px ≒ 1.1vh
  },
  scrollBox: {
    maxHeight: "16.7vh", // 150px ≒ 16.7vh
    overflowY: "auto",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.9vh", // 8px ≒ 0.9vh
    justifyContent: "center",
    padding: "1.1vh 0", // 10px 0 ≒ 1.1vh 0
    backgroundColor: "#3b0b40",
    borderRadius: "0.9vh", // 8px ≒ 0.9vh
  },
  option: {
    padding: "0.7vh 1.1vh", // 6px 10px ≒ 0.7vh 1.1vh
    backgroundColor: "transparent",
    color: "white",
    border: "0.11vh solid #fefefe", // 1px ≒ 0.11vh
    borderRadius: "1.7vh", // 15px ≒ 1.7vh
    cursor: "pointer",
  },
  activeOption: {
    padding: "0.7vh 1.1vh", // 6px 10px ≒ 0.7vh 1.1vh
    backgroundColor: "#5a1a5e",
    color: "#fefefe",
    border: "0.11vh solid white", // 1px ≒ 0.11vh
    borderRadius: "1.7vh", // 15px ≒ 1.7vh
    cursor: "pointer",
  },
  rangeBox: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9vh", // 8px ≒ 0.9vh
    alignItems: "center",
    marginBottom: "1.1vh", // 10px ≒ 1.1vh
  },
  tasteBox: {
    display: "flex",
    flexDirection: "column",
    gap: "1.3vh", // 12px ≒ 1.3vh
    alignItems: "flex-start",
  },
  tasteRow: {
    display: "flex",
    alignItems: "center",
    gap: "1.1vh", // 10px ≒ 1.1vh
  },
  tasteLabel: {
    minWidth: "4.4vh", // 40px ≒ 4.4vh
    color: "white",
    paddingLeft: "2.2vh", // 20px ≒ 2.2vh
  },
  slider: {
    width: "100%",
  },
  rangeLabel: {
    color: "white",
    fontSize: "1.3vh", // 12px ≒ 1.3vh
    minWidth: "4.4vh", // 40px ≒ 4.4vh
    margin: "0px 1.1vh", // 0px 10px ≒ 0 1.1vh
  },
  priceRangeLabel: {
    color: "white",
    fontSize: "1.3vh", // 12px ≒ 1.3vh
    minWidth: "13.3vh", // 120px ≒ 13.3vh
    margin: "0px 1.1vh", // 0px 10px ≒ 0 1.1vh
  },
  numberInput: {
    width: "6.7vh", // 60px ≒ 6.7vh
    padding: "0.4vh", // 4px ≒ 0.4vh
    margin: "0 0.4vh", // 0 4px ≒ 0 0.4vh
    borderRadius: "0.4vh", // 4px ≒ 0.4vh
    border: "0.11vh solid #ccc", // 1px ≒ 0.11vh
    textAlign: "center",
  },
  searchInput: {
    width: "80%",
    padding: "0.7vh 1.1vh", // 6px 10px ≒ 0.7vh 1.1vh
    marginBottom: "0.9vh", // 8px ≒ 0.9vh
    borderRadius: "0.9vh", // 8px ≒ 0.9vh
    border: "0.11vh solid #ccc", // 1px ≒ 0.11vh
    textAlign: "center",
    backgroundColor: "#2a0e35",
    color: "white",
  },
  selectedFiltersWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.67vh", // 6px ≒ 0.67vh
    marginTop: "1.1vh", // 10px ≒ 1.1vh
  },
  filterTag: {
    backgroundColor: "#5a1a5e",
    color: "white",
    padding: "0.44vh 0.89vh", // 4px 8px ≒ 0.44vh 0.89vh
    borderRadius: "1.3vh", // 12px ≒ 1.3vh
    display: "flex",
    alignItems: "center",
    fontSize: "1.3vh", // 12px ≒ 1.3vh
  },
  priceTag: {
    backgroundColor: "#8d2a8e",
    color: "white",
    padding: "0.44vh 1.1vh", // 4px 10px ≒ 0.44vh 1.1vh
    borderRadius: "1.6vh", // 14px ≒ 1.6vh
    fontSize: "1.3vh", // 12px ≒ 1.3vh
    display: "flex",
    gap: "0.67vh", // 6px ≒ 0.67vh
    alignItems: "center",
  },
  closeButton: {
    background: "transparent",
    border: "none",
    color: "white",
    marginLeft: "0.67vh", // 6px ≒ 0.67vh
    fontWeight: "bold",
    cursor: "pointer",
  },
};
