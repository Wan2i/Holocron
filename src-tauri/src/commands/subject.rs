use crate::database::connection::get_connection;
use crate::models::subject::Subject;

#[tauri::command]
pub fn get_subjects() -> Result<Vec<Subject>, String> {
    let conn = get_connection().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT S_ID, CODE, NAME, COLOR, CREATED_AT, UPDATED_AT
             FROM SUBJECT",
        )
        .map_err(|e| e.to_string())?;

    let subjects = stmt
        .query_map([], |row| {
            Ok(Subject {
                s_id: row.get(0)?,
                code: row.get(1)?,
                name: row.get(2)?,
                color: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result: Vec<Subject> = subjects
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(result)
}