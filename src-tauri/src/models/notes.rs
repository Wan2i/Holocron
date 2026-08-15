use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Notes {
    pub n_id: i64,
    pub s_id: i64, // foreign key to Subject
    pub chapter: i64,
    pub name: String,
    pub file_path: String,
    pub created_at: String,
    pub updated_at: String,
}