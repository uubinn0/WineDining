import { Wine, WineFilter } from "../types/wine";

// 와인 더미 데이터
let mockWines: Wine[] = [
  {
    id: 1,
    name: "샤토 마고",
    type: "레드",
    country: "프랑스",
    price: 250000,
    year: 2018,
    sweet: 2,
    acidic: 4,
    body: 5,
  },
  {
    id: 2,
    name: "사시카이아",
    type: "레드",
    country: "이탈리아",
    price: 180000,
    year: 2016,
    sweet: 1,
    acidic: 3,
    body: 4,
  },
  {
    id: 3,
    name: "모엣샹동",
    type: "스파클링",
    country: "프랑스",
    price: 75000,
    year: 2019,
    sweet: 3,
    acidic: 5,
    body: 3,
  },
  {
    id: 4,
    name: "오승열",
    type: "스파클링",
    country: "대한민국",
    price: 111275000,
    year: 1997,
    sweet: 5,
    acidic: 5,
    body: 5,
  },
  {
    id: 5,
    name: "나유빈",
    type: "화이트",
    country: "대만",
    price: 1231199888,
    year: 1998,
    sweet: 5,
    acidic: 5,
    body: 5,
  },
  {
    id: 6,
    name: "정다인",
    type: "레드",
    country: "스위스",
    price: 75000,
    year: 2000,
    sweet: 4,
    acidic: 5,
    body: 5,
  },
  {
    id: 7,
    name: "류현",
    type: "레드",
    country: "일본",
    price: 75000,
    year: 1998,
    sweet: 4,
    acidic: 4,
    body: 5,
  },
  {
    id: 8,
    name: "김승윤",
    type: "스파클링",
    country: "독일",
    price: 175000,
    year: 1998,
    sweet: 5,
    acidic: 5,
    body: 3,
  },
  {
    id: 9,
    name: "신동운",
    type: "로제",
    country: "미국",
    price: 275000,
    year: 1999,
    sweet: 5,
    acidic: 2,
    body: 5,
  },
];

// 가짜 api 받아오기
export const postMockWine = async (wine: Wine) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newWine = { id: mockWines.length + 1, ...wine };
      mockWines.push(newWine);
      resolve(newWine);
    }, 1000);
  });
};

// 필터링된 와인
export const fetchFilteredWines = async (filter?: WineFilter) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredWines = [...mockWines];

      // 필터 없을때
      if (!filter) {
        resolve(filteredWines);
        return;
      }

      // 필터 있을때 검색 기능
      if (filter.filters.min_price && filter.filters.max_price) {
        filteredWines = filteredWines.filter(
          (wine) => wine.price >= filter.filters.min_price && wine.price <= filter.filters.max_price
        );
      }

      if (filter.filters.min_year && filter.filters.max_year) {
        filteredWines = filteredWines.filter(
          (wine) => wine.year >= filter.filters.min_year && wine.year <= filter.filters.max_year
        );
      }

      if (filter.filters.min_sweet && filter.filters.max_sweet) {
        filteredWines = filteredWines.filter(
          (wine) => wine.sweet >= filter.filters.min_sweet && wine.sweet <= filter.filters.max_sweet
        );
      }

      if (filter.filters.min_acidic && filter.filters.max_acidic) {
        filteredWines = filteredWines.filter(
          (wine) => wine.acidic >= filter.filters.min_acidic && wine.acidic <= filter.filters.max_acidic
        );
      }

      if (filter.filters.min_body && filter.filters.max_body) {
        filteredWines = filteredWines.filter(
          (wine) => wine.body >= filter.filters.min_body && wine.body <= filter.filters.max_body
        );
      }

      if (filter.filters.country && filter.filters.country.length > 0) {
        filteredWines = filteredWines.filter((wine) => filter.filters.country.includes(wine.country));
      }

      // 정렬 적용
      if (filter.sort) {
        const field = filter.sort.field as keyof Wine;
        filteredWines.sort((a, b) => {
          const aValue = a[field];
          const bValue = b[field];

          if (typeof aValue === "number" && typeof bValue === "number") {
            return filter.sort.order === "asc" ? aValue - bValue : bValue - aValue;
          } else if (typeof aValue === "string" && typeof bValue === "string") {
            return filter.sort.order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
          }
          return 0;
        });
      }

      // 페이지네이션
      if (filter.page && filter.limit) {
        const startIndex = (filter.page - 1) * filter.limit;
        filteredWines = filteredWines.slice(startIndex, startIndex + filter.limit);
      }

      resolve(filteredWines);
    }, 1000);
  });
};
