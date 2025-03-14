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
  { id: 6, name: "정다인", type: "레드", country: "스위스", price: 75000, year: 2000, sweet: 4, acidic: 5, body: 5 },
  { id: 7, name: "류현", type: "레드", country: "일본", price: 75000, year: 1998, sweet: 4, acidic: 4, body: 5 },
  { id: 8, name: "김승윤", type: "스파클링", country: "독일", price: 175000, year: 1998, sweet: 5, acidic: 5, body: 3 },
  { id: 9, name: "신동운", type: "로제", country: "미국", price: 275000, year: 1999, sweet: 5, acidic: 2, body: 5 },
  {
    id: 10,
    name: "베가 시실리아",
    type: "레드",
    country: "스페인",
    price: 310000,
    year: 2015,
    sweet: 3,
    acidic: 3,
    body: 4,
  },
  {
    id: 11,
    name: "샤또 라피트",
    type: "레드",
    country: "프랑스",
    price: 500000,
    year: 2017,
    sweet: 2,
    acidic: 4,
    body: 5,
  },
  {
    id: 12,
    name: "바롱 필립",
    type: "화이트",
    country: "프랑스",
    price: 90000,
    year: 2016,
    sweet: 3,
    acidic: 4,
    body: 3,
  },
  {
    id: 13,
    name: "도멘 르로이",
    type: "레드",
    country: "프랑스",
    price: 220000,
    year: 2018,
    sweet: 2,
    acidic: 4,
    body: 5,
  },
  {
    id: 14,
    name: "토리브레오",
    type: "레드",
    country: "이탈리아",
    price: 195000,
    year: 2020,
    sweet: 2,
    acidic: 4,
    body: 4,
  },
  {
    id: 15,
    name: "프리오라트",
    type: "레드",
    country: "스페인",
    price: 200000,
    year: 2019,
    sweet: 3,
    acidic: 3,
    body: 4,
  },
  {
    id: 16,
    name: "호주 쉬라즈",
    type: "레드",
    country: "호주",
    price: 130000,
    year: 2015,
    sweet: 2,
    acidic: 4,
    body: 5,
  },
  {
    id: 17,
    name: "산타 리타",
    type: "화이트",
    country: "칠레",
    price: 85000,
    year: 2016,
    sweet: 4,
    acidic: 3,
    body: 3,
  },
  {
    id: 18,
    name: "도멘 바롱",
    type: "로제",
    country: "프랑스",
    price: 125000,
    year: 2018,
    sweet: 3,
    acidic: 3,
    body: 4,
  },
  {
    id: 19,
    name: "프란시스코 토레스",
    type: "스파클링",
    country: "스페인",
    price: 145000,
    year: 2017,
    sweet: 5,
    acidic: 5,
    body: 3,
  },
  {
    id: 20,
    name: "로버트 몬다비",
    type: "레드",
    country: "미국",
    price: 180000,
    year: 2020,
    sweet: 3,
    acidic: 4,
    body: 4,
  },
  {
    id: 21,
    name: "하디스 노틸러스",
    type: "화이트",
    country: "뉴질랜드",
    price: 95000,
    year: 2019,
    sweet: 4,
    acidic: 4,
    body: 3,
  },
  {
    id: 22,
    name: "도멘 드 라 로마네",
    type: "레드",
    country: "프랑스",
    price: 275000,
    year: 2017,
    sweet: 2,
    acidic: 4,
    body: 5,
  },
  {
    id: 23,
    name: "스파클링 장 뤽",
    type: "스파클링",
    country: "프랑스",
    price: 85000,
    year: 2018,
    sweet: 4,
    acidic: 4,
    body: 3,
  },
  {
    id: 24,
    name: "다니엘 라루",
    type: "화이트",
    country: "프랑스",
    price: 115000,
    year: 2016,
    sweet: 3,
    acidic: 4,
    body: 4,
  },
  {
    id: 25,
    name: "크리스털",
    type: "스파클링",
    country: "프랑스",
    price: 320000,
    year: 2015,
    sweet: 3,
    acidic: 5,
    body: 4,
  },
  { id: 26, name: "리델 로제", type: "로제", country: "독일", price: 99000, year: 2019, sweet: 4, acidic: 3, body: 3 },
  {
    id: 27,
    name: "스텔라 벨",
    type: "레드",
    country: "이탈리아",
    price: 155000,
    year: 2020,
    sweet: 2,
    acidic: 4,
    body: 4,
  },
  {
    id: 28,
    name: "샤또 오브리옹",
    type: "레드",
    country: "프랑스",
    price: 275000,
    year: 2016,
    sweet: 3,
    acidic: 4,
    body: 5,
  },
  {
    id: 29,
    name: "보르도 블랑",
    type: "화이트",
    country: "프랑스",
    price: 135000,
    year: 2018,
    sweet: 3,
    acidic: 4,
    body: 3,
  },
];

// 가짜 api 받아오기
export const postMockWine = async (wine: Wine) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { id, ...wineData } = wine; // ✅ 기존 id 제거
      const newWine = { id: mockWines.length + 1, ...wineData }; // ✅ 새로운 id 추가
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

// ✅ 새로운 위시리스트 데이터 추가
let mockWishList: { id: number; created_at: string; wine: Wine }[] = [];

// ✅ 위시리스트 조회 (GET)
export const fetchMockWishList = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ wishes: mockWishList, total_count: mockWishList.length });
    }, 500);
  });
};

// ✅ 위시리스트 추가 (POST)
export const addMockWish = async (wineId: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const wine = mockWines.find((w) => w.id === wineId);
      if (!wine) {
        reject("해당 와인이 존재하지 않습니다.");
        return;
      }
      const newWish = { id: Date.now(), created_at: new Date().toISOString(), wine };
      mockWishList.push(newWish);
      resolve(newWish);
    }, 500);
  });
};

// ✅ 위시리스트 삭제 (DELETE)
export const removeMockWish = async (wineId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockWishList = mockWishList.filter((wish) => wish.wine.id !== wineId);
      resolve(wineId);
    }, 500);
  });
};
