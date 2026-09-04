import { invoke } from "@tauri-apps/api/core";
import type { Task } from "../types/task";

export function getTask(): Promise<Task[]>{
    return invoke("get_task");
}

export function createTask(title: string, dueDate: string, completed: number, sId: number, cId: number): Promise<void>{
    return invoke("create_task", {title, dueDate, completed, sId, cId })
}

export function updateTask(tId: number, title: string, dueDate: string, completed: number, sId: number, cId: number): Promise<Task>{
    return invoke("update_task", {tId, title, dueDate, completed, sId, cId })
}

export function deleteTask(tId: number): Promise<void>{
    return invoke("delete_task", {tId})
}