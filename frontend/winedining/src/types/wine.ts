// 단일 데이터 타입
export interface Wine {
  wineId: number;
  name: string;
  typeName: string;
  country: string;
  grape: string;
  wish: boolean;
  image?: string;
}

// 와인 리스트 응답 타입
export interface WineListResponse {
  wines: Wine[];
  totalCount: number;
  page: number;
  totalPages: number;
  limit: number;
}

// 와인 필터링 데이터 타입
export interface WineFilter {
  keyword: string;
  filters: {
    type: string[]; // 와인 타입
    grape: string[]; // 포도 품종
    country: string[]; // 국가
    minPrice: number;
    maxPrice: number;
    minSweetness: number;
    maxSweetness: number;
    minAcidity: number;
    maxAcidity: number;
    minTannin: number;
    maxTannin: number;
    minBody: number;
    maxBody: number;
    pairing: string[]; // 음식 페어링
  };
  sort: {
    field: "price" | "sweetness" | "acidity" | "tannin" | "body" | "alcohol_content" | "krName";
    order: "asc" | "desc";
  };
  page: number;
  limit: number;
}

// 와인 상세보기
export interface WineDetail {
  wineId: number;
  krName: string;
  enName: string;
  image: string;
  type: string;
  country: string;
  grape: string;
  price: number;
  sweetness: number;
  acidity: number;
  tannin: number;
  body: number;
  alcoholContent: number;
  pairing: string[];
}
