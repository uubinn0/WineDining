import { Wine, WineFilter, WineListResponse, WineDetail } from "../types/wine";
import axios from "axios";

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

console.log("최종 API 주소:", baseURL);

// 필터로 와인 가져오기
export const fetchFilteredWines = async (filter: WineFilter): Promise<WineListResponse> => {
  try {
    console.log("보내는 필터:", filter);
    const response = await api.post("/v1/product", filter);
    console.log("받은 응답:", response);
    return response.data.data;
  } catch (error) {
    console.error("와인 리스트 불러오기 실패:", error);
    throw error;
  }
};

// 와인 상세보기
export const fetchWineDetail = async (wineId: number): Promise<WineDetail> => {
  try {
    const response = await api.get(`/v1/product/${wineId}`);
    return response.data.data;
  } catch (error) {
    console.log("와인 상세보기 실패", error);
    throw error;
  }
};
