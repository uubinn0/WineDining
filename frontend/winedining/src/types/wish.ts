import { Wine } from "./wine";

// 위시 리스트 타입
export interface WishItem {
  id: number;
  createdAt: string;
  wine: Wine;
}

// 위시리스트 전체 응답
export interface WishListResponse {
  wishes: WishItem[];
  totalCount: number;
}
