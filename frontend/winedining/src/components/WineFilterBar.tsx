import React, { useState } from "react";
import { WineFilter } from "../types/wine";

interface WineFilterBarProps {
  filter: WineFilter;
  onChange: (newFilter: WineFilter) => void;
}

const WineFilterBar = ({ filter, onChange }: WineFilterBarProps) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  // 단일 선택형 필터 (array)
  const filterOptions = {
    type: ["레드", "화이트", "로제", "스파클링"],
    grape: ["쉬라즈", "모스카토", "카베르네 소비뇽"],
    country: ["프랑스", "이탈리아", "미국"],
    pairing: ["소고기", "치즈", "과일/건과일"],
  };

  // 카테고리 목록 (가격, 맛 추가)
  const categories = [
    { key: "type", label: "종류" },
    { key: "grape", label: "품종" },
    { key: "country", label: "국가" },
    { key: "pairing", label: "페어링" },
    { key: "price", label: "가격" },
    { key: "taste", label: "맛" },
  ];

  // 배열 필터 토글 (type/grape/country/pairing)
  const toggleOption = (category: keyof typeof filterOptions, value: string) => {
    const current = filter.filters[category];
    if (Array.isArray(current)) {
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

      onChange({
        ...filter,
        page: 1,
        filters: {
          ...filter.filters,
          [category]: updated,
        },
      });
    }
  };

  // 가격/맛 입력 핸들러
  const handlePriceChange = (minOrMax: "minPrice" | "maxPrice", newValue: number) => {
    onChange({
      ...filter,
      page: 1,
      filters: {
        ...filter.filters,
        [minOrMax]: newValue,
      },
    });
  };

  const handleTasteChange = (
    field:
      | "minSweetness"
      | "maxSweetness"
      | "minAcidity"
      | "maxAcidity"
      | "minTannin"
      | "maxTannin"
      | "minBody"
      | "maxBody",
    newValue: number
  ) => {
    onChange({
      ...filter,
      page: 1,
      filters: {
        ...filter.filters,
        [field]: newValue,
      },
    });
  };

  // 렌더링 로직
  return (
    <div style={styles.bar}>
      {/* 탭 */}
      <div style={styles.tabRow}>
        {categories.map(({ key, label }) => (
          <button key={key} onClick={() => setOpenFilter(openFilter === key ? null : key)} style={styles.tabButton}>
            {label}
          </button>
        ))}
      </div>

      {/* 드롭다운 */}
      {openFilter && (
        <div style={styles.dropdown}>
          {/* 만약 openFilter가 price/taste면 별도 UI 렌더 */}
          {openFilter === "price" && (
            <div style={styles.rangeBox}>
              <div>
                <label>최소가격</label>
                <input
                  type="number"
                  value={filter.filters.minPrice}
                  onChange={(e) => handlePriceChange("minPrice", Number(e.target.value))}
                  style={styles.numberInput}
                />
              </div>
              <div>
                <label>최대가격</label>
                <input
                  type="number"
                  value={filter.filters.maxPrice}
                  onChange={(e) => handlePriceChange("maxPrice", Number(e.target.value))}
                  style={styles.numberInput}
                />
              </div>
            </div>
          )}

          {openFilter === "taste" && (
            <div style={styles.rangeBox}>
              <div>
                <label>단 (Sweetness)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={filter.filters.minSweetness}
                  onChange={(e) => handleTasteChange("minSweetness", Number(e.target.value))}
                  style={styles.numberInput}
                />
                ~
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={filter.filters.maxSweetness}
                  onChange={(e) => handleTasteChange("maxSweetness", Number(e.target.value))}
                  style={styles.numberInput}
                />
              </div>
              <div>
                <label>산 (Acidity)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={filter.filters.minAcidity}
                  onChange={(e) => handleTasteChange("minAcidity", Number(e.target.value))}
                  style={styles.numberInput}
                />
                ~
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={filter.filters.maxAcidity}
                  onChange={(e) => handleTasteChange("maxAcidity", Number(e.target.value))}
                  style={styles.numberInput}
                />
              </div>
              <div>
                <label>타 (Tannin)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={filter.filters.minTannin}
                  onChange={(e) => handleTasteChange("minTannin", Number(e.target.value))}
                  style={styles.numberInput}
                />
                ~
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={filter.filters.maxTannin}
                  onChange={(e) => handleTasteChange("maxTannin", Number(e.target.value))}
                  style={styles.numberInput}
                />
              </div>
              <div>
                <label>바 (Body)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={filter.filters.minBody}
                  onChange={(e) => handleTasteChange("minBody", Number(e.target.value))}
                  style={styles.numberInput}
                />
                ~
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={filter.filters.maxBody}
                  onChange={(e) => handleTasteChange("maxBody", Number(e.target.value))}
                  style={styles.numberInput}
                />
              </div>
            </div>
          )}

          {/* 그렇지 않으면 기존 array 필터 */}
          {openFilter in filterOptions && (
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
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  bar: {
    backgroundColor: "#3b0b40",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "16px",
  },
  tabRow: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "10px",
  },
  tabButton: {
    background: "none",
    color: "white",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
  },
  dropdown: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
  },
  option: {
    padding: "6px 10px",
    backgroundColor: "#5a1a5e",
    color: "white",
    border: "1px solid #d4b27a",
    borderRadius: "8px",
    cursor: "pointer",
  },
  activeOption: {
    padding: "6px 10px",
    backgroundColor: "#d4b27a",
    color: "#2a0e35",
    border: "1px solid white",
    borderRadius: "8px",
    cursor: "pointer",
  },
  rangeBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    margin: "0 auto",
    maxWidth: "400px",
    width: "100%",
    alignItems: "center",
    marginBottom: "10px",
  },
  numberInput: {
    width: "60px",
    padding: "4px",
    marginLeft: "4px",
    marginRight: "4px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
};

export default WineFilterBar;
