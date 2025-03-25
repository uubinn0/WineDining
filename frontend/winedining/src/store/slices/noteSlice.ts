// store/slices/noteslice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WineNote } from "../../types/note";
import * as mockNoteApi from "../../mocks/mockNoteApi";

interface NoteState {
  notes: WineNote[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  status: "idle",
  error: null,
};

// 전체 조회 (특정 bottleId)
export const fetchNotes = createAsyncThunk<WineNote[], number, { rejectValue: string }>(
  "note/fetchNotes",
  async (bottleId, { rejectWithValue }) => {
    try {
      const response = await mockNoteApi.fetchMockNotes(bottleId);
      return response.notes;
    } catch (error) {
      return rejectWithValue("노트 조회 실패");
    }
  }
);

// 저장
export const createNote = createAsyncThunk<
  WineNote,
  { bottleId: number; note: Omit<WineNote, "note_id" | "created_at" | "bottle_id"> },
  { rejectValue: string }
>("note/createNote", async ({ bottleId, note }, { rejectWithValue }) => {
  try {
    const response = await mockNoteApi.postMockNote(bottleId, note);
    return response as WineNote;
  } catch (error) {
    return rejectWithValue("노트 저장 실패");
  }
});

// 수정
export const updateNote = createAsyncThunk<
  WineNote,
  { noteId: number; updatedNote: Partial<WineNote> },
  { rejectValue: string }
>("note/updateNote", async ({ noteId, updatedNote }, { rejectWithValue }) => {
  try {
    const response = await mockNoteApi.updateMockNote(noteId, updatedNote);
    return response as WineNote;
  } catch (error) {
    return rejectWithValue("노트 수정 실패");
  }
});

// 삭제
export const deleteNote = createAsyncThunk<number, number, { rejectValue: string }>(
  "note/deleteNote",
  async (noteId, { rejectWithValue }) => {
    try {
      await mockNoteApi.deleteMockNote(noteId);
      return noteId;
    } catch (error) {
      return rejectWithValue("노트 삭제 실패");
    }
  }
);

// 전체 노트 조회 thunk
export const fetchAllNotes = createAsyncThunk<WineNote[], void, { rejectValue: string }>(
  "note/fetchAllNotes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockNoteApi.fetchAllMockNotes();
      return response.notes;
    } catch (error) {
      return rejectWithValue("전체 노트 조회 실패");
    }
  }
);

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "노트 조회 실패";
      })

      .addCase(createNote.fulfilled, (state, action: PayloadAction<WineNote>) => {
        state.notes.push(action.payload);
      })

      .addCase(updateNote.fulfilled, (state, action: PayloadAction<WineNote>) => {
        const index = state.notes.findIndex((note) => note.note_id === action.payload.note_id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })

      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<number>) => {
        state.notes = state.notes.filter((note) => note.note_id !== action.payload);
      })

      .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<WineNote[]>) => {
        state.status = "succeeded";
        const incomingNotes = action.payload;
        const existingIds = new Set(state.notes.map((n) => n.note_id));
        const uniqueNewNotes = incomingNotes.filter((n) => !existingIds.has(n.note_id));
        state.notes = [...state.notes, ...uniqueNewNotes];
      });
  },
});

export default noteSlice.reducer;
