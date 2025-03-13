// 와인 데이터 타입
export interface Wine {
  id?: number;
  name: string;
  type: string;
  country: string;
  price: number;
  year: number;
  sweet: number;
  acidic: number;
  body: number;
}

// 와인 필터링 데이터 타입
export interface WineFilter {
  keyword: string;
  filters: {
    type_id: number[];
    country: string[];
    min_price: number;
    max_price: number;
    min_year: number;
    max_year: number;
    min_sweet: number;
    max_sweet: number;
    min_acidic: number;
    max_acidic: number;
    min_body: number;
    max_body: number;
  };
  sort: {
    field: string;
    order: string;
  };
  page: number;
  limit: number;
}
