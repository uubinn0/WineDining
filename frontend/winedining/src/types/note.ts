// export interface Wine {
//   wineId: number;
//   image: string;
//   name: string;
//   type: string;
//   country: string;
//   grape: string;
// }

import { Wine } from "./wine";

// 셀러에 등록된 와인 정보
export interface Bottle {
  bottleId: number;
  createdAt: string;
  wine: Wine;
  isCustom: boolean;
  isBest: boolean;
  totalNote: number;
}

// 노트 정보
export interface WineNote {
  noteId: number;
  who: string;
  when: string;
  pairing: string[];
  nose: string;
  content: string;
  rating: number;
  image: string[];
  createdAt: string;
}

// 노트 응답 타입
export interface WineNoteResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    bottle: Bottle;
    notes: WineNote[];
  };
}

// 노트 작성/수정 타입
export interface WineNoteRequest {
  who: string;
  when: string;
  pairing: string[];
  nose: string;
  content: string;
  rating: number;
  image: string[];
}

// 노트 수정 응답 타입
export interface WineNoteSingleResponse {
  status: number;
  success: boolean;
  message: string;
  data: WineNote;
}
