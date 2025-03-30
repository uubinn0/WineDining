import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchWineNotes, createWineNote, updateWineNote, deleteWineNote } from "../../api/noteApi";
import { Bottle, WineNote, WineNoteRequest } from "../../types/note";

// 노트 상태 타입
interface NoteState {
  bottle: Bottle | null;
  notes: WineNote[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NoteState = {
  bottle: null,
  notes: [],
  status: "idle",
  error: null,
};

// 노트 조회
export const fetchNotes = createAsyncThunk<{ bottle: Bottle; notes: WineNote[] }, number, { rejectValue: string }>(
  "note/fetchNotes",
  async (bottleId, { rejectWithValue }) => {
    try {
      const data = await fetchWineNotes(bottleId);
      return data;
    } catch (error) {
      return rejectWithValue("노트 조회 실패");
    }
  }
);

// 노트 추가
export const addNote = createAsyncThunk<WineNote, { bottleId: number; note: WineNoteRequest }, { rejectValue: string }>(
  "note/addNote",
  async ({ bottleId, note }, { rejectWithValue }) => {
    try {
      const data = await createWineNote(bottleId, note);
      return data.notes[data.notes.length - 1]; // 마지막으로 추가된 노트
    } catch (error) {
      return rejectWithValue("노트 등록 실패");
    }
  }
);

// 노트 수정
export const editNote = createAsyncThunk<WineNote, { noteId: number; note: WineNoteRequest }, { rejectValue: string }>(
  "note/editNote",
  async ({ noteId, note }, { rejectWithValue }) => {
    try {
      const updatedNote = await updateWineNote(noteId, note);
      return updatedNote;
    } catch (error) {
      return rejectWithValue("노트 수정 실패");
    }
  }
);

// 노트 삭제
export const removeNote = createAsyncThunk<number, number, { rejectValue: string }>(
  "note/removeNote",
  async (noteId, { rejectWithValue }) => {
    try {
      await deleteWineNote(noteId);
      return noteId;
    } catch (error) {
      return rejectWithValue("노트 삭제 실패");
    }
  }
);

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    resetNoteState: (state) => {
      state.bottle = null;
      state.notes = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 조회
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        console.log("노트 패치됨!", action.payload); // 노트 확인용
        state.status = "succeeded";
        state.bottle = action.payload.bottle;
        state.notes = action.payload.notes.map((note) => ({
          ...note,
          bottleId: action.payload.bottle.bottleId,
        }));
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "노트 조회 실패";
      })

      // 추가
      .addCase(addNote.fulfilled, (state, action: PayloadAction<WineNote>) => {
        state.notes.push(action.payload);
        if (state.bottle) {
          state.bottle.totalNote += 1;
        }
      })

      // 수정
      .addCase(editNote.fulfilled, (state, action: PayloadAction<WineNote>) => {
        const index = state.notes.findIndex((n) => n.noteId === action.payload.noteId);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })

      // 삭제
      .addCase(removeNote.fulfilled, (state, action: PayloadAction<number>) => {
        state.notes = state.notes.filter((n) => n.noteId !== action.payload);
        if (state.bottle) {
          state.bottle.totalNote -= 1;
        }
      });
  },
});

export const { resetNoteState } = noteSlice.actions;
export default noteSlice.reducer;
