use crate::models::task::Task;
use rusqlite::{params, Connection};
use std::sync::Mutex;
use tauri::State;


#[tauri::command]
pub fn get_task(conn: State<Mutex<Connection>>) -> Result<Vec<Task>, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT T_ID, TITLE, DUE_DATE, COMPLETED, CREATED_AT, UPDATED_AT, S_ID, C_ID FROM TASK",
        )
        .map_err(|e| e.to_string())?;

    let result: Vec<Task> = stmt
        .query_map([], |row| {
            Ok(Task {
                t_id: row.get("T_ID")?,
                title: row.get("TITLE")?,
                due_date: row.get("DUE_DATE")?,
                completed: row.get("COMPLETED")?,
                created_at: row.get("CREATED_AT")?,
                updated_at: row.get("UPDATED_AT")?,
                s_id: row.get("S_ID")?,
                c_id: row.get("C_ID")?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(result)
}

#[tauri::command]
pub fn create_task(
    conn: State<Mutex<Connection>>,
    title: String,
    due_date: String,
    completed: i64,
    s_id: i64,
    c_id: i64,
) -> Result<Task, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO TASK (TITLE, DUE_DATE, COMPLETED, S_ID, C_ID) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![title, due_date, completed, s_id, c_id],
    )
    .map_err(|e| e.to_string())?;

    let new_id = conn.last_insert_rowid();

    conn.query_row(
        "SELECT T_ID, TITLE, DUE_DATE, COMPLETED, CREATED_AT, UPDATED_AT, S_ID, C_ID FROM TASK WHERE T_ID = ?1",
        params![new_id],
        |row| {
            Ok(Task {
                t_id: row.get("T_ID")?,
                title: row.get("TITLE")?,
                due_date: row.get("DUE_DATE")?,
                completed: row.get("COMPLETED")?,
                created_at: row.get("CREATED_AT")?,
                updated_at: row.get("UPDATED_AT")?,
                s_id: row.get("S_ID")?,
                c_id: row.get("C_ID")?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_task(
    conn: State<Mutex<Connection>>,
    t_id: i64,
    title: String,
    due_date: String,
    completed: i64,
    s_id: i64,
    c_id: i64,
) -> Result<Task, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let rows_affected = conn
        .execute(
            "UPDATE TASK
             SET TITLE = ?1, DUE_DATE = ?2, COMPLETED = ?3, S_ID = ?4, C_ID = ?5, UPDATED_AT = CURRENT_TIMESTAMP
             WHERE T_ID = ?6",
            params![title, due_date, completed, s_id, c_id, t_id],
        )
        .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err(format!("No task found with T_ID {}", t_id));
    }

    conn.query_row(
        "SELECT T_ID, TITLE, DUE_DATE, COMPLETED, CREATED_AT, UPDATED_AT, S_ID, C_ID FROM TASK WHERE T_ID = ?1",
        params![t_id],
        |row| {
            Ok(Task {
                t_id: row.get("T_ID")?,
                title: row.get("TITLE")?,
                due_date: row.get("DUE_DATE")?,
                completed: row.get("COMPLETED")?,
                created_at: row.get("CREATED_AT")?,
                updated_at: row.get("UPDATED_AT")?,
                s_id: row.get("S_ID")?,
                c_id: row.get("C_ID")?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_task(conn: State<Mutex<Connection>>, t_id: i64) -> Result<(), String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;

    let rows_affected = conn
        .execute("DELETE FROM TASK WHERE T_ID = ?1", params![t_id])
        .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err(format!("No task found with T_ID {}", t_id));
    }

    Ok(())
}