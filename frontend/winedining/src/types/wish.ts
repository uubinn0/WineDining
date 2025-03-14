import { Wine } from "./wine"; // 기존 와인 타입 불러오기

// 위시리스트 항목 타입
export interface Wish {
  id: number;
  created_at: string;
  wine: Wine;
}

// 위시리스트 응답 타입
export interface WishlistResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    wishes: Wish[];
    total_count: number;
  };
}

// 위시리스트 추가 타입
export interface WishAddResponse {
  status: number;
  success: boolean;
  message: string;
  data: Wish;
}
