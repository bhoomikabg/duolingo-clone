# Duolingo Clone Scaler

A full-stack Duolingo-inspired language learning application built using FastAPI and Next.js.

---
## Live Demo

**Frontend (Vercel):**
https://duolingo-clone-alpha-sandy.vercel.app

**Backend API (Render):**
https://duolingo-clone-l6kd.onrender.com


## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- FastAPI
- SQLAlchemy
- SQLite

---

## Features

- Interactive Duolingo-style Learning Path
- Animated Splash Screen with Owl
- Multiple Exercise Types
  - Multiple Choice
  - Translate
  - Fill in the Blank
  - Type Answer
- XP System
- Hearts System
- Streak Tracking
- Leaderboard
- Profile Page
- Settings Page
- Lesson Completion
- Persistent User Progress
- Responsive UI

---

## Project Structure

```
backend/
    models.py
    routes/
    database.py
    seed.py

frontend/
    app/
    components/
    lib/
```

---

## Database Schema

### User

| Field  | Type    |
|--------|---------|
| id     | Integer |
| name   | String  |
| streak | Integer |
| xp     | Integer |
| hearts | Integer |
| gems   | Integer |

### Unit

| Field | Type    |
|-------|---------|
| id    | Integer |
| title | String  |
| order | Integer |

### Skill

| Field   | Type    |
|---------|---------|
| id      | Integer |
| unit_id | Integer |
| name    | String  |
| icon    | String  |
| order   | Integer |

### Lesson

| Field    | Type    |
|----------|---------|
| id       | Integer |
| skill_id | Integer |
| order    | Integer |

### Exercise

| Field          | Type    |
|----------------|---------|
| id             | Integer |
| lesson_id      | Integer |
| type           | String  |
| question       | String  |
| correct_answer | String  |
| choices_json   | JSON    |

### UserProgress

| Field     | Type    |
|-----------|---------|
| user_id   | Integer |
| lesson_id | Integer |

---

## API Overview

### User

GET /api/user

---

### Learning Path

GET /api/path

---

### Lesson Exercises

GET /api/lessons/{lesson_id}/exercises

---

### Complete Lesson

POST /api/lessons/{lesson_id}/complete

---

### Leaderboard

GET /api/leaderboard

---

## Running Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

---

## Running Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on

```
http://localhost:3000
```

---

## Architecture

Frontend communicates with the FastAPI backend through REST APIs.

```
Next.js Frontend
        │
        ▼
 FastAPI REST APIs
        │
        ▼
 SQLAlchemy ORM
        │
        ▼
     SQLite Database
```
