import { invoke } from "@tauri-apps/api/core";
import type { Task } from "../types/task";

export function getTask(): Promise<Task[]>{
    return invoke("get_task");
}

export function createTask(title: string, due_date: string, completed: number, s_id: number, c_id: number): Promise<void>{
    return invoke("create_task", {title, due_date, completed, s_id, c_id })
}

export function updateTask(t_id: number, title: string, due_date: string, completed: number, s_id: number, c_id: number): Promise<void>{
    return invoke("update_task", {t_id, title, due_date, completed, s_id, c_id })
}

export function deleteTask(t_id: number): Promise<void>{
    return invoke("delete_task", {t_id})
}