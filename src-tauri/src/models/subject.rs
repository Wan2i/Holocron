use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Subject {
    pub s_id: i64,
    pub code: String,
    pub name: String,
    pub color: String,
    pub created_at: String,
    pub updated_at: String,
}