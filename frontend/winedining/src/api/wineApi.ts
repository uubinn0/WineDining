import { Wine, WineFilter, WineListResponse, WineDetail } from "../types/wine";
import api from "./axios"; // Import the configured axios instance

// 필터로 와인 가져오기
export const fetchFilteredWines = async (filter: WineFilter): Promise<WineListResponse> => {
  try {
    const response = await api.post("/v1/product", filter);
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
