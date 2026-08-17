use std::sync::Mutex;
use rusqlite::{Connection};
use tauri::State;
use crate::models::category::Category;

#[tauri::command]
pub fn get_category(conn: State<Mutex<Connection>>) -> Result<Vec<Category>, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT C_ID, CATEGORY FROM CATEGORY")
        .map_err(|e| e.to_string())?;

    let result: Vec<Category> = stmt
        .query_map([], |row| {
            Ok(Category {
                c_id: row.get("C_ID")?,
                category: row.get("CATEGORY")?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(result)
}