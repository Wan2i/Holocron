import { invoke } from "@tauri-apps/api/core";
import type { Notes } from "../types/notes";

export function getNotes(): Promise<Notes[]> {
  return invoke("get_notes");
}

export function createNotes(s_id:number, chapter: number, name: string, file_path: string) : Promise<Notes[]> {
    return invoke("create_notes", {s_id, chapter, name, file_path});
}

export function updateNotes(n_id: number, s_id:number, chapter: number, name: string, file_path: string ) : Promise<Notes> {
    return invoke("update_notes", {n_id, s_id, chapter, name, file_path} );
}

export function deleteNotes(n_id: number) : Promise<void>{
    return invoke("delete_notes", {n_id});
}