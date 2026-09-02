import { invoke  } from "@tauri-apps/api/core";
import type { Category } from "../types/category";

export function getCategory(): Promise<Category[]>{
    return invoke("get_category");
}
