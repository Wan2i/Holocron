use std::sync::Mutex;
use tauri::Manager;

mod commands;
mod database;
mod models;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let conn = database::connection::get_connection(&app.handle())?;
            app.manage(Mutex::new(conn));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            // subject
            commands::subject::get_subjects,
            commands::subject::create_subject,
            commands::subject::update_subject,
            commands::subject::delete_subject,
            // notes
            commands::notes::get_notes, 
            commands::notes::create_notes, 
            commands::notes::update_notes, 
            commands::notes::delete_notes,
            // task 
            commands::task::get_task,
            commands::task::create_task,
            commands::task::update_task,
            commands::task::delete_task,
            // category
            commands::category::get_category,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
