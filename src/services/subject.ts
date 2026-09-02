import { invoke } from "@tauri-apps/api/core";
import type { Subject } from "../types/subject";

export function getSubjects(): Promise<Subject[]> {
  return invoke("get_subjects");
}

export function createSubject(code: string, name: string, color: string): Promise<Subject> {
  return invoke("create_subject", { code, name, color });
}

export function updateSubject(sId: number, code: string, name: string, color: string): Promise<Subject> {
  return invoke("update_subject", { sId, code, name, color });
}

export function deleteSubject(sId: number): Promise<void> {
  return invoke("delete_subject", { sId });
}