import json

from fastapi import APIRouter, Depends, HTTPException
from ..schemas import CompleteLessonSchema
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Exercise, User, UserProgress

router = APIRouter(tags=["Lessons"])

DEFAULT_USER_ID = 1


@router.get("/api/lessons/{lesson_id}/exercises")
def get_exercises(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    """
    Returns all exercises for the specified lesson.
    """
    exercises = (
        db.query(Exercise)
        .filter(Exercise.lesson_id == lesson_id)
        .all()
    )

    if not exercises:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found."
        )

    return [
        {
            "id": exercise.id,
            "type": exercise.type,
            "question": exercise.question,
            "correct_answer": exercise.correct_answer,
            "choices": json.loads(exercise.choices_json),
        }
        for exercise in exercises
    ]


@router.post("/api/lessons/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
    data: CompleteLessonSchema,
    db: Session = Depends(get_db),
):
    """
    Marks a lesson as completed and updates the user's
    XP, hearts, streak, and lesson progress.
    """
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()

    user.xp += data.xp_earned
    user.hearts = data.hearts_remaining
    user.streak += 1

    existing = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == DEFAULT_USER_ID,
            UserProgress.lesson_id == lesson_id,
        )
        .first()
    )

    if not existing:
        db.add(
            UserProgress(
                user_id=DEFAULT_USER_ID,
                lesson_id=lesson_id,
            )
        )

    db.commit()

    return {
    "success": True,
    "message": "Lesson completed successfully.",
    "user": {
        "xp": user.xp,
        "hearts": user.hearts,
        "streak": user.streak,
    },
}