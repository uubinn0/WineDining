import axios from "axios";
import { WishItem, WishListResponse } from "../types/wish";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// 전체 위시리스트 조회
export const fetchWishlist = async (): Promise<WishListResponse> => {
  const response = await api.get("/api/v1/collection/wish");
  return response.data.data;
};

// 위시리스트 추가
export const addWishlist = async (wineId: number): Promise<WishItem> => {
  const response = await api.post(`/api/v1/collection/wish/${wineId}`);
  return response.data.data;
};

// 위시리스트 제거
export const removeWishlist = async (wineId: number): Promise<number> => {
  await api.delete(`/api/v1/collection/wish/${wineId}`);
  return wineId;
};
