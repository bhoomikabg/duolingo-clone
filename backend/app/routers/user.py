from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, UserProgress

router = APIRouter(tags=["User"])

DEFAULT_USER_ID = 1


@router.get("/api/user")
def get_user(db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == DEFAULT_USER_ID).first()


@router.get("/api/profile")
def get_profile(db: Session = Depends(get_db)):
    """
    Returns learner profile information.
    """

    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()

    completed_lessons = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == DEFAULT_USER_ID)
        .count()
    )

    return {
        "name": user.name,
        "xp": user.xp,
        "streak": user.streak,
        "hearts": user.hearts,
        "gems": user.gems,
        "completed_lessons": completed_lessons,
    }


@router.post("/api/refill-hearts")
def refill_hearts(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()

    user.hearts = 5

    db.commit()

    return {
        "message": "Hearts refilled successfully.",
        "hearts": user.hearts,
    }