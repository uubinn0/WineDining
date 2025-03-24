// types/note.ts

import { Wine } from "./wine";

export interface WineNote {
  note_id: number;
  bottle_id: number;
  who: string;
  when: string;
  pairing: string[];
  nose: string;
  content: string;
  rating: number;
  image: string[];
  created_at: string;
}

export interface Bottle {
  bottle_id: number;
  created_at: string;
  wine: Wine;
  is_custom: boolean;
  is_best: boolean;
  total_note: number;
}

export interface NoteState {
  bottle: Bottle | null;
  notes: WineNote[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
