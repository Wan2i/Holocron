use rusqlite::{Connection, Result};
use tauri::{AppHandle, Manager};

pub fn get_connection(app: &AppHandle) -> Result<Connection> {
    let dir = app
        .path()
        .app_data_dir()
        .expect("failed to resolve app data directory");
    std::fs::create_dir_all(&dir).expect("failed to create app data directory");

    let conn = Connection::open(dir.join("holocron.db"))?;
    conn.execute_batch("PRAGMA foreign_keys = ON;")?;

    Ok(conn)
}
