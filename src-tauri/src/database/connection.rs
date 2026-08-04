use rusqlite::{Connection, Result};

pub fn get_connection() -> Result<Connection> {
    Connection::open("../database/holocron.db")
}