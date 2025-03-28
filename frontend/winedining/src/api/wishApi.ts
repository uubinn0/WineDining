import axios from "axios";
import { WishItem, WishListResponse } from "../types/wish";

// baseURL이 제대로 설정되었는지 확인하고, 필요한 경우 /api를 추가
const baseURL = process.env.REACT_APP_API_BASE_URL?.endsWith("/api")
  ? process.env.REACT_APP_API_BASE_URL
  : `${process.env.REACT_APP_API_BASE_URL}/api`;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 전체 위시리스트 조회
export const fetchWishlist = async (): Promise<WishListResponse> => {
  const response = await api.get("/v1/collection/wish");
  return response.data.data;
};

// 위시리스트 추가
export const addWishlist = async (wineId: number): Promise<WishItem> => {
  const response = await api.post(`/v1/collection/wish/${wineId}`);
  return response.data.data;
};

// 위시리스트 제거
export const removeWishlist = async (wineId: number): Promise<number> => {
  await api.delete(`/v1/collection/wish/${wineId}`);
  return wineId;
};
