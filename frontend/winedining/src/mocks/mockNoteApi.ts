// // mocks/mockNoteApi.ts

// import { WineNote } from "../types/note";

// let mockNotes: WineNote[] = [];
// let noteIdCounter = 1;

// // ✅ 전체 조회 (bottle_id 기준)
// export const fetchMockNotes = async (bottleId: number) => {
//   return new Promise<{ notes: WineNote[] }>((resolve) => {
//     setTimeout(() => {
//       const filtered = mockNotes.filter((note) => note.bottle_id === bottleId);
//       resolve({ notes: filtered });
//     }, 500);
//   });
// };

// // ✅ 저장
// export const postMockNote = async (
//   bottleId: number,
//   noteData: Omit<WineNote, "note_id" | "created_at" | "bottle_id">
// ) => {
//   return new Promise<WineNote>((resolve) => {
//     setTimeout(() => {
//       const newNote: WineNote = {
//         ...noteData,
//         note_id: noteIdCounter++,
//         created_at: new Date().toISOString(),
//         bottle_id: bottleId,
//       };
//       mockNotes.push(newNote);
//       resolve(newNote);
//     }, 500);
//   });
// };

// // ✅ 수정
// export const updateMockNote = async (noteId: number, updatedData: Partial<WineNote>) => {
//   return new Promise<WineNote>((resolve, reject) => {
//     setTimeout(() => {
//       const index = mockNotes.findIndex((note) => note.note_id === noteId);
//       if (index === -1) return reject("노트를 찾을 수 없음");
//       mockNotes[index] = { ...mockNotes[index], ...updatedData };
//       resolve(mockNotes[index]);
//     }, 500);
//   });
// };

// // ✅ 삭제
// export const deleteMockNote = async (noteId: number) => {
//   return new Promise<number>((resolve, reject) => {
//     setTimeout(() => {
//       const originalLength = mockNotes.length;
//       mockNotes = mockNotes.filter((note) => note.note_id !== noteId);
//       if (mockNotes.length === originalLength) return reject("삭제 실패");
//       resolve(noteId);
//     }, 500);
//   });
// };

// // 전체 노트 다 가져오기
// export const fetchAllMockNotes = async () => {
//   return new Promise<{ notes: WineNote[] }>((resolve) => {
//     setTimeout(() => {
//       resolve({ notes: mockNotes });
//     }, 500);
//   });
// };
