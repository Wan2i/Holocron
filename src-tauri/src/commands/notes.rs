use std::sync::Mutex;
use rusqlite::{Connection, params};
use tauri::State;
use crate::models::notes::Notes;

#[tauri::command]
pub fn get_notes(conn: State<Mutex<Connection>>) -> Result<Vec<Notes>, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT N_ID, S_ID, CHAPTER, NAME, FILE_PATH, CREATED_AT, UPDATED_AT FROM NOTES")
        .map_err(|e| e.to_string())?;

    let result: Vec<Notes> = stmt
        .query_map([], |row| {
            Ok(Notes {
                n_id: row.get("N_ID")?,
                s_id: row.get("S_ID")?,
                chapter: row.get("CHAPTER")?,
                name: row.get("NAME")?,
                file_path: row.get("FILE_PATH")?,
                created_at: row.get("CREATED_AT")?,
                updated_at: row.get("UPDATED_AT")?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(result)
}

#[tauri::command]
pub fn create_notes(
    conn: State<Mutex<Connection>>,
    s_id: i64,
    chapter: i64,
    name: String,
    file_path: String,
) -> Result<Notes, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO NOTES (S_ID, CHAPTER, NAME, FILE_PATH) VALUES (?1, ?2, ?3, ?4)",
        params![s_id, chapter, name, file_path],
    )
    .map_err(|e| e.to_string())?;

    let new_id = conn.last_insert_rowid();

    conn.query_row(
        "SELECT N_ID, S_ID, CHAPTER, NAME, FILE_PATH, CREATED_AT, UPDATED_AT FROM NOTES WHERE N_ID = ?1",
        params![new_id],
        |row| {
            Ok(Notes {
                n_id: row.get("N_ID")?,
                s_id: row.get("S_ID")?,
                chapter: row.get("CHAPTER")?,
                name: row.get("NAME")?,
                file_path: row.get("FILE_PATH")?,
                created_at: row.get("CREATED_AT")?,
                updated_at: row.get("UPDATED_AT")?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_notes(
    conn: State<Mutex<Connection>>,
    n_id: i64,
    s_id: i64,
    chapter: i64,
    name: String,
    file_path: String,
) -> Result<Notes, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let rows_affected = conn
        .execute(
            "UPDATE NOTES
             SET S_ID = ?1, CHAPTER = ?2, NAME = ?3, FILE_PATH = ?4, UPDATED_AT = CURRENT_TIMESTAMP
             WHERE N_ID = ?5",
            params![s_id, chapter, name, file_path, n_id],
        )
        .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err(format!("No note found with N_ID {}", n_id));
    }

    conn.query_row(
        "SELECT N_ID, S_ID, CHAPTER, NAME, FILE_PATH, CREATED_AT, UPDATED_AT FROM NOTES WHERE N_ID = ?1",
        params![n_id],
        |row| {
            Ok(Notes {
                n_id: row.get("N_ID")?,
                s_id: row.get("S_ID")?,
                chapter: row.get("CHAPTER")?,
                name: row.get("NAME")?,
                file_path: row.get("FILE_PATH")?,
                created_at: row.get("CREATED_AT")?,
                updated_at: row.get("UPDATED_AT")?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_notes(conn: State<Mutex<Connection>>, n_id: i64) -> Result<(), String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let rows_affected = conn
        .execute("DELETE FROM NOTES WHERE N_ID = ?1", params![n_id])
        .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err(format!("No notes found with N_ID {}", n_id));
    }

    Ok(())
}