import { invoke } from "@tauri-apps/api/core";
import type { Notes } from "../types/notes";

export function getNotes(): Promise<Notes[]> {
    return invoke("get_notes");
}

export function createNotes(sId: number, chapter: number, name: string, filePath: string): Promise<Notes> {
    return invoke("create_notes", { sId, chapter, name, filePath });
}

export function updateNotes(nId: number, sId: number, chapter: number, name: string, filePath: string): Promise<Notes> {
    return invoke("update_notes", { nId, sId, chapter, name, filePath });
}

export function deleteNotes(nId: number): Promise<void> {
    return invoke("delete_notes", { nId });
}