#[tauri::command]
pub async fn open_file(path: String) -> Result<(), String> {
    tauri_plugin_opener::open_path(path, None::<&str>)
        .map_err(|e| e.to_string())
}