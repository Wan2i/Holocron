# Holocron

Holocron is a desktop productivity application designed to help students manage academic life in a single workspace.

The project was created to solve a personal problem: keeping track of assignments, group projects, quizzes, tests, presentations, and study notes across multiple subjects.

Instead of scattering information across messaging apps, calendars, folders, and notebooks, Holocron aims to provide a centralized academic command center.

---

## Features

### Dashboard

View upcoming tasks grouped by subject.

Example:

- Assignment 2 - Operating Systems
- Group Project Presentation - Netcentric Computing
- Quiz 1 - Discrete Structures

---

### Calendar

Track important academic deadlines.

Features:

- Create tasks
- Schedule deadlines
- Visual calendar overview
- Upcoming events

---

### Subject Management

Organize subjects with custom colors.

Example:

| Code | Subject |
|--------|----------|
| CSC510 | Discrete Structures |
| CSC520 | Operating Systems |
| CSC569 | Computer Basic Application |

---

### Notes

Store and organize study materials by subject.

Supported file types:

- PDF
- DOCX
- PPTX
- TXT
- Other supported document formats

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Desktop Framework

- Tauri

### Backend

- Rust

### Database

- SQLite

---

## Database Design

Current entities:

### Subject

Stores subject information.

```text
S_ID
CODE
NAME
COLOR
CREATED_AT
UPDATED_AT