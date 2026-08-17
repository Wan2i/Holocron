use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Category{
    pub c_id: i64,
    pub category: String,
}