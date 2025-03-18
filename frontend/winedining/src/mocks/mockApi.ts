import { Wine, WineFilter } from "../types/wine";

// 와인 더미 데이터
let mockWines: Wine[] = [
  {
    wine_id: 1,
    kr_name: "샤토 마고",
    en_name: "Château Margaux",
    type: "레드",
    country: "프랑스",
    price: 250000,
    sweetness: 2,
    acidity: 4,
    body: 5,
    tannin: 4,
    alcohol_content: 13.5,
    grape: "카베르네 소비뇽",
    pairing: ["스테이크", "양고기"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 2,
    kr_name: "사시카이아",
    en_name: "Sassicaia",
    type: "레드",
    country: "이탈리아",
    price: 180000,
    sweetness: 1,
    acidity: 3,
    body: 4,
    tannin: 3,
    alcohol_content: 14,
    grape: "메를로",
    pairing: ["파스타", "치즈"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 3,
    kr_name: "모엣샹동",
    en_name: "Moët & Chandon",
    type: "스파클링",
    country: "프랑스",
    price: 75000,
    sweetness: 3,
    acidity: 5,
    body: 3,
    tannin: 2,
    alcohol_content: 12.5,
    grape: "샤르도네",
    pairing: ["해산물", "과일"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 4,
    kr_name: "오승열",
    en_name: "Oh Seung-Yeol Special",
    type: "스파클링",
    country: "대한민국",
    price: 111275000,
    sweetness: 5,
    acidity: 5,
    body: 5,
    tannin: 1,
    alcohol_content: null,
    grape: "알 수 없음",
    pairing: ["추천 없음"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 5,
    kr_name: "나유빈",
    en_name: "Na Yu-Bin Selection",
    type: "화이트",
    country: "대만",
    price: 1231199888,
    sweetness: 5,
    acidity: 5,
    body: 5,
    tannin: 4,
    alcohol_content: 11.5,
    grape: "리슬링",
    pairing: ["닭고기", "샐러드"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 6,
    kr_name: "정다인",
    en_name: "Jeong Da-In Red",
    type: "레드",
    country: "스위스",
    price: 75000,
    sweetness: 4,
    acidity: 5,
    body: 5,
    tannin: 3,
    alcohol_content: 13,
    grape: "피노 누아",
    pairing: ["치즈", "파스타"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 7,
    kr_name: "류현",
    en_name: "Ryu Hyun Signature",
    type: "레드",
    country: "일본",
    price: 75000,
    sweetness: 4,
    acidity: 4,
    body: 5,
    tannin: 2,
    alcohol_content: null,
    grape: "알 수 없음",
    pairing: ["추천 없음"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 8,
    kr_name: "김승윤",
    en_name: "Kim Seung-Yoon Sparkling",
    type: "스파클링",
    country: "독일",
    price: 175000,
    sweetness: 5,
    acidity: 5,
    body: 3,
    tannin: 5,
    alcohol_content: 12,
    grape: "샤르도네",
    pairing: ["디저트", "해산물"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 9,
    kr_name: "신동운",
    en_name: "Shin Dong-Woon Rosé",
    type: "로제",
    country: "미국",
    price: 275000,
    sweetness: 5,
    acidity: 2,
    body: 5,
    tannin: 2,
    alcohol_content: 13.5,
    grape: "그르나슈",
    pairing: ["샐러드", "치즈"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 10,
    kr_name: "베가 시실리아",
    en_name: "Vega Sicilia",
    type: "레드",
    country: "스페인",
    price: 310000,
    sweetness: 3,
    acidity: 3,
    body: 4,
    tannin: 4,
    alcohol_content: 14,
    grape: "템프라니요",
    pairing: ["스테이크", "바베큐"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 11,
    kr_name: "샤또 라피트",
    en_name: "Château Lafite Rothschild",
    type: "레드",
    country: "프랑스",
    price: 500000,
    sweetness: 2,
    acidity: 4,
    body: 5,
    tannin: 5,
    alcohol_content: 14,
    grape: "카베르네 소비뇽",
    pairing: ["스테이크", "양고기", "치즈"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 12,
    kr_name: "바롱 필립",
    en_name: "Baron Philippe",
    type: "화이트",
    country: "프랑스",
    price: 90000,
    sweetness: 3,
    acidity: 4,
    body: 3,
    tannin: 3,
    alcohol_content: 12.5,
    grape: "샤르도네",
    pairing: ["해산물", "치즈", "과일"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 13,
    kr_name: "도멘 르로이",
    en_name: "Domaine Leroy",
    type: "레드",
    country: "프랑스",
    price: 220000,
    sweetness: 2,
    acidity: 4,
    body: 5,
    tannin: 4,
    alcohol_content: 13.5,
    grape: "피노 누아",
    pairing: ["바베큐", "오리고기", "치즈"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 14,
    kr_name: "토리브레오",
    en_name: "Toribreo",
    type: "레드",
    country: "이탈리아",
    price: 195000,
    sweetness: 2,
    acidity: 4,
    body: 4,
    tannin: 3,
    alcohol_content: 14.5,
    grape: "산지오베제",
    pairing: ["파스타", "양고기", "치즈"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 15,
    kr_name: "프리오라트",
    en_name: "Priorat",
    type: "레드",
    country: "스페인",
    price: 200000,
    sweetness: 3,
    acidity: 3,
    body: 4,
    tannin: 4,
    alcohol_content: 14,
    grape: "가르나차",
    pairing: ["스테이크", "양고기", "바베큐"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 16,
    kr_name: "호주 쉬라즈",
    en_name: "Australian Shiraz",
    type: "레드",
    country: "호주",
    price: 130000,
    sweetness: 2,
    acidity: 4,
    body: 5,
    tannin: 4,
    alcohol_content: 14.5,
    grape: "쉬라즈",
    pairing: ["바베큐", "스테이크", "치즈"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 17,
    kr_name: "산타 리타",
    en_name: "Santa Rita",
    type: "화이트",
    country: "칠레",
    price: 85000,
    sweetness: 4,
    acidity: 3,
    body: 3,
    tannin: 1,
    alcohol_content: 12,
    grape: "소비뇽 블랑",
    pairing: ["샐러드", "해산물", "과일"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 18,
    kr_name: "도멘 바롱",
    en_name: "Domaine Baron",
    type: "로제",
    country: "프랑스",
    price: 125000,
    sweetness: 3,
    acidity: 3,
    body: 4,
    tannin: 2,
    alcohol_content: 13,
    grape: "그르나슈",
    pairing: ["치즈", "샐러드", "해산물"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 19,
    kr_name: "프란시스코 토레스",
    en_name: "Francisco Torres",
    type: "스파클링",
    country: "스페인",
    price: 145000,
    sweetness: 5,
    acidity: 5,
    body: 3,
    tannin: 2,
    alcohol_content: 11.5,
    grape: "샤르도네",
    pairing: ["디저트", "해산물", "과일"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 20,
    kr_name: "로버트 몬다비",
    en_name: "Robert Mondavi",
    type: "레드",
    country: "미국",
    price: 180000,
    sweetness: 3,
    acidity: 4,
    body: 4,
    tannin: 4,
    alcohol_content: 13.5,
    grape: "카베르네 소비뇽",
    pairing: ["스테이크", "바베큐", "치즈"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 21,
    kr_name: "하디스 노틸러스",
    en_name: "Hardy's Nautilus",
    type: "화이트",
    country: "뉴질랜드",
    price: 95000,
    sweetness: 4,
    acidity: 4,
    body: 3,
    tannin: 4,
    alcohol_content: 12.5,
    grape: "소비뇽 블랑",
    pairing: ["해산물", "치즈 플래터"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 22,
    kr_name: "도멘 드 라 로마네",
    en_name: "Domaine de la Romanée",
    type: "레드",
    country: "프랑스",
    price: 275000,
    sweetness: 2,
    acidity: 4,
    body: 5,
    tannin: 4,
    alcohol_content: 14.5,
    grape: "피노 누아",
    pairing: ["스테이크", "트러플 파스타"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 23,
    kr_name: "스파클링 장 뤽",
    en_name: "Sparkling Jean-Luc",
    type: "스파클링",
    country: "프랑스",
    price: 85000,
    sweetness: 4,
    acidity: 4,
    body: 3,
    tannin: 5,
    alcohol_content: 11.5,
    grape: "샤르도네, 피노 누아",
    pairing: ["굴", "초밥"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 24,
    kr_name: "다니엘 라루",
    en_name: "Daniel Larue",
    type: "화이트",
    country: "프랑스",
    price: 115000,
    sweetness: 3,
    acidity: 4,
    body: 4,
    tannin: 5,
    alcohol_content: 12.0,
    grape: "리슬링",
    pairing: ["구운 닭고기", "크림 파스타"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 25,
    kr_name: "크리스털",
    en_name: "Cristal",
    type: "스파클링",
    country: "프랑스",
    price: 320000,
    sweetness: 3,
    acidity: 5,
    body: 4,
    tannin: 5,
    alcohol_content: 12.5,
    grape: "피노 누아, 샤르도네",
    pairing: ["캐비아", "랍스터"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 26,
    kr_name: "리델 로제",
    en_name: "Riedel Rosé",
    type: "로제",
    country: "독일",
    price: 99000,
    sweetness: 4,
    acidity: 3,
    body: 3,
    tannin: 2,
    alcohol_content: 12.0,
    grape: "그르나슈",
    pairing: ["연어", "치즈 플래터"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 27,
    kr_name: "스텔라 벨",
    en_name: "Stella Bell",
    type: "레드",
    country: "이탈리아",
    price: 155000,
    sweetness: 2,
    acidity: 4,
    body: 4,
    tannin: 5,
    alcohol_content: 14.0,
    grape: "산지오베제",
    pairing: ["소고기 스튜", "치즈 피자"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 28,
    kr_name: "샤또 오브리옹",
    en_name: "Château Haut-Brion",
    type: "레드",
    country: "프랑스",
    price: 275000,
    sweetness: 3,
    acidity: 4,
    body: 5,
    tannin: 5,
    alcohol_content: 14.5,
    grape: "카베르네 소비뇽",
    pairing: ["양갈비", "포르치니 리조또"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 29,
    kr_name: "보르도 블랑",
    en_name: "Bordeaux Blanc",
    type: "화이트",
    country: "프랑스",
    price: 135000,
    sweetness: 3,
    acidity: 4,
    body: 3,
    tannin: 3,
    alcohol_content: 12.5,
    grape: "소비뇽 블랑",
    pairing: ["샐러드", "구운 연어"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 30,
    kr_name: "나파 밸리 까베르네",
    en_name: "Napa Valley Cabernet",
    type: "레드",
    country: "미국",
    price: 250000,
    sweetness: 2,
    acidity: 3,
    body: 5,
    tannin: 5,
    alcohol_content: 15.0,
    grape: "카베르네 소비뇽",
    pairing: ["바베큐 립", "버섯 리조또"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 31,
    kr_name: "투핸즈 쉐이퍼",
    en_name: "Two Hands Shaper",
    type: "레드",
    country: "호주",
    price: 175000,
    sweetness: 2,
    acidity: 3,
    body: 4,
    tannin: 5,
    alcohol_content: 14.5,
    grape: "쉬라즈",
    pairing: ["바베큐", "스테이크"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 32,
    kr_name: "산타 크리스티나",
    en_name: "Santa Cristina",
    type: "레드",
    country: "이탈리아",
    price: 95000,
    sweetness: 3,
    acidity: 4,
    body: 4,
    tannin: 4,
    alcohol_content: 13.0,
    grape: "산지오베제",
    pairing: ["토마토 파스타", "브루스케타"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 33,
    kr_name: "도멘 빌라쥬",
    en_name: "Domaine Village",
    type: "화이트",
    country: "프랑스",
    price: 135000,
    sweetness: 4,
    acidity: 4,
    body: 3,
    tannin: 2,
    alcohol_content: 12.5,
    grape: "샤르도네",
    pairing: ["해산물", "치즈 플래터"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 34,
    kr_name: "베린저 메를로",
    en_name: "Beringer Merlot",
    type: "레드",
    country: "미국",
    price: 120000,
    sweetness: 2,
    acidity: 3,
    body: 5,
    tannin: 4,
    alcohol_content: 14.0,
    grape: "메를로",
    pairing: ["바베큐 치킨", "크림 스튜"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 35,
    kr_name: "루이 라투르 알리고떼",
    en_name: "Louis Latour Aligoté",
    type: "화이트",
    country: "프랑스",
    price: 110000,
    sweetness: 3,
    acidity: 5,
    body: 3,
    tannin: 1,
    alcohol_content: 12.0,
    grape: "알리고떼",
    pairing: ["굴", "샐러드"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 36,
    kr_name: "펜폴즈 그랜지",
    en_name: "Penfolds Grange",
    type: "레드",
    country: "호주",
    price: 450000,
    sweetness: 2,
    acidity: 3,
    body: 5,
    tannin: 5,
    alcohol_content: 14.5,
    grape: "쉬라즈",
    pairing: ["양갈비", "훈제 오리"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 37,
    kr_name: "토레스 그란 코로냐스",
    en_name: "Torres Gran Coronas",
    type: "레드",
    country: "스페인",
    price: 180000,
    sweetness: 3,
    acidity: 4,
    body: 4,
    tannin: 4,
    alcohol_content: 14.0,
    grape: "카베르네 소비뇽",
    pairing: ["스테이크", "블랙페퍼 스테이크"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 38,
    kr_name: "리츠링거 리슬링",
    en_name: "Ritzlinger Riesling",
    type: "화이트",
    country: "독일",
    price: 125000,
    sweetness: 5,
    acidity: 5,
    body: 3,
    tannin: 3,
    alcohol_content: 11.0,
    grape: "리슬링",
    pairing: ["타이 음식", "스시"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 39,
    kr_name: "파이퍼 하이직",
    en_name: "Piper-Heidsieck",
    type: "스파클링",
    country: "프랑스",
    price: 200000,
    sweetness: 3,
    acidity: 4,
    body: 4,
    tannin: 4,
    alcohol_content: 12.5,
    grape: "피노 누아, 샤르도네",
    pairing: ["캐비아", "크러스트 피자"],
    image: "/sample_image/wine_sample.jpg",
    create_at: new Date().toISOString(),
  },
  {
    wine_id: 40,
    kr_name: "샤또 무통 로칠드",
    en_name: "Château Mouton Rothschild",
    type: "레드",
    country: "프랑스",
    price: 520000,
    sweetness: 2,
    acidity: 3,
    body: 5,
    tannin: 5,
    alcohol_content: 14.5,
    grape: "카베르네 소비뇽",
    pairing: ["트러플 스테이크", "포르치니 리조또"],
    image: "no_image",
    create_at: new Date().toISOString(),
  },
];

// 특정 와인 조회 (GET)
export const fetchMockWine = async (wineId: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const wine = mockWines.find((w) => w.wine_id === wineId); // 변경된 wine_id 적용
      if (!wine) {
        reject("해당 와인이 존재하지 않습니다.");
        return;
      }
      resolve(wine);
    }, 500);
  });
};

// 와인 추가 (POST)
export const postMockWine = async (wine: Wine) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { wine_id, ...wineData } = wine; // 기존 ID 제거
      const newWine = { wine_id: mockWines.length + 1, ...wineData }; // 새 ID 부여
      mockWines.push(newWine);
      resolve(newWine);
    }, 1000);
  });
};

// 필터링된 와인 조회 (GET)
export const fetchFilteredWines = async (filter?: WineFilter) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredWines = [...mockWines];

      if (!filter) {
        resolve(filteredWines);
        return;
      }

      // 가격 필터링 (가격이 존재하는 경우만 비교)
      if (filter.filters.min_price !== undefined && filter.filters.max_price !== undefined) {
        filteredWines = filteredWines.filter(
          (wine) =>
            wine.price !== null && wine.price >= filter.filters.min_price && wine.price <= filter.filters.max_price
        );
      }

      // 맛 관련 필터링
      if (filter.filters.min_sweetness !== undefined && filter.filters.max_sweetness !== undefined) {
        filteredWines = filteredWines.filter(
          (wine) => wine.sweetness >= filter.filters.min_sweetness && wine.sweetness <= filter.filters.max_sweetness
        );
      }

      if (filter.filters.min_acidity !== undefined && filter.filters.max_acidity !== undefined) {
        filteredWines = filteredWines.filter(
          (wine) => wine.acidity >= filter.filters.min_acidity && wine.acidity <= filter.filters.max_acidity
        );
      }

      if (filter.filters.min_body !== undefined && filter.filters.max_body !== undefined) {
        filteredWines = filteredWines.filter(
          (wine) => wine.body >= filter.filters.min_body && wine.body <= filter.filters.max_body
        );
      }

      // 와인 종류 필터링
      if (filter.filters.type && filter.filters.type.length > 0) {
        filteredWines = filteredWines.filter((wine) => filter.filters.type.includes(wine.type));
      }

      // 국가 필터링
      if (filter.filters.country && filter.filters.country.length > 0) {
        filteredWines = filteredWines.filter((wine) => filter.filters.country.includes(wine.country));
      }

      // 추천 음식 필터링
      if (filter.filters.pairing && filter.filters.pairing.length > 0) {
        filteredWines = filteredWines.filter(
          (wine) => wine.pairing !== null && wine.pairing.some((food) => filter.filters.pairing.includes(food))
        );
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

      // 페이지네이션 적용
      if (filter.page && filter.limit) {
        const startIndex = (filter.page - 1) * filter.limit;
        filteredWines = filteredWines.slice(startIndex, startIndex + filter.limit);
      }

      resolve(filteredWines);
    }, 1000);
  });
};

// 위시리스트 데이터
let mockWishList: { id: number; created_at: string; wine: Wine }[] = [];

// 위시리스트 조회 (GET)
export const fetchMockWishList = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ wishes: mockWishList, total_count: mockWishList.length });
    }, 500);
  });
};

// 위시리스트 추가 (POST)
export const addMockWish = async (wineId: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const wine = mockWines.find((w) => w.wine_id === wineId); // wine_id로 변경
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

// 위시리스트 삭제 (DELETE)
export const removeMockWish = async (wineId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockWishList = mockWishList.filter((wish) => wish.wine.wine_id !== wineId); // wine_id로 변경
      resolve(wineId);
    }, 500);
  });
};

// 모든 와인 목록 조회 (GET)
export const fetchMockWines = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockWines);
    }, 500);
  });
};
