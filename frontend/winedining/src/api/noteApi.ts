import axios from "axios";
import { WineNoteResponse, WineNoteRequest, WineNote, WineNoteSingleResponse } from "../types/note";

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

// 노트 조회
export const fetchWineNotes = async (bottleId: number): Promise<WineNoteResponse["data"]> => {
  const response = await api.get(`/v1/collection/note/${bottleId}`);
  return response.data.data;
};

// 노트 등록
export const createWineNote = async (bottleId: number, note: WineNoteRequest): Promise<WineNoteResponse["data"]> => {
  const response = await api.post(`/v1/collection/note/${bottleId}`, note);
  return response.data.data;
};

// 노트 수정
export const updateWineNote = async (noteId: number, note: WineNoteRequest): Promise<WineNote> => {
  const response = await api.put(`/v1/collection/note/${noteId}`, note);
  return response.data.data;
};

// 노트 삭제
export const deleteWineNote = async (noteId: number): Promise<void> => {
  await api.delete(`/v1/collection/note/${noteId}`);
};
