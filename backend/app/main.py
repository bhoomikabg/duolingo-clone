from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .seed import seed_database

from .routers import (
    user,
    path,
    lesson,
    leaderboard,
)

# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------
app = FastAPI(
    title="Duolingo Clone API",
    version="1.0.0",
    description="Backend API for a Duolingo Clone built using FastAPI and SQLite.",
)

# --------------------------------------------------
# Startup Event
# --------------------------------------------------
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    seed_database()

# --------------------------------------------------
# CORS Configuration
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Register API Routers
# --------------------------------------------------
app.include_router(user.router)
app.include_router(path.router)
app.include_router(lesson.router)
app.include_router(leaderboard.router)


@app.get("/")
def root():
    """
    Health check endpoint.
    """
    return {
        "message": "Duolingo Clone API is running"
    }