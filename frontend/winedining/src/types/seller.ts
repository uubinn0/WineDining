// 와인(셀러) 데이터 타입
// export interface Wine {
//   wineId: number;
//   image: string;
//   name: string;
//   type: string;
//   country: string;
//   grape: string;
// }

import { Wine } from "./wine";

// 와인 셀러 응답 타입
export interface WineCellarResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    bottleId: number;
    createdAt: string;
    wine: Wine;
    custom: boolean;
    best: boolean;
    totalCount: number;
  };
}

// 와인 셀러 등록 타입
export interface WineRegistrationResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    bottleId: number;
    createdAt: string;
    wine: Wine;
  };
}

// Bottle 타입
export interface Bottle {
  bottleId: number;
  createdAt: string;
  wine: Wine;
  custom: boolean;
  best: boolean;
}

// best 와인 타입
export interface WineCellarBestResponse {
  bottles: Bottle[];
  totalCount: number;
}
