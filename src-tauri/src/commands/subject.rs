use std::sync::Mutex;
use rusqlite::{Connection, params};
use tauri::State;
use crate::models::subject::Subject;

#[tauri::command]
pub fn get_subjects(conn: State<Mutex<Connection>>) -> Result<Vec<Subject>, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT S_ID, CODE, NAME, COLOR, CREATED_AT, UPDATED_AT FROM SUBJECT")
        .map_err(|e| e.to_string())?;

    let result: Vec<Subject> = stmt
        .query_map([], |row| {
            Ok(Subject {
                s_id: row.get("S_ID")?,
                code: row.get("CODE")?,
                name: row.get("NAME")?,
                color: row.get("COLOR")?,
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
pub fn create_subject(
    conn: State<Mutex<Connection>>,
    code: String,
    name: String,
    color: String,
) -> Result<Subject, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO SUBJECT (CODE, NAME, COLOR) VALUES (?1, ?2, ?3)",
        params![code, name, color],
    )
    .map_err(|e| e.to_string())?;

    let new_id = conn.last_insert_rowid();

    conn.query_row(
        "SELECT S_ID, CODE, NAME, COLOR, CREATED_AT, UPDATED_AT FROM SUBJECT WHERE S_ID = ?1",
        params![new_id],
        |row| {
            Ok(Subject {
                s_id: row.get("S_ID")?,
                code: row.get("CODE")?,
                name: row.get("NAME")?,
                color: row.get("COLOR")?,
                created_at: row.get("CREATED_AT")?,
                updated_at: row.get("UPDATED_AT")?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_subject(
    conn: State<Mutex<Connection>>,
    s_id: i64,
    code: String,
    name: String,
    color: String,
) -> Result<Subject, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let rows_affected = conn
        .execute(
            "UPDATE SUBJECT
             SET CODE = ?1, NAME = ?2, COLOR = ?3, UPDATED_AT = CURRENT_TIMESTAMP
             WHERE S_ID = ?4",
            params![code, name, color, s_id],
        )
        .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err(format!("No subject found with S_ID {}", s_id));
    }

    conn.query_row(
        "SELECT S_ID, CODE, NAME, COLOR, CREATED_AT, UPDATED_AT FROM SUBJECT WHERE S_ID = ?1",
        params![s_id],
        |row| {
            Ok(Subject {
                s_id: row.get("S_ID")?,
                code: row.get("CODE")?,
                name: row.get("NAME")?,
                color: row.get("COLOR")?,
                created_at: row.get("CREATED_AT")?,
                updated_at: row.get("UPDATED_AT")?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_subject(conn: State<Mutex<Connection>>, s_id: i64) -> Result<(), String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let rows_affected = conn
        .execute("DELETE FROM SUBJECT WHERE S_ID = ?1", params![s_id])
        .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err(format!("No subject found with S_ID {}", s_id));
    }

    Ok(())
}