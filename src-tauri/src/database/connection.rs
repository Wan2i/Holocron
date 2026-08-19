use rusqlite::{Connection, Result};
use tauri::{AppHandle, Manager};

pub fn get_connection(app: &AppHandle) -> Result<Connection> {
    let dir = app.path().app_data_dir().expect("failed to resolve app data directory");
    std::fs::create_dir_all(&dir).expect("failed to create app data directory");

    let conn = Connection::open(dir.join("holocron.db"))?;
    conn.execute_batch("PRAGMA foreign_keys = ON;")?;

    Ok(conn)
}

pub fn init_schema(conn: &Connection) -> Result<()> {
    conn.execute_batch(include_str!("../../../database/schema.sql"))?;
    Ok(())
}

pub fn seed_if_empty(conn: &Connection) -> Result<()> {
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM CATEGORY",
        [],
        |row| row.get(0),
    )?;

    if count == 0 {
        conn.execute_batch(include_str!("../../../database/seed.sql"))?;
    }

    Ok(())
}
