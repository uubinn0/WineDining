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
  isCustom: boolean;
  isBest: boolean;
  totalNote: number;
}

// best 와인 타입
export interface WineCellarBestResponse {
  bottles: Bottle[];
  totalCount: number;
}

// 커스텀 와인 타입
export interface CustomWine {
  wineId: number;
  name: string;
  type: string;
  country: string;
  grape: string;
}

// 커스텀 와인 등록 요청
export interface CustomWineRegistrationRequest {
  name: string;
  typeId: number;
  country: string;
  grape: string;
}

// 커스텀 와인 등록 응답
export interface CustomWineRegistrationResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    bottleId: number;
    createdAt: string;
    wine: Wine;
  };
}
