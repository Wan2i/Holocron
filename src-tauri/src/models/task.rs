use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub t_id: i64,
    pub title: String,
    pub due_date: String,
    pub completed: i64,
    pub created_at: String,
    pub updated_at: String,
    pub s_id: i64,
    pub c_id: i64,
}