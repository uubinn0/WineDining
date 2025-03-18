// 와인 데이터 타입
export interface Wine {
  wine_id: number; // 와인 ID
  kr_name: string; // 한국어 이름
  en_name: string; // 영어 이름
  image: string | "no_image"; // 이미지 (없으면 "no_image")
  type: string; // 와인 종류 (레드, 화이트, 스파클링 등)
  country: string; // 생산 국가
  grape: string; // 포도 품종
  price: number | null; // 가격
  sweetness: number; // 당도 (1~5)
  acidity: number; // 산도 (1~5)
  tannin: number; // 타닌 (1~5, 화이트/스파클링은 0)
  body: number; // 바디감 (1~5)
  alcohol_content: number | null; // 도수 (소수점 가능)
  pairing: string[] | null; // 추천 음식 (배열, 최소 2개)
  create_at: string; // 생성 날짜 (ISO 형식)
}

// 와인 필터링 데이터 타입
export interface WineFilter {
  keyword: string;
  filters: {
    type: string[]; // 와인 종류 필터 (레드, 화이트 등)
    country: string[]; // 국가 필터
    pairing: string[];
    min_price: number;
    max_price: number;
    min_sweetness: number;
    max_sweetness: number;
    min_acidity: number;
    max_acidity: number;
    min_tannin: number;
    max_tannin: number;
    min_body: number;
    max_body: number;
    min_alcohol_content: number;
    max_alcohol_content: number;
  };
  sort: {
    field: "price" | "sweetness" | "acidity" | "tannin" | "body" | "alcohol_content";
    order: "asc" | "desc";
  };
  page: number;
  limit: number;
}
