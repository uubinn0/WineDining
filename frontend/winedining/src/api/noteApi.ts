import axios from "axios";
import { WineNoteResponse, WineNoteRequest, WineNote, WineNoteSingleResponse } from "../types/note";

// baseURL 제거 → proxy 설정 적용됨
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// console.log("최종 API 주소:", baseURL);

// 노트 조회
export const fetchWineNotes = async (bottleId: number): Promise<WineNoteResponse["data"]> => {
  const response = await api.get(`/api/v1/collection/note/${bottleId}`);
  return response.data.data;
};

// 노트 등록
export const createWineNote = async (bottleId: number, note: WineNoteRequest): Promise<WineNoteResponse["data"]> => {
  const response = await api.post(`/api/v1/collection/note/${bottleId}`, note);
  return response.data.data;
};

// 노트 수정
export const updateWineNote = async (noteId: number, note: WineNoteRequest): Promise<WineNote> => {
  const response = await api.put(`/api/v1/collection/note/${noteId}`, note);
  return response.data.data;
};

// 노트 삭제
export const deleteWineNote = async (noteId: number): Promise<void> => {
  await api.delete(`/api/v1/collection/note/${noteId}`);
};
